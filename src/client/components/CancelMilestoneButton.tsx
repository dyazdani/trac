import { 
    MenuItem, 
    useToast 
} from "@chakra-ui/react";
import { ArrowUpIcon, NotAllowedIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {  useCreateScheduleMutation, useDeleteSchedulesMutation, useGetMilestonesByUserQuery, useUpdateHabitMutation, useUpdateMilestoneMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { MilestoneWithDetails } from "../../types/index.js";
import { useDispatch } from "react-redux";
import doOtherMilestonesHaveStatusReportDue from "../utils/doOtherMilestonesHaveStatusReportDue.js";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import getFirstCheckInDayDate from "../utils/getFirstCheckInDayDate.js";
import isMostRecentStatusReportSent from "../utils/isMostRecentStatusReportSent.js";
import { DayOfTheWeek, User } from "@prisma/client";
import getHabitScheduleIds from "../utils/getHabitScheduleIds.js";
import { DaysOfWeek, Schedule } from "@knocklabs/node";
import getCapitalizedDayOfTheWeek from "../utils/getCapitalizedDayOfTheWeek.js";

export interface CancelMilestoneButtonProps{
    milestone: MilestoneWithDetails
}

const CancelMilestoneButton = ({milestone}: CancelMilestoneButtonProps) => {
    const [
        updateMilestone, 
        {
            isLoading: isUpdateMilestoneLoading, 
            error: updateMilestoneError
        }
    ] = useUpdateMilestoneMutation();
    const [
        deleteSchedules, 
        {
            isLoading: isDeleteSchedulesLoading, 
            error: deleteSchedulesError
        }
    ] = useDeleteSchedulesMutation();
    const [
        createSchedule, 
        {
            isLoading: isCreateScheduleLoading, 
            error: createScheduleError
        }
    ] = useCreateScheduleMutation();
    const [
        updateHabit, {
            isLoading: isUpdateHabitLoading,
            error: updateHabitError
        }
    ] = useUpdateHabitMutation();   

    const toast = useToast();
    const dispatch = useDispatch();
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    if (currentUser) {
        const currentUserId = currentUser.id
        const { data, isLoading: isMilestonesLoading, error } = useGetMilestonesByUserQuery(currentUserId); 

    const handleClick = async () => {
        if (
            typeof error === "undefined" &&
            typeof deleteSchedulesError === "undefined" &&
            typeof createScheduleError === "undefined" && 
            typeof updateHabitError === "undefined" &&
            typeof updateMilestoneError === "undefined"
        ) {
            try {
                const { milestone: updatedMilestone } = await updateMilestone({
                    ownerId: currentUser.id,
                    milestoneId: milestone.id,
                    newMilestone: {
                        name: milestone.name,
                        dueDate: milestone.dueDate,
                        isCompleted: milestone.isCompleted,
                        isCanceled: !milestone.isCanceled
                    }
                }).unwrap();
        
                if (updatedMilestone) {
                    const scheduleIds = getHabitScheduleIds(updatedMilestone);

                    if (updatedMilestone.isCanceled) {
                        if (!updatedMilestone.isCompleted){
                            const deleteSchedulesResult = await deleteSchedules({
                                scheduleIds
                            }).unwrap();
                        }
                        toast({
                            title: 'Goal Canceled',
                            description: `Your Goal "${updatedMilestone.name}" was canceled.`,
                            status: 'info',
                            variant: 'subtle',
                            duration: 9000,
                            isClosable: true,
                            icon: <NotAllowedIcon boxSize="1.4em"/>
                        })

                        if (data) {
                            if (!doOtherMilestonesHaveStatusReportDue(milestone, data.milestones)) {
                                dispatch(setIsBannerDisplayed(false))
                            }
                        }
                    } else {
                        if (!updatedMilestone.isCompleted) {
                            let createdSchedules: Schedule[] = []

                            for (let i = 0; i < milestone.habits.length; i++) {
                                const {
                                    name: habitName, 
                                    datesCompleted, 
                                    id: habitId,
                                    checkIn, 
                                    routine
                                } = milestone.habits[i]

                                const { schedules } = await createSchedule({
                                    habitName,
                                    milestoneName: milestone.name,
                                    days: [DaysOfWeek[getCapitalizedDayOfTheWeek(milestone.habits[i].checkIn.dayOfTheWeek).slice(0, 3) as keyof typeof DaysOfWeek]],
                                    workflowKey: "check-in-day"
                                }).unwrap()
                                
                                createdSchedules.push(schedules[0])

                                const { habit: updatedHabit } = await updateHabit({
                                    id: currentUser.id,
                                    habitId,
                                    newHabit: {
                                        name: habitName,
                                        datesCompleted,
                                        routineDays: {
                                            sunday: routine.sunday,
                                            monday: routine.monday,
                                            tuesday: routine.tuesday,
                                            wednesday: routine.wednesday,
                                            thursday: routine.thursday,
                                            friday: routine.friday,
                                            saturday: routine.saturday,
                                        },
                                        checkInDay: DayOfTheWeek[checkIn.dayOfTheWeek as keyof typeof DayOfTheWeek],
                                        scheduleId: schedules[0].id
                                    }
                                }).unwrap()
                            }
                        }
                        
                        toast({
                            title: 'Goal Restored',
                            description: `Your Goal "${updatedMilestone.name}" was restored.`,
                            status: 'success',
                            variant: 'subtle',
                            duration: 9000,
                            isClosable: true,
                            icon: <ArrowUpIcon boxSize="1.4em"/>
                        })

                        if (
                            !milestone.isCompleted &&
                            milestone.habits.some(habit => {
                                const firstCheckInDate = getFirstCheckInDayDate(habit);
                                if (firstCheckInDate) {
                                    return (
                                        firstCheckInDate.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) &&
                                        !isMostRecentStatusReportSent(habit)
                                    )
                                }
                            })    
                        ) {
                            dispatch(setIsBannerDisplayed(true))
                        }
                    }
                } else {
                    toast({
                        title: 'ERROR',
                        description: `Unable to cancel or restore "${milestone.name}"`,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                }
            } catch (e) {
                console.error(e)
                toast({
                    title: 'ERROR',
                    description: `Unable to cancel or restore Goal "${milestone.name}"`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                })
            }
        } else {
            toast({
                title: 'ERROR',
                description: `Unable to cancel or restore Goal "${milestone.name}"`,
                status: 'error',
                duration: 9000,
                isClosable: true
            })
        }
    }
        return (
            <MenuItem 
                aria-label={milestone.isCanceled ? "Restore Goal" : "Cancel Goal"} 
                icon={milestone.isCanceled ? (<ArrowUpIcon />) : (<NotAllowedIcon/>)} 
                backgroundColor="turquoise.50"
                isDisabled={
                    isUpdateMilestoneLoading || 
                    isMilestonesLoading ||
                    isDeleteSchedulesLoading ||
                    isCreateScheduleLoading ||
                    isUpdateHabitLoading
                }
                _hover={{
                    backgroundColor: "turquoise.100"
                }}
                _active={{
                    backgroundColor: "turquoise.200"
                }}
                onClick={(e) => {
                    e.preventDefault();
                    handleClick();
                }}
            >{milestone.isCanceled ? "Restore Goal" : "Cancel Goal"}</MenuItem>           
        )
    }
}

export default CancelMilestoneButton;