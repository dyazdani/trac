const areDatesSameDayMonthYear = (dateOne: Date, dateTwo: Date) => {
       // Determine if year is the same
    if (dateOne.getFullYear() !== dateTwo.getFullYear()) {
        return false
    }

    // Determine if month is the same
    if (dateOne.getMonth() !== dateTwo.getMonth()) {
        return false
    }

     // Determine if day is the same
     if (dateOne.getDate() !== dateTwo.getDate()) {
        return false
    } 

    return true;
}

export default areDatesSameDayMonthYear