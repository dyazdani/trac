import { 
    Button,
    IconButton,
    useBreakpointValue,
    useToast 
} from "@chakra-ui/react";
import { 
    CheckIcon, 
    RepeatClockIcon 
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
import getFirstCheckInDayDate from "../utils/getFirstCheckInDayDate.js";
import isMostRecentStatusReportSent from "../utils/isMostRecentStatusReportSent.js";
import { useDispatch } from "react-redux";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import doOtherGoalsHaveStatusReportDue from "../utils/doOtherGoalsHaveStatusReportDue.js";
import { DayOfTheWeek, User } from "@prisma/client";
import getHabitScheduleIds from "../utils/getHabitScheduleIds.js";
import { DaysOfWeek, Schedule } from "@knocklabs/node";
import getDaysOfWeekArray from "../utils/getDaysOfWeekArray.js";
import getCapitalizedDayOfTheWeek from "../utils/getCapitalizedDayOfTheWeek.js";

export interface CompleteGoalButtonProps{
    goal: GoalWithDetails
}

const CompleteGoalButton = ({goal}: CompleteGoalButtonProps) => {
        const breakpoint = useBreakpointValue(
        {
            base: {
                undo: "Undo",
                complete: "Complete"
            },
            xl: {
                undo: "Undo Complete Goal",
                complete: "Complete Goal"
            }
        },
        {ssr: false}
    )
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
    const dispatch= useDispatch();
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    if (currentUser) {
        const currentUserId = currentUser.id
        const { 
            data, 
            isLoading: isGoalsLoading, 
            error 
        } = useGetGoalsByUserQuery(currentUserId); 

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
                        isCompleted: !goal.isCompleted,
                        isCanceled: goal.isCanceled
                    }
                }).unwrap();
        
                if (updatedGoal) {
                    const scheduleIds = getHabitScheduleIds(updatedGoal);

                    if (updatedGoal.isCompleted) {
                        if (!updatedGoal.isCanceled){
                            const deleteSchedulesResult = await deleteSchedules({
                                scheduleIds
                            }).unwrap();
                        }

                        toast({
                            title: 'Goal Completed!',
                            description: `Your Goal "${updatedGoal.name}" was marked as complete.`,
                            variant: 'subtle',
                            status: 'success',
                            duration: 9000,
                            isClosable: true
                        })
                        if (data) {
                            if (data.goals.length) {
                                if (!doOtherGoalsHaveStatusReportDue(goal, data.goals)) {
                                    dispatch(setIsBannerDisplayed(false))
                                }
                            }                       
                        }
                        
                    } else {
                        if (!updatedGoal.isCanceled) {
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
                            title: 'Goal Incomplete',
                            description: `Your Goal "${goal.name}" was marked as incomplete.`,
                            variant: 'subtle',
                            status: 'info',
                            duration: 9000,
                            isClosable: true,
                            icon: <RepeatClockIcon boxSize={"1.4em"}/>
                        })
                        
                        if (
                            !updatedGoal.isCanceled &&
                            updatedGoal.habits.some(habit => {
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
                        description: `Unable to mark Goal "${goal.name}" as complete or incomplete`,
                        status: 'error',
                        duration: 9000,
                        isClosable: true
                    })
                }
            } catch (e) {
                console.error(e)
                toast({
                    title: 'ERROR',
                    description: `Unable to mark Goal "${goal.name}" as complete or incomplete`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                })
            }    
        } else {
            toast({
                title: 'ERROR',
                description: `Unable to mark Goal "${goal.name}" as complete or incomplete`,
                status: 'error',
                duration: 9000,
                isClosable: true
            })
        }
    }
        return (
            <Button
                marginInlineEnd={0} 
                aria-label="Complete goal" 
                // leftIcon={goal.isCompleted ? undefined : <CheckIcon/>}
                backgroundColor={goal.isCompleted ? "peach.100" : "peach.300"}
                color={goal.isCompleted ? "peach.700" : "#353231"}
                _hover={
                    goal.isCompleted ? 
                    { backgroundColor: "peach.200"} :
                    { backgroundColor: "peach.500"}
                }
                _active={{
                    backgroundColor: "peach.600",
                    color: "floralwhite.50"
                }}
                flexShrink="0"
                isLoading={
                    isUpdateGoalLoading || 
                    isGoalsLoading ||
                    isDeleteSchedulesLoading ||
                    isCreateScheduleLoading ||
                    isUpdateHabitLoading
                }
                isDisabled={
                    isUpdateGoalLoading || 
                    isGoalsLoading ||
                    isDeleteSchedulesLoading ||
                    isCreateScheduleLoading ||
                    isUpdateHabitLoading
                }
                onClick={(e) => {
                    e.preventDefault();
                    handleClick();
                }}
            >
                {goal.isCompleted ? breakpoint?.undo : breakpoint?.complete}
            </Button>           
        )
    }
}

export default CompleteGoalButton;