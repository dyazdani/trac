import { 
    MenuItem, 
    useToast 
} from "@chakra-ui/react";
import { 
    ArrowUpIcon,
    NotAllowedIcon 
} from "@chakra-ui/icons";
import {  
    useCreateScheduleMutation, 
    useDeleteSchedulesMutation, 
    useGetGoalsByUserQuery, 
    useUpdateHabitMutation, 
    useUpdateGoalMutation 
} from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { GoalWithDetails } from "../../types/index.js";
import { useDispatch } from "react-redux";
import doOtherGoalsHaveStatusReportDue from "../utils/doOtherGoalsHaveStatusReportDue.js";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import getFirstCheckInDayDate from "../utils/getFirstCheckInDayDate.js";
import isMostRecentStatusReportSent from "../utils/isMostRecentStatusReportSent.js";
import { DayOfTheWeek, User } from "@prisma/client";
import getHabitScheduleIds from "../utils/getHabitScheduleIds.js";
import { DaysOfWeek, Schedule } from "@knocklabs/node";
import getCapitalizedDayOfTheWeek from "../utils/getCapitalizedDayOfTheWeek.js";

export interface CancelGoalButtonProps{
    goal: GoalWithDetails
}

const CancelGoalButton = ({goal}: CancelGoalButtonProps) => {
    const [
        updateGoal, 
        {
            isLoading: isUpdateGoalLoading, 
            error: updateGoalError
        }
    ] = useUpdateGoalMutation();
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
        const { data, isLoading: isGoalsLoading, error } = useGetGoalsByUserQuery(currentUserId); 

    const handleClick = async () => {
        if (
            typeof error === "undefined" &&
            typeof deleteSchedulesError === "undefined" &&
            typeof createScheduleError === "undefined" && 
            typeof updateHabitError === "undefined" &&
            typeof updateGoalError === "undefined"
        ) {
            try {
                const { goal: updatedGoal } = await updateGoal({
                    ownerId: currentUser.id,
                    goalId: goal.id,
                    newGoal: {
                        name: goal.name,
                        dueDate: goal.dueDate,
                        isCompleted: goal.isCompleted,
                        isCanceled: !goal.isCanceled
                    }
                }).unwrap();
        
                if (updatedGoal) {
                    const scheduleIds = getHabitScheduleIds(updatedGoal);

                    if (updatedGoal.isCanceled) {
                        if (!updatedGoal.isCompleted){
                            const deleteSchedulesResult = await deleteSchedules({
                                scheduleIds
                            }).unwrap();
                        }
                        toast({
                            title: 'Goal Canceled',
                            description: `Your Goal "${updatedGoal.name}" was canceled.`,
                            status: 'info',
                            variant: 'subtle',
                            duration: 9000,
                            isClosable: true,
                            icon: <NotAllowedIcon boxSize="1.4em"/>
                        })

                        if (data) {
                            if (!doOtherGoalsHaveStatusReportDue(goal, data.goals)) {
                                dispatch(setIsBannerDisplayed(false))
                            }
                        }
                    } else {
                        if (!updatedGoal.isCompleted) {
                            let createdSchedules: Schedule[] = []

                            for (let i = 0; i < goal.habits.length; i++) {
                                const {
                                    name: habitName, 
                                    datesCompleted, 
                                    id: habitId,
                                    checkIn, 
                                    routine
                                } = goal.habits[i]

                                const { schedules } = await createSchedule({
                                    habitName,
                                    goalName: goal.name,
                                    days: [DaysOfWeek[getCapitalizedDayOfTheWeek(goal.habits[i].checkIn.dayOfTheWeek).slice(0, 3) as keyof typeof DaysOfWeek]],
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
                            description: `Your Goal "${updatedGoal.name}" was restored.`,
                            status: 'success',
                            variant: 'subtle',
                            duration: 9000,
                            isClosable: true,
                            icon: <ArrowUpIcon boxSize="1.4em"/>
                        })

                        if (
                            !goal.isCompleted &&
                            goal.habits.some(habit => {
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
                        description: `Unable to cancel or restore "${goal.name}"`,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                }
            } catch (e) {
                console.error(e)
                toast({
                    title: 'ERROR',
                    description: `Unable to cancel or restore Goal "${goal.name}"`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                })
            }
        } else {
            toast({
                title: 'ERROR',
                description: `Unable to cancel or restore Goal "${goal.name}"`,
                status: 'error',
                duration: 9000,
                isClosable: true
            })
        }
    }
        return (
            <MenuItem 
                aria-label={goal.isCanceled ? "Restore Goal" : "Cancel Goal"} 
                icon={goal.isCanceled ? (<ArrowUpIcon />) : (<NotAllowedIcon/>)} 
                backgroundColor="turquoise.50"
                isDisabled={
                    isUpdateGoalLoading || 
                    isGoalsLoading ||
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
            >{goal.isCanceled ? "Restore Goal" : "Cancel Goal"}</MenuItem>           
        )
    }
}

export default CancelGoalButton;