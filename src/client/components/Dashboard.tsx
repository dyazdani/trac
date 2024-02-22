import { 
  Box, 
  Heading,
} from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import { useAppSelector } from "../app/hooks.js";
import { 
  useGetHabitsByUserQuery, 
  useGetMilestonesByUserQuery 
} from "../features/api.js";
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
            w="100vw"
            h="100%"
            display="flex"
            flexDirection="column"
            paddingBottom="10vh"
            pt="5vh"
            alignItems="center"
          >
              <Heading as='h1'>My Goals</Heading>
              <MyMilestones milestones={milestonesData?.milestones}/>
          </Box>
      </>
    )
};
};

export default Dashboard;
