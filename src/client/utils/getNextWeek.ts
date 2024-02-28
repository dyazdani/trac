import { SEVEN_DAYS_IN_MILLISECONDS } from "../components/HabitCard.js";

const getNextWeek = (currentWeek: Date[]) => {
    const nextWeek: Date[] = [];

    for (let i = 0; i < currentWeek.length; i++) {
        const newDate = new Date();
        nextWeek.push(new Date(newDate.setTime(currentWeek[i].getTime() + SEVEN_DAYS_IN_MILLISECONDS)))
    }

    return nextWeek;
}

export default getNextWeek;