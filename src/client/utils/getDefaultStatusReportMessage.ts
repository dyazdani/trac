import { HabitWithDetails, GoalWithDetails } from "../../types/index.js";
import getStatusReport from "./getStatusReport.js";

const getDefaultStatusReportMessage = (habit: HabitWithDetails, goal: GoalWithDetails, username: string) => {

    const statusReport = getStatusReport(habit);

    let statusReportString = ""

    for (let i = 0; i < statusReport?.length; i++) {
        statusReportString = `${statusReportString}${Object.keys(statusReport[i]).join('')}: ${Object.values(statusReport[i]).join('')}\n\t`
    }

    return (
        `Hi Friends!
        I've been using the Trac app to track how frequently I am completing practice for a habit I'm calling "${habit.name}". I have practicing it in order to accomplish my goal called "${goal.name}". I would like to send you ${new Date().setHours(0, 0, 0, 0) >= new Date(goal.dueDate).setHours(0, 0, 0, 0) ? "my final" : "a quick"} report of how it's been going:
        
            CHECK-IN REPORT 📈
        ${statusReportString} 

Thank you for helping to keep me accountable and motivated! ${new Date().setHours(0, 0, 0, 0) >= new Date(goal.dueDate).setHours(0, 0, 0, 0) ? "" : "I'll be sending another check-in report soon."}


Onward and upward,
${username}`
)
}

export default getDefaultStatusReportMessage;