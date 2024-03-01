import { 
  createApi, 
  fetchBaseQuery 
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store.js';
import { 
  CheckIn, 
  Habit, 
  Routine, 
  StatusReport, 
  User
} from '@prisma/client';
import { 
  CreateHabitReqBody, 
  UpdateHabitReqBody, 
  HabitWithDetails, 
  SendStatusReportMutationArgs, 
  MilestoneWithDetails, 
  CreateMilestoneMutationArgs, 
  UpdateMilestoneReqBody, 
  RegisterMutationResponse,
  LoginMutationResponse
} from '../../types/index.js';
import { 
  DaysOfWeek, 
  Schedule 
} from '@knocklabs/node';
import { User as KnockUser } from '@knocklabs/node';

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
      baseUrl: '/api', 
      prepareHeaders: (headers: Headers, { getState }) => {
        const token = (getState() as RootState).auth.token || localStorage.getItem("token");
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
      'StatusReport',
      'Milestone'
    ],
    endpoints: (builder) => ({
      register: builder.mutation<RegisterMutationResponse, {email: string, username: string, password: string}>({
        query: ({ email, username, password }) => ({
          url: "auth/register",
          method: "POST",
          body: { email, username, password },
        }),
        invalidatesTags: ["CurrentUser", "User"],
      }),
      login: builder.mutation<LoginMutationResponse, {email: string, password: string}>({
        query: ({ email, password }) => ({
          url: "auth/login",
          method: "POST",
          body: { email, password },
        }),
        invalidatesTags: ["CurrentUser"],
      }),
      createSchedule: builder.mutation<{schedules: Schedule[]}, {habitName: string, milestoneName: string, days: DaysOfWeek[], workflowKey: string}>({
        query: ({habitName, milestoneName, days, workflowKey}) => ({
          url: `/notifications/schedules`,
          method: "POST",
          body: {
            habitName,
            milestoneName,
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
      deleteSchedules: builder.mutation<{message: "successfully deleted", schedules: Schedule[]}, {scheduleIds: string[]}>({
        query: ({scheduleIds}) => ({
          url: `/notifications/schedules`,
          method: "DELETE",
          body: {
            scheduleIds
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
      getAllUsers: builder.query<{users: {user: Omit<User, 'password'>}[]}, void>({
        query: () => '/users',
        providesTags: ['User']
      }),
      getUserByEmail: builder.query<{user: User}, string>({
        query: (email) => `/users`,
        providesTags: ["User"]
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
            checkInDay: habitDetails.checkInDay,
            scheduleId: habitDetails.scheduleId,
            milestoneId: habitDetails.milestoneId
          },
        }),
        invalidatesTags: ["Habit", "Milestone"],
      }),
      updateHabit: builder.mutation<{habit: Habit, routine: Routine, checkIn: CheckIn}, {id: number, habitId: number, newHabit: UpdateHabitReqBody}>({
        query: ({id, habitId, newHabit}) => ({
          url: `users/${id}/habits`,
          method: "PUT",
          body: {
            habitId,
            name: newHabit.name,
            datesCompleted: newHabit.datesCompleted,
            routineDays: newHabit.routineDays,
            checkInDay: newHabit.checkInDay,
            scheduleId: newHabit.scheduleId
          },
        }),
        invalidatesTags: ["Habit", "Milestone"],
      }),
      deleteHabit: builder.mutation<{habit: Habit}, {id: number, habitId: number}>({
        query: ({ id, habitId }) => ({
          url: `/users/${id}/habits/${habitId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ["Habit", "Milestone"]
      }),
      sendStatusReport: builder.mutation<{status: "Message Sent", statusReport: StatusReport}, SendStatusReportMutationArgs>({
        query: ({id, habitId, user, habitName, emails, message, checkInDate}) => ({
          url: `/users/${id}/habits/${habitId}/statusReports`,
          method: "POST",
          body: {
            user,
            habitName,
            emails,
            message,
            checkInDate
          },
        }),
        invalidatesTags: ["StatusReport", "Habit"],
      }),
      getStatusReportsByHabitId: builder.query<{statusReports: StatusReport[]}, {id: number, habitId: number}>({
        query: ({id, habitId}) => `/users/${id}/habits/${habitId}/statusReports`,
        providesTags: ["StatusReport"]
      }),
      createMilestone: builder.mutation<{milestone: MilestoneWithDetails}, CreateMilestoneMutationArgs>({
        query: ({ownerId, name, dueDate}) => ({
          url: `/users/${ownerId}/milestones`,
          method: "POST",
          body: {
            name,
            dueDate
          },
        }),
        invalidatesTags: ["Milestone"],
      }),
      getMilestonesByUser: builder.query<{ milestones: MilestoneWithDetails[] }, number>({
        query: (ownerId) => `/users/${ownerId}/milestones`,
        providesTags: ["Milestone"]
      }),
      updateMilestone: builder.mutation<{milestone: MilestoneWithDetails}, {ownerId: number, milestoneId: number, newMilestone: UpdateMilestoneReqBody}>({
        query: ({ownerId, milestoneId, newMilestone}) => ({
          url: `users/${ownerId}/milestones/${milestoneId}`,
          method: "PUT",
          body: {
            name: newMilestone.name,
            dueDate: newMilestone.dueDate,
            isCompleted: newMilestone.isCompleted,
            isCanceled: newMilestone.isCanceled
          },
        }),
        invalidatesTags: ["Milestone"],
      }),
      deleteMilestone: builder.mutation<{milestone: MilestoneWithDetails}, {ownerId: number, milestoneId: number}>({
        query: ({ ownerId, milestoneId }) => ({
          url: `/users/${ownerId}/milestones/${milestoneId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ["Milestone"]
      }),
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
    useGetSchedulesByUserQuery,
    useGetStatusReportsByHabitIdQuery,
    useDeleteSchedulesMutation,
    useCreateMilestoneMutation,
    useGetMilestonesByUserQuery,
    useUpdateMilestoneMutation,
    useDeleteMilestoneMutation,
    useGetAllUsersQuery,
    useGetUserByEmailQuery
  } = api


