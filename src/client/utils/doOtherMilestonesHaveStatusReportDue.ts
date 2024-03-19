import { MilestoneWithDetails } from "../../types/index.js"
import getFirstCheckInDayDate from "./getFirstCheckInDayDate.js"
import isMostRecentStatusReportSent from "./isMostRecentStatusReportSent.js"

const doOtherMilestonesHaveStatusReportDue = (milestone: MilestoneWithDetails, milestones: MilestoneWithDetails[]) => {
  const otherMilestones = milestones.filter(el => el.id !== milestone.id)

  if (otherMilestones) {
    return otherMilestones.some((milestone: MilestoneWithDetails) => {
      return (
        !milestone.isCompleted &&
        !milestone.isCanceled &&
        milestone.habits.some(habit => {
          const firstCheckInDate = getFirstCheckInDayDate(habit);
          if (firstCheckInDate) {
            return (
              firstCheckInDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) &&
              !isMostRecentStatusReportSent(habit)
            )
          }
        })
      )
    })
  }
}

export default doOtherMilestonesHaveStatusReportDue;