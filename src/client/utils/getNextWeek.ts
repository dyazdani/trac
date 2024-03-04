import { SEVEN_DAYS_IN_MILLISECONDS } from "../components/HabitCard.js";

const getNextWeek = (currentWeek: Date[]) => {
    const nextWeek: Date[] = [];

    for (let i = 0; i < currentWeek.length; i++) {
        nextWeek.push(new Date(currentWeek[i].setDate(currentWeek[i].getDate() + 7)))
    }

    return nextWeek;
}

export default getNextWeek;