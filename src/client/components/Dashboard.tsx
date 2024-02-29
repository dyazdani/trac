import { 
  Box, 
  Heading,
  Show,
  Text
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
    const { data: milestonesData, isLoading } = useGetMilestonesByUserQuery(currentUser.id)

    const isMilestonesEmpty = !isLoading && !milestonesData?.milestones.length

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
        <Show 
          below="md"
        >
          <Heading 
            as="h1" 
            size="lg" 
            textAlign="center" 
            backgroundColor="yellow.500"
            padding="1vw"
          >
            Trac not yet optimized for tablet or mobile devices. Please switch to desktop for optimum experience.
          </Heading>
        </Show>
        {isBannerDisplayed && <CTABanner isBannerDisplayed={isBannerDisplayed} toggleBannerDisplayed={toggleBannerDisplayed}/>}
        <AppHeader isBannerDisplayed={isBannerDisplayed}/>
          <Box
            w="100%"
            h="100%"
            display="flex"
            flexDirection="column"
            paddingBottom="10vh"
            pt="5vh"
            alignItems="center"
          >
            <Heading as='h1' size="2xl">My Goals</Heading>
            {
              !isLoading && !milestonesData?.milestones.length ?
              <Text fontSize="xl" mt="20vh">You currently have no Goals.</Text> : 
              ""
            }
            <RightDrawer toggleBannerDisplayed={toggleBannerDisplayed} isMilestonesEmpty={isMilestonesEmpty}/>
            <MyMilestones milestones={milestonesData?.milestones}/>
          </Box>
      </>
    )
  };
};

export default Dashboard;
