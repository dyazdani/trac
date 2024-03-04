import { CheckIn, DayOfTheWeek } from "@prisma/client";
import { DAYS_OF_THE_WEEK } from "./getMostRecentCheckInDayDate.js";

const isTodayCheckInDay = (checkIn: CheckIn) => {
    const todayDayOfTheWeek = DAYS_OF_THE_WEEK[(new Date(Date.now()).getDay())];

    const checkInDay = checkIn.dayOfTheWeek;

    return DayOfTheWeek[todayDayOfTheWeek as keyof typeof DayOfTheWeek] === checkInDay
}

export default isTodayCheckInDay;