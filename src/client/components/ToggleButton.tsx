import { 
    Checkbox,
    Spinner, 
    useToast
} from "@chakra-ui/react";
import { useUpdateHabitMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { 
    HabitWithDetails,
    MilestoneWithDetails 
} from "../../types/index.js";
import areDatesSameDayMonthYear from "..//utils/areDatesSameDayMonthYear.js";
import isHabitRoutineDay from "../utils/isHabitRoutineDay.js";
import { CheckIcon, RepeatClockIcon } from "@chakra-ui/icons";

 export interface ToggleButtonProps {
    date: Date
    milestone: MilestoneWithDetails
    habit: HabitWithDetails
    isOutOfRange: boolean
 }

const ToggleButton = ({
        date, 
        milestone, 
        habit, 
        isOutOfRange, 
    }: ToggleButtonProps) => {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser

    const toast = useToast();
    
    const [updateHabit, {isLoading, error}] = useUpdateHabitMutation();

    const isCompleted = !!habit.datesCompleted.find(el => areDatesSameDayMonthYear(new Date(el), date))
    
    // variable for current habit details to be sent with update mutation
    let habitData: HabitWithDetails;

    if (currentUser) {
        habitData = habit
    }

    const handleSubmit = async () => {
        if (currentUser && habitData && !isLoading) {
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
                        duration: 9000,
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
                        duration: 9000,
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
                    duration: 9000,
                    isClosable: true
                })
            }      
        }
    }

    return (
        isLoading ?
        <Spinner color="#3a3c3c" size="sm"/> :
        <Checkbox
            isChecked={isCompleted}
            size="lg"
            colorScheme="peach"
            borderColor="#3a3c3c"
            _checked={{
                "& .chakra-checkbox__control": { 
                    borderColor: "#3a3c3c",
                    color:  "#3a3c3c"
                }
            }}
            onChange={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            isDisabled={ 
                milestone.isCanceled ||
                isOutOfRange || 
                milestone && milestone.isCompleted                
            } 
            display={!isHabitRoutineDay(habit, date) ? "none" : ""}
        />
    )
}

export default ToggleButton;