import { 
    Button,
    Box,
    useBoolean
 } from "@chakra-ui/react";

const ToggleButton = () => {
    const [flag, setFlag] = useBoolean();

    return (
        <Box>
            <Button
        onClick={setFlag.toggle}
        w="1.5vw"
        h="1.5vw"
        minW="1.5vw"
        px="0"
        border="2px solid white"
        borderRadius="50%"
        outline=".3vw solid black"
        backgroundColor="white"
        colorScheme="teal"
        >
            { flag && <Box 
                position="absolute"
                w="1.2vw"
                h="1.2vw"
                minW="1.2vw"
                top="50%"
                left= "50%"
                transform="translate(-50%, -50%)"
                backgroundColor="teal"
                borderRadius="50%"
            /> }

        </Button>
        </Box>
        
        
    )

}

export default ToggleButton;