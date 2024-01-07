import { 
    Button,
    Box,
    useBoolean,
    FormLabel,
    FormControl
 } from "@chakra-ui/react";
 import isDateToday from "../../utils/isDateToday.js";
import getDayOfWeekLabelText from "../../utils/getDayOfWeekLabelText.js";
import { useGetHabitByIdQuery, useUpdateHabitMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { HabitWithDetails } from "../../types/index.js";
import areDatesSameDayMonthYear from "../../utils/areDatesSameDayMonthYear.js";

 export interface ToggleButtonProps {
    date: Date
    habitId: number
 }

const ToggleButton = ({date, habitId}: ToggleButtonProps) => {
    const [flag, setFlag] = useBoolean();
    const currentUser = useAppSelector((state) => state.auth.user)

    const [updateHabit, {data, isLoading, error}] = useUpdateHabitMutation();
    
    // variable for current habit details to be sent with update mutation
    let habitData: HabitWithDetails;

    if (currentUser) {
        const { data } = useGetHabitByIdQuery({id: currentUser.id, habitId})
       if (data){
        habitData = data?.habit
       }
    }
        

    

    

    // give button purple outline if it has today's date
    const isToday = isDateToday(date);
    const outlineColor = isToday ? "3px solid purple" : "3px solid black";

    // extract day of the week abbreviation for label
    const dayAbbreviation = getDayOfWeekLabelText(date);

    // Disable button if it's date is before date when habit was created or is in the future
    // TODO: Get start date from single habit query here. Then call isDayOutOfRange with dateCreated


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
                habitId,
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
                    checkInDay: habitData.checkIn.dayOfTheWeek
                }
            })

            console.log("currentHabit from updateHabit)(): ,", currentHabit)
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
            <FormLabel
                w="fit-content"
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