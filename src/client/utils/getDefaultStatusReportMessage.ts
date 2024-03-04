import { HabitWithDetails, MilestoneWithDetails } from "../../types/index.js";
import getStatusReport from "./getStatusReport.js";

const getDefaultStatusReportMessage = (habit: HabitWithDetails, milestone: MilestoneWithDetails, username: string) => {

    const statusReport = getStatusReport(habit);

    let statusReportString = ""

    for (let i = 0; i < statusReport?.length; i++) {
        statusReportString = `${statusReportString}${Object.keys(statusReport[i]).join('')}: ${Object.values(statusReport[i]).join('')}\n\t`
    }

    return (
        `Hi Friends!
        I've been using the Trac app to track how frequently I am completing practice for a habit I'm calling "${habit.name}". I am practicing it in order to accomplish my goal called "${milestone.name}". I would like to send you a quick report of how it's been going:
        
            STATUS REPORT 📈
        ${statusReportString} 

Thank you for helping to keep me accountable and motivated! I'll be sending another status report soon.


Onward and upward,
${username}`
)
}

export default getDefaultStatusReportMessage;