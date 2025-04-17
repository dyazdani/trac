const TRAC_COLORS = [
    "#f59e56", // Orange
    "#6ec9db", // Blue
    "#9899f8", // Purple
    "#f8c433", // Yellow
    "#17689c", // Dark blue
]   

const getConsoleStyles = (num: number) => {
    const colors = []
    let colorIndex = 0

    for (let i = 0; i < num; i++) {
        colors.push(TRAC_COLORS[colorIndex])
        if (colorIndex === TRAC_COLORS.length - 1) {
            colorIndex = 0;
        } else {
            colorIndex++;
        }
    }

    return colors.map((color, i) => `
        font-weight: bold;
        font-size: ${i === colors.length - 1 ? "45" : "50"}px;
        color: ${color};
    `)
}

export default getConsoleStyles;