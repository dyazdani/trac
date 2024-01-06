import { 
    Button,
    Box,
    useBoolean,
    FormLabel,
    FormControl
 } from "@chakra-ui/react";
 import isDateToday from "../../utils/isDateToday.js";
import getDayOfWeekLabelText from "../../utils/getDayOfWeekLabelText.js";

 export interface ToggleButtonProps {
    date: Date
 }

const ToggleButton = ({date}: ToggleButtonProps) => {
    const [flag, setFlag] = useBoolean();

    // give button purple outline if it has today's date
    const isToday = isDateToday(date);
    const outlineColor = isToday ? "3px solid purple" : "3px solid black";

    // extract day of the week abbreviation for label
    const dayAbbreviation = getDayOfWeekLabelText(date);

    // Disable button if it's date is before date when habit was created or is in the future
    // TODO: Get start date from single habit query here. Then call isDayOutOfRange with dateCreated



    return (
        <FormControl
            w="fit-content"
        >
            <FormLabel
                w="fit-content"
            >
                {dayAbbreviation}
            </FormLabel>
            <Button
                onClick={setFlag.toggle}
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