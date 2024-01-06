const isDayOutOfRange = (start: Date, end: Date, target: Date) => {
    const startDay = start.getTime();
    const endDay = end.getTime();
    const targetDay = target.getTime();

    return targetDay > startDay && targetDay < endDay;
}

export default isDayOutOfRange;