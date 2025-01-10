import { GoalWithDetails } from "../../types/index.js"
import getFirstCheckInDayDate from "./getFirstCheckInDayDate.js"
import isMostRecentStatusReportSent from "./isMostRecentStatusReportSent.js"

const doOtherGoalsHaveStatusReportDue = (goal: GoalWithDetails, goals: GoalWithDetails[]) => {
  const otherGoals = goals.filter(el => el.id !== goal.id)

  if (otherGoals) {
    return otherGoals.some((goal: GoalWithDetails) => {
      return (
        !goal.isCompleted &&
        !goal.isCanceled &&
        goal.habits.some(habit => {
          const firstCheckInDate = getFirstCheckInDayDate(habit);
          if (firstCheckInDate) {
            return (
              firstCheckInDate.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0) &&
              !isMostRecentStatusReportSent(habit)
            )
          }
        })
      )
    })
  }
}

export default doOtherGoalsHaveStatusReportDue;