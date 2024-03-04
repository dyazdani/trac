import { SEVEN_DAYS_IN_MILLISECONDS } from "../components/HabitCard.js";

const getPreviousWeek = (currentWeek: Date[]) => {
    const previousWeek: Date[] = [];

    for (let i = 0; i < currentWeek.length; i++) {
        previousWeek.push(new Date(currentWeek[i].setDate(currentWeek[i].getDate() - 7)))
    }

    return previousWeek;
}

export default getPreviousWeek;