import { 
    Box, 
    CloseButton, 
    HStack, 
    Spacer, 
    Text 
} from "@chakra-ui/react";
import { useAppSelector } from "../app/hooks.js";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import { useDispatch } from "react-redux";
import doesAHabitHaveACheckInToday from "../utils/doesAHabitHaveACheckInToday.js";



const CTABanner = () => {
    const dispatch = useDispatch()

    let isThereACheckInToday = false;
    const result = doesAHabitHaveACheckInToday();

    if (result instanceof Error) {
    console.error(result)
    } else {
    isThereACheckInToday = result
    console.log(`isThereACheckInToday: ${isThereACheckInToday}`)
    }

    const localStorageIsBannerDisplayed = localStorage.getItem("isBannerDisplayed")
    console.log(`localStorageIsBannerDisplayed: ${localStorageIsBannerDisplayed}`)

    const appSelectorIsBannerDisplayed = useAppSelector(state => state.banner.isBannerDisplayed)
    console.log(`appSelectorIsBannerDisplayed: ${appSelectorIsBannerDisplayed}`)

    const isBannerDisplayed: boolean | null = localStorageIsBannerDisplayed ? JSON.parse(localStorageIsBannerDisplayed) : appSelectorIsBannerDisplayed
    console.log(`isBannerDisplayed: ${isBannerDisplayed}`)


    if (isBannerDisplayed === null && isThereACheckInToday) {
    dispatch(setIsBannerDisplayed(true))
    console.log(`state.isBannerDisplayed set to true`)
    }


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
                ** Today is a Check-In Day for one or more of your Habits. Click "Send Status Report" to update folks on your progress.**
            </Text>
            <Spacer/>
                <CloseButton
                    colorScheme="teal"
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