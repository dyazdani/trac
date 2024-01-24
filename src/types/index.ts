import { DaysOfWeek } from '@knocklabs/node';
import {  CheckIn, DayOfTheWeek, Routine, StatusReport, User } from '@prisma/client';

// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      user?: User | null;
    }
  }
}

// Types for req.body when creating a Habit 
// with POST /api/users/:id/habits

export type RoutineDays = {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export type DayString = 
  "monday" |
  "tuesday" |
  "wednesday" |
  "thursday" |
  "friday" | 
  "saturday" |
  "sunday"

export type RoutineDaysArrayType = DayString[] | [];

export interface CreateHabitReqBody {
  name: string
  routineDays: RoutineDays
  checkInDay: DayOfTheWeek
}

export interface UpdateHabitReqBody {
  name: string
  datesCompleted: Date[]
  routineDays: RoutineDays
  checkInDay: DayOfTheWeek
}

export interface HabitWithDetails {
  id: number
  dateCreated: Date
  dateUpdated: Date
  name: string
  datesCompleted: Date[]
  ownerId: number
  routine: Routine
  checkIn: CheckIn
  statusReports: StatusReport[]
}


export interface CreateScheduleReqBody {
  //TODO: userId will be deleted from this once req.user.id is being used instead in final version of branch
  userId: string
  habitName: string
  days: DaysOfWeek[]
  workflowKey: string
}

export interface SendStatusReportMutationArgs {
  id: number
  habitId: number
  user: string
  habitName: string
  emails: string[]
  message: string
  checkInDate: Date
}

export interface statusReportsPostReqBody {
  user: string
  habitName: string
  emails: string[]
  message: string
  checkInDate: Date
}