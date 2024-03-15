import { 
  Flex,
  Grid, 
  GridItem, 
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
import { MilestoneWithDetails } from "../../types/index.js";
import isMostRecentStatusReportSent from "../utils/isMostRecentStatusReportSent.js";
import getFirstCheckInDayDate from "../utils/getFirstCheckInDayDate.js";


const Dashboard = () => {
  const dispatch = useDispatch()

 const isThereACheckInToday = doesAHabitHaveACheckInToday();

  const localStorageIsBannerDisplayed = localStorage.getItem("isBannerDisplayed")
  const appSelectorIsBannerDisplayed = useAppSelector(state => state.banner.isBannerDisplayed)
  const isBannerDisplayed: boolean | null = localStorageIsBannerDisplayed ? JSON.parse(localStorageIsBannerDisplayed) : appSelectorIsBannerDisplayed

  const localStorageUser = localStorage.getItem("user")
  const appSelectorUser = useAppSelector(state => state.auth.user)
  const currentUser: Omit<User, 'password'> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
  
  let currentUserId: number | undefined;
  if (currentUser) {
    currentUserId = currentUser.id
  }

  const { data: milestonesData, isLoading } = useGetMilestonesByUserQuery(currentUserId)

  if (milestonesData) {
    const isAStatusReportDue = milestonesData.milestones.some((milestone: MilestoneWithDetails) => {
      return milestone.habits.some(habit => {
        const firstCheckInDate = getFirstCheckInDayDate(habit);
        if (firstCheckInDate) {
          return (
            firstCheckInDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) &&
            !isMostRecentStatusReportSent(habit)
          )
        }
        
      })
    })

    console.log (isAStatusReportDue)

    if (isBannerDisplayed && !isAStatusReportDue) {
      dispatch(setIsBannerDisplayed(false))
    }

    if (isBannerDisplayed === null && isAStatusReportDue) {
      dispatch(setIsBannerDisplayed(true))
    }
  }

  const isMilestonesEmpty = !isLoading && !milestonesData?.milestones.length
 

  return (
    currentUser ? 
    <>
      <Show 
        breakpoint="(max-width: 943px)"
      >
        <Heading 
          as="h1" 
          size="lg" 
          textAlign="center" 
          backgroundColor="gold.400"
          padding="6px"
          position="sticky"
          top="0"
          zIndex={1000}
        >
          Trac not yet optimized for tablet or mobile devices. Please switch to desktop for optimum experience.
        </Heading>
        <CTABanner top="90px" isBannerDisplayed={isBannerDisplayed}/>
      </Show>
      <Hide breakpoint="(max-width: 943px)">
        <CTABanner top="0px" isBannerDisplayed={isBannerDisplayed}/>
      </Hide>

      <Hide breakpoint="(max-width: 943px)">
        <Show breakpoint="(max-height: 565px)">
          <Heading 
            as="h1" 
            size="lg" 
            textAlign="center" 
            backgroundColor="gold.400"
            padding="6px"
            position="sticky"
            top="0"
            zIndex={1000}
          >
            Trac not yet optimized for tablet or mobile devices. Please switch to desktop for optimum experience.
          </Heading>
        </Show>
      </Hide>     
      <AppHeader isBannerDisplayed={isBannerDisplayed}/>
    
      {
      isLoading ?
      <Spinner 
        color="peach.500" 
        size="xl"
        position="absolute"
        top="50vh"
        left="50vw"
      /> :
        <>
          <Grid
            templateColumns="repeat(3, 1fr)"
            minHeight="100vh"
          >
            <GridItem
              colStart={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Heading
                as='h1'
                size="2xl"
                marginTop="3.8rem"
                position="fixed"
                paddingX="1rem"
              >
                My Goals:
              </Heading>
            </GridItem>
            {
              !milestonesData?.milestones.length ?
              <GridItem
                colStart={2}
              >
                <Flex
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Heading
                    as="h2"
                    size="lg"
                    mt="4.6rem"
                    textAlign="center"
                  >
                    You currently have no Goals
                  </Heading>
                  {
                    isMilestonesEmpty ? 
                    <RightDrawer isMilestonesEmpty={isMilestonesEmpty}/> :
                    ""
                  }
                </Flex>
              </GridItem> :
              <GridItem
                colStart={2}
              >
                <MyMilestones milestones={milestonesData?.milestones} />
              </GridItem>               
            }
            {
              !isMilestonesEmpty ?
              <GridItem
                colStart={isMilestonesEmpty ? 2 : 3}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <RightDrawer isMilestonesEmpty={isMilestonesEmpty} />
              </GridItem> :
              ""
            }
          </Grid>
          <ArtistCredit textColor="stormyblue.700" />
        </>
      }   
    </> :
    <Navigate to="/login" replace />
  )
};

export default Dashboard;
