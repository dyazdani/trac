import { 
  Box, 
  Heading,
  Hide,
  Show,
  Spinner,
  Text
} from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import { useAppSelector } from "../app/hooks.js";
import { useGetMilestonesByUserQuery } from "../features/api.js";
import AppHeader from "./AppHeader.js";
import CTABanner from "./CTABanner.js";
import MyMilestones from "./MyMilestones.js";
import { Navigate } from "react-router-dom";
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
      <CTABanner isBannerDisplayed={isBannerDisplayed}/>
      <AppHeader isBannerDisplayed={isBannerDisplayed}/>
      <Hide below="md">
                <Show breakpoint="(max-height: 565px)">
                    <Heading 
                    as="h1" 
                    size="lg" 
                    textAlign="center" 
                    backgroundColor="gold.400"
                    padding="1vw"
                    position="sticky"
                    top={isBannerDisplayed ? "134.5px" : "80.5px"}
                    zIndex={100}
                    >
                    Trac not yet optimized for tablet or mobile devices. Please switch to desktop for optimum experience.
                    </Heading>
                </Show>
            </Hide>
            <Show 
                below="md"
            >
                <Heading 
                    as="h1" 
                    size="lg" 
                    textAlign="center" 
                    backgroundColor="gold.400"
                    padding="1vw"
                    position="sticky"
                    top={isBannerDisplayed ? "134.5px" : "80.5px"}
                    zIndex={100}
                >
                    Trac not yet optimized for tablet or mobile devices. Please switch to desktop for optimum experience.
                </Heading>
            </Show>
      {
      isLoading ?
      <Spinner 
        color="orange.500" 
        size="xl"
        position="absolute"
        top="50vh"
        left="50vw"
      /> :
        <Box
          w="100%"
          h="100%"
          minHeight="100vh"
          display="flex"
          flexDirection="column"
          paddingBottom="10vh"
          paddingTop="5vh"
          alignItems="center"
        >
          <Heading 
            as='h1' 
            size="2xl" 
            position="sticky" 
            top={isBannerDisplayed ? "154px" : "100px"} 
            bg="orange.100" 
            padding=".8rem 1rem" 
            zIndex={2}
            borderRadius={"2rem"}
          >
            My Goals
          </Heading>

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
