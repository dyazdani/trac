import { 
     Text,
    Checkbox,
    VStack,
    HStack,
    Spacer,
    Grid
 } from "@chakra-ui/react";
 import isDateToday from "..//utils/isDateToday.js";
import { useUpdateHabitMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { 
    HabitWithDetails,
     MilestoneWithDetails 
    } from "../../types/index.js";
import areDatesSameDayMonthYear from "..//utils/areDatesSameDayMonthYear.js";
import DiamondImage from "./DiamondImage.js";
import isDateOutOfRange from "..//utils/isDateOutOfRange.js";
import isHabitRoutineDay from "./isHabitRoutineDay.js";
import { useState } from "react";
import { ChevronUpIcon, MinusIcon } from "@chakra-ui/icons";

 export interface ToggleButtonProps {
    date: Date
    milestone: MilestoneWithDetails
    habit: HabitWithDetails
 }

const ToggleButton = ({date, milestone, habit}: ToggleButtonProps) => {
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

    const isOutOfRange = isDateOutOfRange(new Date(habit.dateCreated), new Date(), date)

    return (
        <Checkbox
            isChecked={isChecked}
            size="lg"
            colorScheme="green"
            borderColor="#3a3c3c"
            _checked={{
                "& .chakra-checkbox__control": { borderColor: "#3a3c3c" }
            }}
            _disabled={{
                "& .chakra-checkbox__control": { borderColor: "#3a3c3c" }
            }}
            onChange={(e) => {
                e.preventDefault();
                handleSubmit();
                setIsChecked(!isChecked);
            }}
            isDisabled={ 
                milestone.isCanceled ||
                isOutOfRange || 
                milestone && milestone.isCompleted                   
            }    
            display={!isHabitRoutineDay(habit, date) ? "none" : ""}
        />

        // <VStack>
        //     {/* {isToday && !milestone.isCanceled && !milestone.isCompleted && <DiamondImage/>} */}
        //     <Spacer/>
        //     <HStack>
        //         {date.getDay() !== 0 ? 
        //             <>
        //                 <Spacer/>
        //                 <Spacer/>
        //                 <Spacer/>
        //             </> : 
        //             ""
        //         }
        //         <Text>{dayAbbreviation}</Text>
        //     </HStack>
        //     <HStack>
        //     {date.getDay() !== 0 ? <MinusIcon />: ""}
        //         <VStack>
        //             {/* {
        //                 isCheckInDay ? 
        //                 <>
        //                     <Spacer/>
        //                     <Spacer/>
        //                     <Spacer/>
        //                     <Spacer/>
        //                     <Spacer/>
        //                     <Spacer/>
        //                     <Spacer/>
        //                 </> :                 
        //                 ""
        //             }    */}
        //             <Checkbox
        //                 isChecked={isChecked}
        //                 size="lg"
        //                 borderColor="#3a3c3c"
        //                 colorScheme="green"
        //                 onChange={(e) => {
        //                     e.preventDefault();
        //                     handleSubmit();
        //                     setIsChecked(!isChecked);
        //                 }}
        //                 isDisabled={ 
        //                     !isHabitRoutineDay(habit, date) || 
        //                     milestone.isCanceled ||
        //                     isDateOutOfRange(
        //                         new Date(habit.dateCreated), 
        //                         new Date(),
        //                         date
        //                     ) || 
        //                     milestone && milestone.isCompleted                   
        //                 }    
        //             />
        //             {
        //                 isCheckInDay ? 
        //                 <>
        //                     <ChevronUpIcon/>
        //                     <Text>Check-In Day</Text>
        //                 </> :
        //                 ""
        //             }
        //         </VStack>
        //     </HStack>
        // </VStack>
    )
}

export default ToggleButton;