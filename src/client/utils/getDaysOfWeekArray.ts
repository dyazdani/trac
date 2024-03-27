import { DaysOfWeek } from "@knocklabs/node";
import { Routine } from "@prisma/client";

const getDaysOfWeekArray = (routine: Routine) => {
    const daysOfWeekArray: DaysOfWeek[] = [];

    for (const prop in routine) {
        if (routine[prop as keyof typeof routine] === true) {
            let propArray = prop.split("")
            const capitalizedProp = propArray.map((el, i) => i === 0 ? el.toUpperCase() : el).join("")
            daysOfWeekArray.push(DaysOfWeek[capitalizedProp.slice(0, 3) as keyof typeof DaysOfWeek])
        }
    }

    return daysOfWeekArray;
}

export default getDaysOfWeekArray;