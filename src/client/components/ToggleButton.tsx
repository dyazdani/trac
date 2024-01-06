import { 
    Button,
    useBoolean
 } from "@chakra-ui/react";

const ToggleButton = () => {
    const [flag, setFlag] = useBoolean();

    return (
        <Button
        onClick={setFlag.toggle}
        size="sm"
        border="2px solid white"
        borderRadius="50%"
        outline="3px solid black"
        backgroundColor="white"
        colorScheme="teal"
        position="absolute"
        left="40vw"
        top="30vh"
        boxSizing="border-box"
        ></Button>
    )

}

export default ToggleButton;