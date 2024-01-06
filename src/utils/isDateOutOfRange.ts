const isDateOutOfRange = (start: Date, end: Date, target: Date) => {
    const startDay = start.getDate();
    const startMonth = start.getMonth();
    const startYear = start.getFullYear();

    const endDay = end.getDate();
    const endMonth = end.getMonth();
    const endYear = end.getFullYear();

    const targetDay = target.getDate();
    const targetMonth = target.getMonth();
    const targetYear = target.getFullYear();

    // Determine if year is out of range
    if (targetYear < startYear || targetYear > endYear) {
        return true
    }

    // Determine if month is out of range
    if (targetMonth < startMonth || targetMonth > endMonth) {
        return true
    }

     // Determine if day is out of range
     if (targetDay < startDay || targetDay > endDay) {
        return true
    } 

    return false;
}

export default isDateOutOfRange;