const getDayOfWeekLabelText = (date: Date) => {
    const dayAbbreviations = [
        "SU", 
        "M",
        "T",
        "W",
        "TH",
        "F",
        "SA" 
    ]
    
    return dayAbbreviations[date.getDay()]
}

export default getDayOfWeekLabelText;