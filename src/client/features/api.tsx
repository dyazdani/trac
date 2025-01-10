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
  GoalWithDetails, 
  CreateGoalMutationArgs, 
  UpdateGoalReqBody, 
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
      'Goal'
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
      createSchedule: builder.mutation<{schedules: Schedule[]}, {habitName: string, goalName: string, days: DaysOfWeek[], workflowKey: string}>({
        query: ({habitName, goalName, days, workflowKey}) => ({
          url: `/notifications/schedules`,
          method: "POST",
          body: {
            habitName,
            goalName,
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
      identifyUser: builder.mutation<{user: KnockUser}, {id: string, email: string, username: string, timezone: string}>({
        query: ({id, email, username, timezone}) => ({
          url: `/notifications/users/${id}`,
          method: "PUT",
          body: {
            email,
            username,
            timezone
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
      getHabitsByUser: builder.query<{ habits: HabitWithDetails[] }, number | undefined>({
        query: (id) => `/users/${id}/habits`,
        providesTags: ["Habit"]
      }),
      getHabitById: builder.query<{ habit: HabitWithDetails }, {id: number, habitId: number}>({
        query: ({id, habitId}) => `/users/${id}/habits/${habitId}`,
        providesTags: ["Habit", "CheckIn"]
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
            goalId: habitDetails.goalId
          },
        }),
        invalidatesTags: ["Habit", "Goal", "CheckIn"],
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
        invalidatesTags: ["Habit", "Goal", "CheckIn"],
      }),
      deleteHabit: builder.mutation<{habit: Habit}, {id: number, habitId: number}>({
        query: ({ id, habitId }) => ({
          url: `/users/${id}/habits/${habitId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ["Habit", "Goal", "CheckIn"]
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
        invalidatesTags: ["StatusReport", "Habit", "Goal"],
      }),
      getStatusReportsByHabitId: builder.query<{statusReports: StatusReport[]}, {id: number, habitId: number}>({
        query: ({id, habitId}) => `/users/${id}/habits/${habitId}/statusReports`,
        providesTags: ["StatusReport"]
      }),
      createGoal: builder.mutation<{goal: GoalWithDetails}, CreateGoalMutationArgs>({
        query: ({ownerId, name, dueDate}) => ({
          url: `/users/${ownerId}/goals`,
          method: "POST",
          body: {
            name,
            dueDate
          },
        }),
        invalidatesTags: ["Goal"],
      }),
      getGoalsByUser: builder.query<{ goals: GoalWithDetails[] }, number | undefined>({
        query: (ownerId) => `/users/${ownerId}/goals`,
        providesTags: ["Goal"]
      }),
      updateGoal: builder.mutation<{goal: GoalWithDetails}, {ownerId: number, goalId: number, newGoal: UpdateGoalReqBody}>({
        query: ({ownerId, goalId, newGoal}) => ({
          url: `users/${ownerId}/goals/${goalId}`,
          method: "PUT",
          body: {
            name: newGoal.name,
            dueDate: newGoal.dueDate,
            isCompleted: newGoal.isCompleted,
            isCanceled: newGoal.isCanceled
          },
        }),
        invalidatesTags: ["Goal", "Habit"],
      }),
      deleteGoal: builder.mutation<{goal: GoalWithDetails}, {ownerId: number, goalId: number}>({
        query: ({ ownerId, goalId }) => ({
          url: `/users/${ownerId}/goals/${goalId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ["Goal", "Habit"]
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
    useCreateGoalMutation,
    useGetGoalsByUserQuery,
    useUpdateGoalMutation,
    useDeleteGoalMutation,
    useGetAllUsersQuery,
    useGetUserByEmailQuery
  } = api


