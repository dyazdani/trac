import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import MyHabits from "./MyHabits.js";
import { useAppSelector } from "../app/hooks.js";
import { useGetHabitsByUserQuery } from "../features/api.js";
import AppHeader from "./AppHeader.js";
import CTABanner from "./CTABanner.js";
import isTodayCheckInDay from "../../utils/isTodayCheckInDay.js";
import { useState } from "react";


const Dashboard = () => {
  const currentUser = useAppSelector(state => state.auth.user)

  let isTodayACheckInDay;
  if (currentUser) {
    const { data } = useGetHabitsByUserQuery(currentUser.id);

    const checkIns = data?.habits.map(habit => habit.checkIn)

    if (checkIns) {
      console.log("check-ins: ", checkIns)
      isTodayACheckInDay = isTodayCheckInDay(checkIns)
    }
  }

  console.log("isTodayACheckInDay: ", isTodayACheckInDay)
  const [isBannerDisplayed, setIsBannerDisplayed] = useState(isTodayACheckInDay)

  console.log("isBannerDisplayed: ", isBannerDisplayed)

  const handleClick = () => {
    setIsBannerDisplayed(!isBannerDisplayed);
  }

  return (
    <>
      {isBannerDisplayed && <CTABanner isBannerDisplayed={isBannerDisplayed} handleClick={handleClick}/>}
      <AppHeader isBannerDisplayed={isBannerDisplayed}/>
      <RightDrawer handleClick={handleClick}/>
      <Box as="div" 
      w="100vw"
      >
        <MyHabits handleClick={handleClick}/>
      </Box>
    </>
  );
};

export default Dashboard;
