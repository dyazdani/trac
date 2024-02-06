import { Box, Button } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import MyHabits from "./MyHabits.js";
import { useAppSelector } from "../app/hooks.js";
import { useDeleteSchedulesMutation, useGetHabitsByUserQuery } from "../features/api.js";
import AppHeader from "./AppHeader.js";
import CTABanner from "./CTABanner.js";
import isTodayCheckInDay from "../../utils/isTodayCheckInDay.js";
import { useState } from "react";
import Milestone from "./Milestone.js";
import MyMilestones from "./MyMilestones.js";


const Dashboard = () => {
  const currentUser = useAppSelector(state => state.auth.user)
  const [deleteSchedules] = useDeleteSchedulesMutation();

  let isTodayACheckInDay;
  if (currentUser) {
    const { data } = useGetHabitsByUserQuery(currentUser.id);

    const checkIns = data?.habits.map(habit => habit.checkIn)

    if (checkIns) {
      isTodayACheckInDay = isTodayCheckInDay(checkIns)
    }
  }

  const [isBannerDisplayed, setIsBannerDisplayed] = useState(isTodayACheckInDay)

  const toggleBannerDisplayed = () => {
    setIsBannerDisplayed(!isBannerDisplayed);
  }

  return (
    <>
      {isBannerDisplayed && <CTABanner isBannerDisplayed={isBannerDisplayed} toggleBannerDisplayed={toggleBannerDisplayed}/>}
      <AppHeader isBannerDisplayed={isBannerDisplayed}/>
      <RightDrawer toggleBannerDisplayed={toggleBannerDisplayed}/>
      <Box as="div" 
      w="100vw"
      >
        <MyHabits toggleBannerDisplayed={toggleBannerDisplayed}/>
      </Box>
      <MyMilestones/>
    </>
  );
};

export default Dashboard;
