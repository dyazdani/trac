import { Box } from "@chakra-ui/react";
import ToggleButton from "./ToggleButton.js";

const DiamondToggleButton = () => {
    return (

        <Box
        w="0"
        h="0"
        border="20px solid transparent"
        borderBottom="40px solid #f6bd60"
        position="relative"
        top="-30px"       
        _after={{
            content: `""`,
            position: "absolute",
            left: "-20px",
            top: "40px",
            width: "0",
            height: "0",
            border: "20px solid transparent",
            borderTop: "40px solid #f6bd60"
        }}
        >
            <ToggleButton
                date={new Date("1990-01-01")}
            />
    </Box>
    

    )
}

export default DiamondToggleButton;