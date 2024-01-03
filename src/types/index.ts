import {  User } from '@prisma/client';

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

export type routineDays = {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export type checkInDay =     
"MONDAY" | 
"TUESDAY" |
"WEDNESDAY" |
"THURSDAY" |
"FRIDAY" |
"SATURDAY" |
"SUNDAY"

export interface createHabitReqBody {
  name: string
  routineDays: routineDays
  checkInDay: checkInDay
}