import { 
    Checkbox,
    Spinner, 
    useToast
} from "@chakra-ui/react";
import { useUpdateHabitMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { 
    HabitWithDetails,
    GoalWithDetails 
} from "../../types/index.js";
import areDatesSameDayMonthYear from "..//utils/areDatesSameDayMonthYear.js";
import isHabitRoutineDay from "../utils/isHabitRoutineDay.js";
import { 
    CheckIcon, 
    RepeatClockIcon 
} from "@chakra-ui/icons";
import { User } from "@prisma/client";
import { useState } from "react";

 export interface ToggleButtonProps {
    date: Date
    goal: GoalWithDetails
    habit: HabitWithDetails
    isOutOfRange: boolean
    isToggleLoading: boolean
    setIsToggleLoading: (arg0: boolean) => void
 }

const ToggleButton = ({
        date, 
        goal, 
        habit, 
        isOutOfRange, 
        isToggleLoading,
        setIsToggleLoading
    }: ToggleButtonProps) => {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser

    const [isCompleted, setIsCompleted] = useState(!!habit.datesCompleted.find(el => areDatesSameDayMonthYear(new Date(el), date)))
    const toast = useToast();
    
    const [updateHabit, {isLoading}] = useUpdateHabitMutation();
    
    // variable for current habit details to be sent with update mutation
    let habitData: HabitWithDetails;

    if (currentUser) {
        habitData = habit
    }

    const handleSubmit = async () => {
        if (currentUser && habitData && !isToggleLoading) {
            const {
                monday,
                tuesday,
                wednesday,
                thursday,
                friday,
                saturday,
                sunday
            } = habitData.routine

            // determine whether to add or subtract this button's date
            const newDatesCompleted = isCompleted ? 
            habitData.datesCompleted.filter((el) => {
                return !areDatesSameDayMonthYear(new Date(el), date);
            }) : 
            [...habitData.datesCompleted, date]

            try {
                setIsCompleted(!isCompleted);
                setIsToggleLoading(true);
                const updateResult = await updateHabit({
                    id: currentUser?.id,
                    habitId: habit.id,
                    newHabit: {
                        name: habitData.name,
                        datesCompleted: newDatesCompleted,
                        routineDays: {
                            monday,
                            tuesday,
                            wednesday,
                            thursday,
                            friday,
                            saturday,
                            sunday
                        },
                        checkInDay: habitData.checkIn.dayOfTheWeek,
                        scheduleId: habit.scheduleId
                    }
                }).unwrap()

                setIsToggleLoading(false);
    
                if (updateResult.habit.datesCompleted.length > habit.datesCompleted.length) {
                    toast({
                        title: 'Routine Day Completed',
                        description: `"${habit.name}" completed for ${
                            date.toLocaleDateString(
                                undefined, 
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            )}.`,
                        status: 'success',
                        variant: 'subtle',
                        isClosable: true,
                        icon: <CheckIcon boxSize="1.4em"/>
                    })
                }

                if (updateResult.habit.datesCompleted.length < habit.datesCompleted.length) {
                    toast({
                        title: 'Routine Day Incomplete',
                        description: `"${habit.name}" marked incomplete for ${
                            date.toLocaleDateString(
                                undefined, 
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            )}.`,
                        status: 'info',
                        variant: 'subtle',
                        isClosable: true,
                        icon: <RepeatClockIcon boxSize="1.4em"/>
                    })
                }
            } catch (e) {
                toast({
                    title: 'ERROR',
                    description: `Unable to complete "${habit.name}" for ${date.toLocaleDateString(
                        undefined, 
                        {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }
                    )}`,
                    status: 'error',
                    isClosable: true
                })
                setIsToggleLoading(false);
            }  
        }
    }

    return (
        isLoading ?
        <Spinner 
            color="#3a3c3c" 
            size="sm"
        /> :
        <Checkbox
            isChecked={isCompleted}
            size={{
                base: "sm",
                'smaller-md': "md",
                'sm-md': "lg"
              }}
            colorScheme="peach"
            borderColor="#3a3c3c"
            _disabled={{
                "& .chakra-checkbox__control": { 
                    borderColor: "darkslategray.600",
                    cursor: "not-allowed"
                }
            }}
            _checked={{
                "& .chakra-checkbox__control": { 
                    borderColor: "#3a3c3c",
                    color:  `${goal.isCompleted || goal.isCanceled ? "#FFFFFF" : "#3a3c3c"}`
                }
            }}
            onChange={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            isDisabled={ 
                goal.isCanceled ||
                isOutOfRange || 
                goal && goal.isCompleted ||
                isLoading
            } 
            display={!isHabitRoutineDay(habit, date) ? "none" : ""}
        />
    )
}

export default ToggleButton;