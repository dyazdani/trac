
import { Box, CloseButton, HStack, Spacer, Text } from "@chakra-ui/react";

export interface CTABannerProps {
    isBannerDisplayed: boolean
    handleClick: () => void
}

const CTABanner = ({isBannerDisplayed, handleClick}: CTABannerProps) => {

    return (
        <Box
            position="sticky"
            w="100%"
            top="0px"
            zIndex="1000"
            minH="40px"
            bg="#ffd700"
            border="2mm ridge rgba(255,215,0, .6)"
            display={isBannerDisplayed ? "" : "none"}
        >
            <HStack>
            <Spacer/>
            <Text
                fontSize="xl"
                textAlign="center"
                p="5px"
            >
                ** Today is a Check-In Day for one or more of your Habits. Click the "Send Status Report" next to your Habit to update folks on your progress.**
            </Text>
            <Spacer/>
                <CloseButton
                    colorScheme="teal"
                    onClick={(e) => {
                        e.preventDefault();
                        handleClick()    
                    }}
                />
            </HStack>
            
        </Box>
    )
}

export default CTABanner