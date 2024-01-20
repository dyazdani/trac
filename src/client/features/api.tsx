import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store.js';
import { Habit } from '@prisma/client';
import { CreateHabitReqBody, UpdateHabitReqBody, HabitWithDetails, SendStatusReportReqBody } from '../../types/index.js';
import { DaysOfWeek, Schedule } from '@knocklabs/node';
import { User as KnockUser } from '@knocklabs/node';

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
      baseUrl: '/api', 
      prepareHeaders: (headers: Headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    }),
    tagTypes: [
      'CurrentUser', 
      'Routine', 
      'CheckIn', 
      'Habit', 
      'User', 
      'KnockUser',
      'Schedule',
      'StatusReport'
    ],
    endpoints: (builder) => ({
      register: builder.mutation({
        query: ({ email, username, password }) => ({
          url: "auth/register",
          method: "POST",
          body: { email, username, password },
        }),
        invalidatesTags: ["CurrentUser"],
      }),
      login: builder.mutation({
        query: ({ email, password }) => ({
          url: "auth/login",
          method: "POST",
          body: { email, password },
        }),
        invalidatesTags: ["CurrentUser"],
      }),
      createSchedule: builder.mutation<{schedules: Schedule[]}, {habitName: string, days: DaysOfWeek[], workflowKey: string}>({
        query: ({habitName, days, workflowKey}) => ({
          url: `/notifications/schedules`,
          method: "POST",
          body: {
            habitName,
            days,
            workflowKey
          },
        }),
        invalidatesTags: ["Schedule"],
      }),
      updateSchedule: builder.mutation<{schedules: Schedule[]}, {scheduleIds: string[], days: DaysOfWeek[]}>({
        query: ({scheduleIds, days}) => ({
          url: `/notifications/schedules`,
          method: "PUT",
          body: {
            scheduleIds,
            days
          },
        }),
        invalidatesTags: ["Schedule"],
      }),
      getSchedulesByUser: builder.query<{ schedules: Schedule[] }, number>({
        query: (id) => `/users/${id}/schedules`,
        providesTags: ["Schedule"]
      }),
      deleteKnockUser: builder.mutation<{message: string}, {id: string}>({
        query: ({id}) => ({
          url: `/notifications/users/${id}`,
          method: "DELETE"
        }),
        invalidatesTags: ["KnockUser"],
      }),
      identifyUser: builder.mutation<{user: KnockUser}, {id: string, email: string, username: string}>({
        query: ({id, email, username}) => ({
          url: `/notifications/users/${id}`,
          method: "PUT",
          body: {
            email,
            username
          }
        }),
        invalidatesTags: ["KnockUser"]
      }),
      getHabitsByUser: builder.query<{ habits: HabitWithDetails[] }, number>({
        query: (id) => `/users/${id}/habits`,
        providesTags: ["Habit"]
      }),
      getHabitById: builder.query<{ habit: HabitWithDetails }, {id: number, habitId: number}>({
        query: ({id, habitId}) => `/users/${id}/habits/${habitId}`,
        providesTags: ["Habit"]
      }),
            //TODO: the return type could be switched to HabitWithDetails to include relations
      createHabit: builder.mutation<{habit: Habit}, {id: number, habitDetails: CreateHabitReqBody}>({
        query: ({id, habitDetails}) => ({
          url: `/users/${id}/habits`,
          method: "POST",
          body: {
            name: habitDetails.name, 
            routineDays: habitDetails.routineDays, 
            checkInDay: habitDetails.checkInDay
          },
        }),
        invalidatesTags: ["Habit"],
      }),
      //TODO: the return type could be switched to HabitWithDetails to include relations
      updateHabit: builder.mutation<{habit: Habit}, {id: number, habitId: number, newHabit: UpdateHabitReqBody}>({
        query: ({id, habitId, newHabit}) => ({
          url: `users/${id}/habits`,
          method: "PUT",
          body: {
            habitId,
            name: newHabit.name,
            datesCompleted: newHabit.datesCompleted,
            routineDays: newHabit.routineDays,
            checkInDay: newHabit.checkInDay
          },
        }),
        invalidatesTags: ["Habit"],
      }),
      deleteHabit: builder.mutation<{habit: Habit}, {id: number, habitId: number}>({
        query: ({ id, habitId }) => ({
          url: `/users/${id}/habits/${habitId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ["Habit"]
      }),
      sendStatusReport: builder.mutation<{status: "Message Sent"}, SendStatusReportReqBody>({
        query: ({id, habitId, user, habitName, emails, message}) => ({
          url: `/users/${id}/habits/${habitId}/status-reports`,
          method: "POST",
          body: {
            user,
            habitName,
            emails,
            message
          },
        }),
        invalidatesTags: ["StatusReport"],
      })
    })
  })
  
  // Export hooks for usage in functional components, which are
  // auto-generated based on the defined endpoints

  export default api;
  
  export const { 
    useRegisterMutation,
    useLoginMutation,
    useGetHabitsByUserQuery,
    useCreateHabitMutation,
    useUpdateHabitMutation,
    useGetHabitByIdQuery,
    useCreateScheduleMutation,
    useDeleteKnockUserMutation,
    useIdentifyUserMutation,
    useDeleteHabitMutation,
    useSendStatusReportMutation,
    useUpdateScheduleMutation,
    useGetSchedulesByUserQuery
  } = api
