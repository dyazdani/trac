import { 
    Button,
    Box,
    useBoolean,
    FormLabel,
    FormControl,
    VStack
 } from "@chakra-ui/react";
 import isDateToday from "../../utils/isDateToday.js";
import getDayOfWeekLabelText from "../../utils/getDayOfWeekLabelText.js";
import { useGetHabitByIdQuery, useUpdateHabitMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { HabitWithDetails, MilestoneWithDetails } from "../../types/index.js";
import areDatesSameDayMonthYear from "../../utils/areDatesSameDayMonthYear.js";
import DiamondImage from "./DiamondImage.js";
import isDateOutOfRange from "../../utils/isDateOutOfRange.js";

 export interface ToggleButtonProps {
    date: Date
    milestone: MilestoneWithDetails
    habit: HabitWithDetails
    isCheckInDay: boolean
 }

const ToggleButton = ({date, milestone, habit, isCheckInDay}: ToggleButtonProps) => {
    const [flag, setFlag] = useBoolean(!!habit.datesCompleted.find(el => areDatesSameDayMonthYear(new Date(el), date)));
    const currentUser = useAppSelector((state) => state.auth.user)

    const [updateHabit, {data, isLoading, error}] = useUpdateHabitMutation();
    
    // variable for current habit details to be sent with update mutation
    let habitData: HabitWithDetails;

    if (currentUser) {
        habitData = habit
    }
        
    // get boolean for if the date prop is today's date
    const isToday = isDateToday(date);
    
    // give button purple outline if it a check-in day
    const outlineColor = isCheckInDay ? "3px solid rgb(103, 65, 217)" : "3px solid black";

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
            
            
            const newDatesCompleted = flag ? 
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
        <FormControl
            w="fit-content"
            onSubmit={(e) => {
                e.preventDefault();
                setFlag.toggle();
                handleSubmit();               
            }}
            as="form"
        >
            {isToday && <DiamondImage/>}
            <FormLabel
                w="fit-content"
                color={milestone.isCanceled || milestone.isCompleted ? "gray" : ""}
            >
                {dayAbbreviation}
            </FormLabel>
            <Button
                type="submit"
                w="15px"
                h="15px"
                minW="10px"
                px="0"
                border="2px solid white"
                borderRadius="50%"
                outline={outlineColor}
                backgroundColor="white"
                colorScheme="teal"
                zIndex="1"   
                isDisabled={ 
                    isDateOutOfRange(
                        new Date(habit.dateCreated), 
                        new Date(),
                        date
                    ) || 
                    milestone && milestone.isCompleted                   
                }    
            >
                { flag && 
                    <Box 
                        position="absolute"
                        w="10.5px"
                        h="10.5px"
                        minW="10.5px"
                        top="53%"
                        left= "51%"
                        transform="translate(-52%, -52%)"
                        backgroundColor="teal"
                        borderRadius="50%"
                    /> 
                }
            </Button>
        </FormControl>
    )

}

export default ToggleButton;