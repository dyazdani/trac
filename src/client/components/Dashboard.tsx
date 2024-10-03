import { 
  Box,
  Flex,
  Grid, 
  GridItem, 
  Heading,
  Hide,
  Show,
  Spinner,
} from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import { useAppSelector } from "../app/hooks.js";
import { useGetMilestonesByUserQuery } from "../features/api.js";
import AppHeader from "./AppHeader.js";
import CTABanner from "./CTABanner.js";
import MyMilestones from "./MyMilestones.js";
import { Navigate } from "react-router-dom";
import { User } from "@prisma/client";
import { useDispatch } from "react-redux";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import ArtistCredit from "./ArtistCredit.js";
import { MilestoneWithDetails } from "../../types/index.js";
import isMostRecentStatusReportSent from "../utils/isMostRecentStatusReportSent.js";
import getFirstCheckInDayDate from "../utils/getFirstCheckInDayDate.js";
import { useEffect } from "react";


const Dashboard = () => {
  const dispatch = useDispatch()

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


  useEffect(() => {
    if (milestonesData) {
      const isAStatusReportDue = milestonesData.milestones.some((milestone: MilestoneWithDetails) => {
        return (
          !milestone.isCompleted &&
          !milestone.isCanceled &&
          milestone.habits.some(habit => {
            const firstCheckInDate = getFirstCheckInDayDate(habit);
            if (firstCheckInDate) {
              return (
                firstCheckInDate.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) &&
                !isMostRecentStatusReportSent(habit)
              )
            }
          })
        )
      })
  
      if (isBannerDisplayed && !isAStatusReportDue) {
        dispatch(setIsBannerDisplayed(false))
      }
  
      if (!isBannerDisplayed && isAStatusReportDue) {
        dispatch(setIsBannerDisplayed(true))
      }
    }
  }, [milestonesData])
  

  const isMilestonesEmpty = !isLoading && !milestonesData?.milestones.length
 
  return (
    currentUser ? 
    <Box
      height="100dvh"
      // minHeight="565px"
    >
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
            gap={5}
          >
            <GridItem
              colStart={{
                base: 2,
                lg: 1
              }}
              gridColumn={{
                base: "1 / 4",
                lg: "1 / 2"
              }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              position={{
                base: "sticky",
                lg: undefined
              }}
              top={{
                base: `${isBannerDisplayed ? "178px" : "86px"}`,
                lg: `${isBannerDisplayed ? "92px" : undefined}`
              }}
              height="fit-content"
              paddingBottom={{
                base: "2rem",
                lg: undefined
              }}
              zIndex={101}
              backgroundColor="#FFFFFF"
            >
              <Heading
                as='h1'
                size="2xl"
                marginTop={{
                  base: "2rem",
                  lg: "3.8rem"
                }}
                position={{
                  base: undefined,
                  lg: "fixed"
                }}
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
                    marginTop={{
                      base: `${isMilestonesEmpty ? "0" : "2rem"}`,
                      lg: "4.6rem"
                    }}
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
    </Box> :
    <Navigate to="/login" replace />
  )
};

export default Dashboard;
