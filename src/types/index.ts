import { DaysOfWeek } from '@knocklabs/node';
import {  CheckIn, DayOfTheWeek, Prisma, Routine, StatusReport, User } from '@prisma/client';

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
  scheduleId: string
  goalId: number
}

export interface UpdateHabitReqBody {
  name: string
  datesCompleted: Date[]
  routineDays: RoutineDays
  checkInDay: DayOfTheWeek
  scheduleId: string | null
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
  scheduleId: string | null
  goalId: number
}


export interface CreateScheduleReqBody {
  habitName: string
  goalName: string
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

export interface CreateGoalReqBody {
  name: string
  dueDate: Date
}

export interface GoalWithDetails {
  id: number
  dateCreated: Date
  dateUpdated: Date
  name: string
  dueDate: Date
  isCompleted: boolean
  isCanceled: boolean
  ownerId: number
  habits: HabitWithDetails[]
}

export interface CreateGoalMutationArgs {
  ownerId: number
  name: string
  dueDate: Date
}

export interface UpdateGoalReqBody {
  name: string
  dueDate: Date
  isCompleted: boolean
  isCanceled: boolean
}
export interface RegisterMutationResponse {
  error?: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError
  status?: number
  token?: string,
  user?: Omit<User, 'password'>,
}

export interface LoginMutationResponse extends RegisterMutationResponse {
  name?: string
  message?: string
}