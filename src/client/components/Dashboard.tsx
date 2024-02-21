import { 
  Box, 
  HStack, 
  Heading,
  Image,
  Text 
} from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import { useAppSelector } from "../app/hooks.js";
import { useGetHabitsByUserQuery, useGetMilestonesByUserQuery } from "../features/api.js";
import AppHeader from "./AppHeader.js";
import CTABanner from "./CTABanner.js";
import isTodayCheckInDay from "..//utils/isTodayCheckInDay.js";
import { useState } from "react";
import MyMilestones from "./MyMilestones.js";


const Dashboard = () => {
  const localStorageUser = localStorage.getItem("user")
  const appSelectorUser = useAppSelector(state => state.auth.user)
  const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser

  let doesAHabitHaveCheckInToday;
  if (currentUser) {
    const { data } = useGetHabitsByUserQuery(currentUser.id);
    const { data: milestonesData } = useGetMilestonesByUserQuery(currentUser.id)

    const checkIns = data?.habits.map(habit => habit.checkIn)

    if (checkIns) {
      doesAHabitHaveCheckInToday = checkIns.some(checkIn => isTodayCheckInDay(checkIn))
    }

    const [isBannerDisplayed, setIsBannerDisplayed] = useState(doesAHabitHaveCheckInToday)

    const toggleBannerDisplayed = () => {
      setIsBannerDisplayed(!isBannerDisplayed);
    }

    return (
      <>
        {isBannerDisplayed && <CTABanner isBannerDisplayed={isBannerDisplayed} toggleBannerDisplayed={toggleBannerDisplayed}/>}
        <AppHeader isBannerDisplayed={isBannerDisplayed}/>
        <RightDrawer toggleBannerDisplayed={toggleBannerDisplayed}/>
        <Box
        as="div" 
        w="100vw"
        >
          <Box
            w="100vw"
            h="100%"
            pl={10}
            display="flex"
            flexDirection="column"
            paddingBottom="50px"
          >
            <Box
              marginTop={10}
              mb="20"
            >
              <Heading as='h1' size='2xl' >My Dashboard</Heading>
              <HStack>
                <HStack spacing={0}>
                  <Image src="/images/trac_today_icon.png" alt="purple circle indicating today" p={0} />
                  <Text>= Check-In Day</Text>
                </HStack>
                <HStack spacing={0}>
                  <Image src="images/diamond-pink.png" alt="yellow diamond indicating check-in day" maxW="45px" p="10px"/>
                  <Text>= Today</Text>
                </HStack>
              </HStack>
            </Box>
              <Heading as='h2' size='xl' >Milestones</Heading> 
              <MyMilestones milestones={milestonesData?.milestones}/>
            </Box>
        </Box>

      </>
    )
};
};

export default Dashboard;
