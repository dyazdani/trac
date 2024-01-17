import { HabitWithDetails } from "../types/index.js";
import getStatusReport from "./getStatusReport.js";

const getDefaultStatusReportMessage = (habit: HabitWithDetails, username: string) => {

    const statusReport = getStatusReport(habit);
    
    if (statusReport) {
        let statusReportString = ""
    
        for (let i = 0; i < statusReport?.length; i++) {
            statusReportString = `${statusReportString}${Object.keys(statusReport[i]).join('')}: ${Object.values(statusReport[i]).join('')}\n\t`
        }

        return (`Hi Friends!
    I've been using the Trac app to record how frequently I am completing practice for my ${habit.name} habit. I would like to send you a report of how I did over the week leading up to my most recent weekly check-in day. Here's how I did:

        Status Report\n\t${statusReportString} 
    
Thank you for helping to keep me accountable and motivated! I'll be sending another status report next week.

    
Onward and upward,
${username}
    `)
    } else {
        return (`Hi Friends!
    I've been using the Trac app to record how frequently I am completing practice for my ${habit.name} habit. I would like to send you a report of how I did over the week leading up to my most recent weekly check-in day. Here's how I did:

        Status Report
    
Thank you for helping to keep me accountable and motivated! I'll be sending another status report next week.

    
Onward and upward,
${username}
    `)
    }
    
}


export default getDefaultStatusReportMessage;