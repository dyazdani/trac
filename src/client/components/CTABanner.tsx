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
}

const CTABanner = ({ isBannerDisplayed }: CTABannerProps) => {
    const dispatch = useDispatch();
    return (
        <Box
            zIndex={99}
            position="sticky"
            width="100%"
            minWidth="100dvw"
            top="0px"
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
                        size={{
                            base: "sm",
                            lg: "md"
                        }}
                        textAlign="center"
                        p="3px"
                    >
                        {`Click "Send Check-In Report" button in Habit to update folks on your progress.`}
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