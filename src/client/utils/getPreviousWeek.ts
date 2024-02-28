import { SEVEN_DAYS_IN_MILLISECONDS } from "../components/HabitCard.js";

const getPreviousWeek = (currentWeek: Date[]) => {
    const previousWeek: Date[] = [];

    for (let i = 0; i < currentWeek.length; i++) {
        const newDate = new Date();
        previousWeek.push(new Date(newDate.setTime(currentWeek[i].getTime() - SEVEN_DAYS_IN_MILLISECONDS)))
    }

    return previousWeek;
}

export default getPreviousWeek;