import { 
  Box, 
  Heading,
  Link,
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
import { Navigate } from "react-router-dom";
import { ExternalLinkIcon } from "@chakra-ui/icons";
export interface DashboardProps {
  isAuthenticated: boolean
}

const Dashboard = ({isAuthenticated}: DashboardProps) => {
  const localStorageUser = localStorage.getItem("user")
  const appSelectorUser = useAppSelector(state => state.auth.user)
  const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
  
  let currentUserId;
  if (currentUser) {
    currentUserId = currentUser.id
  }

  let doesAHabitHaveCheckInToday;
  const { data } = useGetHabitsByUserQuery(currentUserId);
  const { data: milestonesData, isLoading } = useGetMilestonesByUserQuery(currentUserId)

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
    isAuthenticated || currentUser ? 
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
        {!isLoading && (
          <Text fontSize="sm" justifyContent="center">
            <Link color="blue.500" href="https://thenounproject.com/icon/mountain-120042/" isExternal>Mountain<ExternalLinkIcon mr=".5em" boxSize=".9em" /></Link>
            by <Link color="blue.500" href="https://thenounproject.com/bravo/" isExternal>Juan Pablo Bravo<ExternalLinkIcon mr=".3em" boxSize="1em"/></Link> 
            is licensed under <Link color="blue.500" href="https://creativecommons.org/licenses/by/2.0/" isExternal>CC BY 2.0<ExternalLinkIcon mr=".5em" boxSize="1em"/></Link>
          </Text>
        )}
        
    </> :
    <Navigate to="/login" replace />
  )
};

export default Dashboard;
