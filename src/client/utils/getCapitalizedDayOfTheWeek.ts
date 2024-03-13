import { DayOfTheWeek } from ".prisma/client";

const getCapitalizedDayOfTheWeek = (dayOfTheWeek: DayOfTheWeek) => {

    const dayMap = {
        MONDAY: "Monday",
        TUESDAY: "Tuesday",
        WEDNESDAY: "Wednesday",
        THURSDAY: "Thursday",
        FRIDAY: "Friday",
        SATURDAY: "Saturday",
        SUNDAY: "Sunday"
   }
   
   return dayMap[dayOfTheWeek];
}

export default getCapitalizedDayOfTheWeek;