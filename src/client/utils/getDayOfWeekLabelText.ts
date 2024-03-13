const getDayOfWeekLabelText = (date: Date) => {
    const dayAbbreviations = [
        "Su", 
        "M",
        "T",
        "W",
        "Th",
        "F",
        "Sa" 
    ]
    
    return dayAbbreviations[date.getDay()]
}

export default getDayOfWeekLabelText;