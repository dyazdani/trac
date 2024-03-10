import { 
    Box, 
    CloseButton, 
    HStack, 
    Spacer, 
    Heading,
    Flex
} from "@chakra-ui/react";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import { useDispatch } from "react-redux";

export interface CTABannerProps {
    isBannerDisplayed: boolean | null
    top: "0px" | "90px"
}

const CTABanner = ({ isBannerDisplayed, top }: CTABannerProps) => {
    const dispatch = useDispatch();
    return (
        <Box
            position="sticky"
            w="100%"
            top={top}
            zIndex="1000"
            minH="40px"
            bg="gold.400"
            border="2mm ridge rgba(249, 199, 31, 0.6)"
            display={isBannerDisplayed ? "" : "none"}
        >
            <HStack>
                <Spacer/>
                <Flex
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    padding="3px"
                >
                    <Heading
                        as="h2"
                        size="lg"
                        textAlign="center"
                        p="3px"
                    >
                        {`** Check-In Time! **`}
                    </Heading>
                    <Heading
                        as="h2"
                        size="md"
                        textAlign="center"
                        p="3px"
                    >
                        {`Click the "Send Status Report" buttons in your Habits to update your friends on your progress.`}
                    </Heading>
                </Flex>
                
                <Spacer/>
                <CloseButton
                    size="lg"
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(setIsBannerDisplayed(false));  
                    }}
                />
            </HStack>
            
        </Box>
    )
}

export default CTABanner