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
import doesAHabitHaveACheckInToday from "../utils/doesAHabitHaveACheckInToday.js";
import { User } from "@prisma/client";
import { useDispatch } from "react-redux";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import ArtistCredit from "./ArtistCredit.js";
export interface DashboardProps {
  isAuthenticated: boolean
}

const Dashboard = ({isAuthenticated}: DashboardProps) => {
  const dispatch = useDispatch()

  let isThereACheckInToday = false;
  const result = doesAHabitHaveACheckInToday();

  if (result instanceof Error) {
    console.error(result)
  } else {
    isThereACheckInToday = result
  }

  const localStorageIsBannerDisplayed = localStorage.getItem("isBannerDisplayed")
  const appSelectorIsBannerDisplayed = useAppSelector(state => state.banner.isBannerDisplayed)
  const isBannerDisplayed: boolean | null = localStorageIsBannerDisplayed ? JSON.parse(localStorageIsBannerDisplayed) : appSelectorIsBannerDisplayed

  if (isBannerDisplayed === null && isThereACheckInToday) {
    dispatch(setIsBannerDisplayed(true))
  }


  const localStorageUser = localStorage.getItem("user")
  const appSelectorUser = useAppSelector(state => state.auth.user)
  const currentUser: Omit<User, 'password'> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
  
  let currentUserId: number | undefined;
  if (currentUser) {
    currentUserId = currentUser.id
  }

  const { data: milestonesData, isLoading } = useGetMilestonesByUserQuery(currentUserId)

  const isMilestonesEmpty = !isLoading && !milestonesData?.milestones.length


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
      <CTABanner isBannerDisplayed={isBannerDisplayed}/>
      <AppHeader isBannerDisplayed={isBannerDisplayed}/>
      {!isLoading && 
        <Box
          w="100%"
          h="100%"
          minHeight="100vh"
          display="flex"
          flexDirection="column"
          paddingBottom="10vh"
          paddingTop="5vh"
          alignItems="center"
          bg="blue.50"
        >
          <Heading as='h1' size="2xl">My Goals</Heading>
        {
          !milestonesData?.milestones.length ?
          <Text fontSize="xl" mt="20vh">You currently have no Goals.</Text> : 
          ""
        }
        <RightDrawer isMilestonesEmpty={isMilestonesEmpty}/>
        <MyMilestones milestones={milestonesData?.milestones}/>
        {<ArtistCredit textColor="blue.500" position="left"/>}
      </Box>
      }   
    </> :
    <Navigate to="/login" replace />
  )
};

export default Dashboard;
