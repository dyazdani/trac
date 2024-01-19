import { CheckIn, DayOfTheWeek } from "@prisma/client";
import { DAYS_OF_THE_WEEK } from "./getMostRecentCheckInDayDate.js";

const isTodayCheckInDay = (checkIns: CheckIn[]) => {
    const todayDayOfTheWeek = DAYS_OF_THE_WEEK[(new Date(Date.now()).getDay())];

    const checkInDays = checkIns.map(el => el.dayOfTheWeek);

    return checkInDays.includes(DayOfTheWeek[todayDayOfTheWeek as keyof typeof DayOfTheWeek]);
}

export default isTodayCheckInDay;