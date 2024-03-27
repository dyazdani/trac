import { 
    Button,
    useToast 
} from "@chakra-ui/react";
import { 
    CheckIcon, 
    RepeatClockIcon 
} from "@chakra-ui/icons";
import {  
    useCreateScheduleMutation, 
    useDeleteSchedulesMutation, 
    useGetMilestonesByUserQuery, 
    useUpdateHabitMutation, 
    useUpdateMilestoneMutation 
} from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { MilestoneWithDetails } from "../../types/index.js";
import getFirstCheckInDayDate from "../utils/getFirstCheckInDayDate.js";
import isMostRecentStatusReportSent from "../utils/isMostRecentStatusReportSent.js";
import { useDispatch } from "react-redux";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import doOtherMilestonesHaveStatusReportDue from "../utils/doOtherMilestonesHaveStatusReportDue.js";
import { DayOfTheWeek, User } from "@prisma/client";
import getHabitScheduleIds from "../utils/getHabitScheduleIds.js";
import { DaysOfWeek, Schedule } from "@knocklabs/node";
import getDaysOfWeekArray from "../utils/getDaysOfWeekArray.js";
import getCapitalizedDayOfTheWeek from "../utils/getCapitalizedDayOfTheWeek.js";

export interface CompleteMilestoneButtonProps{
    milestone: MilestoneWithDetails
}

const CompleteMilestoneButton = ({milestone}: CompleteMilestoneButtonProps) => {
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
    const dispatch= useDispatch();
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    if (currentUser) {
        const currentUserId = currentUser.id
        const { 
            data, 
            isLoading: isMilestonesLoading, 
            error 
        } = useGetMilestonesByUserQuery(currentUserId); 

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
                        isCompleted: !milestone.isCompleted,
                        isCanceled: milestone.isCanceled
                    }
                }).unwrap();
        
                if (updatedMilestone) {
                    const scheduleIds = getHabitScheduleIds(updatedMilestone);

                    if (updatedMilestone.isCompleted) {
                        if (!updatedMilestone.isCanceled){
                            const deleteSchedulesResult = await deleteSchedules({
                                scheduleIds
                            }).unwrap();
                        }

                        toast({
                            title: 'Goal Completed!',
                            description: `Your Goal "${updatedMilestone.name}" was marked as complete.`,
                            variant: 'subtle',
                            status: 'success',
                            duration: 9000,
                            isClosable: true
                        })
                        if (data) {
                            if (data.milestones.length) {
                                if (!doOtherMilestonesHaveStatusReportDue(milestone, data.milestones)) {
                                    dispatch(setIsBannerDisplayed(false))
                                }
                            }                       
                        }
                        
                    } else {
                        if (!updatedMilestone.isCanceled) {
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
                            title: 'Goal Incomplete',
                            description: `Your Goal "${milestone.name}" was marked as incomplete.`,
                            variant: 'subtle',
                            status: 'info',
                            duration: 9000,
                            isClosable: true,
                            icon: <RepeatClockIcon boxSize={"1.4em"}/>
                        })
                        
                        if (
                            !updatedMilestone.isCanceled &&
                            updatedMilestone.habits.some(habit => {
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
                        description: `Unable to mark Goal "${milestone.name}" as complete or incomplete`,
                        status: 'error',
                        duration: 9000,
                        isClosable: true
                    })
                }
            } catch (e) {
                console.error(e)
                toast({
                    title: 'ERROR',
                    description: `Unable to mark Goal "${milestone.name}" as complete or incomplete`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                })
            }    
        } else {
            toast({
                title: 'ERROR',
                description: `Unable to mark Goal "${milestone.name}" as complete or incomplete`,
                status: 'error',
                duration: 9000,
                isClosable: true
            })
        }
    }
        return (
            <Button 
                aria-label="Complete goal" 
                leftIcon={milestone.isCompleted ? undefined : <CheckIcon />}
                backgroundColor={milestone.isCompleted ? "peach.100" : "peach.300"}
                color={milestone.isCompleted ? "peach.700" : "#353231"}
                _hover={
                    milestone.isCompleted ? 
                    { backgroundColor: "peach.200"} :
                    { backgroundColor: "peach.500"}
                }
                _active={{
                    backgroundColor: "peach.600",
                    color: "floralwhite.50"
                }}
                flexShrink="0"
                isLoading={
                    isUpdateMilestoneLoading || 
                    isMilestonesLoading ||
                    isDeleteSchedulesLoading ||
                    isCreateScheduleLoading ||
                    isUpdateHabitLoading
                }
                isDisabled={
                    isUpdateMilestoneLoading || 
                    isMilestonesLoading ||
                    isDeleteSchedulesLoading ||
                    isCreateScheduleLoading ||
                    isUpdateHabitLoading
                }
                onClick={(e) => {
                    e.preventDefault();
                    handleClick();
                }}
            >
                {milestone.isCompleted ? "Undo Complete Goal" : "Complete Goal"}
            </Button>           
        )
    }
}

export default CompleteMilestoneButton;