import { Checkbox, Box } from "@chakra-ui/react";

const DiamondCheckbox = () => {
    return (

        <Box
        w="0"
        h="0"
        border="50px solid transparent"
        borderBottom="70px solid #f6bd60"
        position="relative"
        top="-50px"       
        _after={{
            content: `""`,
            position: "absolute",
            left: "-50px",
            top: "70px",
            width: "0",
            height: "0",
            border: "50px solid transparent",
            borderTop: "70px solid #f6bd60"
        }}
        >
        {/* <Checkbox></Checkbox> */}
    </Box>
    

    )
}

export default DiamondCheckbox;