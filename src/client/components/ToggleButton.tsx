import { 
    Button,
    Box,
    useBoolean,
    FormLabel,
    FormControl,
    VStack,
    Checkbox
 } from "@chakra-ui/react";
 import isDateToday from "..//utils/isDateToday.js";
import getDayOfWeekLabelText from "..//utils/getDayOfWeekLabelText.js";
import { useUpdateHabitMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { HabitWithDetails, MilestoneWithDetails } from "../../types/index.js";
import areDatesSameDayMonthYear from "..//utils/areDatesSameDayMonthYear.js";
import DiamondImage from "./DiamondImage.js";
import isDateOutOfRange from "..//utils/isDateOutOfRange.js";
import isHabitRoutineDay from "./isHabitRoutineDay.js";
import { useState } from "react";

 export interface ToggleButtonProps {
    date: Date
    milestone: MilestoneWithDetails
    habit: HabitWithDetails
    isCheckInDay: boolean
 }

const ToggleButton = ({date, milestone, habit, isCheckInDay}: ToggleButtonProps) => {
    const [isChecked, setIsChecked] = useState(!!habit.datesCompleted.find(el => areDatesSameDayMonthYear(new Date(el), date)));
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    const [updateHabit, {data, isLoading, error}] = useUpdateHabitMutation();
    
    // variable for current habit details to be sent with update mutation
    let habitData: HabitWithDetails;

    if (currentUser) {
        habitData = habit
    }
        
    // get boolean for if the date prop is today's date
    const isToday = isDateToday(date);
    

    // background color changes when Habit is completed or canceled
    const backgroundColor = milestone.isCompleted ? "rgba(249, 209, 98, 0.1)" : milestone.isCanceled ? "rgba(212, 211, 212, 1)" : "rgb(249, 209, 98)"

    // extract day of the week abbreviation for label
    const dayAbbreviation = getDayOfWeekLabelText(date);

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
            const newDatesCompleted = isChecked ? 
            habitData.datesCompleted.filter((el) => {
                return !areDatesSameDayMonthYear(new Date(el), date);
            }) : 
            [...habitData.datesCompleted, date]

            const currentHabit = await updateHabit({
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
            })
        }
    }

    return (
        <>
            {/* {isToday && !milestone.isCanceled && !milestone.isCompleted && <DiamondImage/>} */}
            <Checkbox
                isChecked={isChecked}
                size="lg"
                colorScheme="green"
                onChange={(e) => {
                    e.preventDefault();
                    handleSubmit();
                    setIsChecked(!isChecked);
                }}
                isDisabled={ 
                    !isHabitRoutineDay(habit, date) || 
                    milestone.isCanceled ||
                    isDateOutOfRange(
                        new Date(habit.dateCreated), 
                        new Date(),
                        date
                    ) || 
                    milestone && milestone.isCompleted                   
                }    
            >{dayAbbreviation}</Checkbox>
        </>
    )
}

export default ToggleButton;