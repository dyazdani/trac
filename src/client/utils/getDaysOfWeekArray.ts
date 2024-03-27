import { DaysOfWeek } from "@knocklabs/node";
import { Routine } from "@prisma/client";

const getDaysOfWeekArray = (routine: Routine) => {
    const daysOfWeekArray: DaysOfWeek[] = [];

    for (const prop in routine) {
        if (routine[prop as keyof typeof routine] === true) {
            daysOfWeekArray.push(DaysOfWeek[prop.slice(0, 3) as keyof typeof DaysOfWeek])
        }
    }

    return daysOfWeekArray;
}

export default getDaysOfWeekArray;