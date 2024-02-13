const isDateOutOfRange = (start: Date, end: Date, target: Date) => {
    const beginningOfStartDate = start.setHours(0, 0, 0)

    const endOfEndDate = end.setHours(23, 59, 59)

    const targetInMilliseconds = target.getTime()

    if (targetInMilliseconds < beginningOfStartDate || targetInMilliseconds > endOfEndDate) {
        return true
    }

    return false;
}

export default isDateOutOfRange;