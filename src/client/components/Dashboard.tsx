import { 
  Box,
  Flex,
  Grid, 
  GridItem, 
  Heading,
  Spinner,
  useBreakpoint,
} from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import { useAppSelector } from "../app/hooks.js";
import { useGetGoalsByUserQuery } from "../features/api.js";
import AppHeader from "./AppHeader.js";
import CTABanner from "./CTABanner.js";
import MyGoals from "./MyGoals.js";
import { Navigate } from "react-router-dom";
import { User } from "@prisma/client";
import { useDispatch } from "react-redux";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import ArtistCredit from "./ArtistCredit.js";
import { GoalWithDetails } from "../../types/index.js";
import isMostRecentStatusReportSent from "../utils/isMostRecentStatusReportSent.js";
import getFirstCheckInDayDate from "../utils/getFirstCheckInDayDate.js";
import { useEffect } from "react";
import isLessThanBreakpoint from "../utils/isLessThanBreakpoint.js";


const Dashboard = () => {
  const dispatch = useDispatch()
  const breakpoint = useBreakpoint({ssr: false})

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

  const { data: goalsData, isLoading } = useGetGoalsByUserQuery(currentUserId)


  useEffect(() => {
    if (goalsData) {
      const isAStatusReportDue = goalsData.goals.some((goal: GoalWithDetails) => {
        return (
          !goal.isCompleted &&
          !goal.isCanceled &&
          goal.habits.some(habit => {
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
  }, [goalsData])
  

  const isGoalsEmpty = !isLoading && !goalsData?.goals.length
 
  return (
    currentUser ? 
    <Box
      height="fit-content"
      minHeight="100dvh"
      display="flex"
      flexFlow="column"
      alignItems="center"
    >
      <CTABanner
        isBannerDisplayed={isBannerDisplayed}
      />
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
            templateColumns={{
              base: "auto auto auto",
              lg: "repeat(3, 1fr)"
            }}
            gap={5}
            maxWidth="1330px"
          >
            <GridItem
              gridColumn={{
                base: "1 / 4",
                lg: "1 / 2"
              }}
              display="flex"
              flexFlow="column"
              alignItems="center"
              justifyContent="center"
              position={{
                base: "sticky",
                lg: undefined
              }}
              top={{
                base: `${isBannerDisplayed ? "207.469px" : "86px"}`,
                sm: `${isBannerDisplayed ? "188.281px" : "86px"}`,
                md: `${isBannerDisplayed ? "173.1875px" : "86px"}`,
                lg: `${isBannerDisplayed ? "92px" : undefined}`
              }}
              height="fit-content"
              maxWidth="100dvw"
              paddingBottom={{
                base: "1rem",
                lg: undefined
              }}
              zIndex={98}
              backgroundColor="#FFFFFF"
            >
              <Heading
                as='h1'
                size="2xl"
                marginTop={{
                  base: "1rem",
                  lg: "10rem"
                }}
                marginBottom={{
                  base: "1rem",
                  lg: "0"
                }}
                position={{
                  base: undefined,
                  lg: "fixed"
                }}
                paddingLeft="2rem"
                paddingRight={{
                  base: "2rem",
                  lg: "1rem"
                }}
              >
                My Goals:
              </Heading>
              {
              !isGoalsEmpty && isLessThanBreakpoint(breakpoint, "lg") ?
                <RightDrawer
                  isGoalsEmpty={isGoalsEmpty}
                  isBannerDisplayed={isBannerDisplayed}
                /> :
              ""
            }
            </GridItem>
            {
              !goalsData?.goals.length ?
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
                      base: `${isGoalsEmpty ? "0" : "2rem"}`,
                      lg: "4.6rem"
                    }}
                    textAlign="center"
                  >
                    You currently have no Goals
                  </Heading>
                  {
                    isGoalsEmpty ? 
                    <RightDrawer 
                      isGoalsEmpty={isGoalsEmpty}
                      isBannerDisplayed={isBannerDisplayed}
                    /> :
                    ""
                  }
                </Flex>
              </GridItem> :
              <GridItem
                colStart={2}
              >
                <MyGoals goals={goalsData?.goals} />
              </GridItem>               
            }
            {
              !isGoalsEmpty && !isLessThanBreakpoint(breakpoint, "lg") ?
              <GridItem
                colStart={isGoalsEmpty ? 2 : 3}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <RightDrawer 
                  isGoalsEmpty={isGoalsEmpty}
                  isBannerDisplayed={isBannerDisplayed}
                />
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
