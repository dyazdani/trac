const isDateToday = (date: Date) => {
    const today = new Date(Date.now())

    if (date.getDate() !== today.getDate()) {
        return false;
    }

    if (date.getMonth() !== today.getMonth()) {
        return false;
    }

    if (date.getFullYear() !== today.getFullYear()) {
        return false;
    }

    return true;   
}

export default isDateToday;