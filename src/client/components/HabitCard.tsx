import {useState} from "react";
import ToggleButton from "./ToggleButton.js";
import DeleteHabitButton from "./DeleteHabitButton.js";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  IconButton,
  Flex,
  Box,
  Text,
  MenuButton,
  Menu,
  MenuList,
  Button,
  Grid,
  GridItem,
  useToast
} from "@chakra-ui/react";
import { motion } from 'framer-motion';
import { 
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    CloseIcon,
    HamburgerIcon,
    RepeatClockIcon,
    SettingsIcon,
} from "@chakra-ui/icons";
import { 
  HabitWithDetails, 
  GoalWithDetails 
} from "../../types/index.js";
import areDatesSameDayMonthYear from "..//utils/areDatesSameDayMonthYear.js";
import UpdateHabitButton from "./UpdateHabitButton.js";
import StatusReportFormButton from "./StatusReportFormButton.js";
import isMostRecentStatusReportSent from "..//utils/isMostRecentStatusReportSent.js";
import getFirstCheckInDayDate from "..//utils/getFirstCheckInDayDate.js";
import isDateToday from "../utils/isDateToday.js";
import getDayOfWeekLabelText from "../utils/getDayOfWeekLabelText.js";
import isHabitRoutineDay from "../utils/isHabitRoutineDay.js";
import isDateOutOfRange from "../utils/isDateOutOfRange.js";
import { useUpdateHabitMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import getPreviousWeek from "../utils/getPreviousWeek.js";
import getNextWeek from "../utils/getNextWeek.js";
import React from "react";
import getCurrentWeek from "../utils/getCurrentWeek.js";


type HabitProps = {
  habit: HabitWithDetails
  goal: GoalWithDetails
};

// for comparison with DayOfTheWeek enum on CheckIn model
const DAY_STRINGS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
]

export const SEVEN_DAYS_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;


const HabitCard = ({ habit, goal }: HabitProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>(getCurrentWeek(habit, goal))
  const [isToggleLoading, setIsToggleLoading] = useState(false);

  const toast = useToast();
  
  const isCompleted = habit.datesCompleted.some(date => areDatesSameDayMonthYear(new Date(date), new Date()))

  const localStorageUser = localStorage.getItem("user")
  const appSelectorUser = useAppSelector(state => state.auth.user)
  const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser

  const [updateHabit, { isLoading }] = useUpdateHabitMutation();

  const today = new Date()
  
  // handling click for "Complete Today" button

  // variable for current habit details to be sent with update mutation
  let habitData: HabitWithDetails;

  if (currentUser) {
      habitData = habit
  }

  const handleClick = async () => {
    if (currentUser && habitData && !isLoading) {
        const {
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday
        } = habitData.routine

        // determine whether to add or subtract today's date
        const newDatesCompleted = isCompleted ? 
        habitData.datesCompleted.filter((el) => {
            return !areDatesSameDayMonthYear(new Date(el), today);
        }) : 
        [...habitData.datesCompleted, today]

        try {
          const updateResult = await updateHabit({
              id: currentUser?.id,
              habitId: habit.id,
              newHabit: {
                  name: habitData.name,
                  datesCompleted: newDatesCompleted,
                  routineDays: {
                      monday,
                      tuesday,
                      wednesday,
                      thursday,
                      friday,
                      saturday,
                      sunday
                  },
                  checkInDay: habitData.checkIn.dayOfTheWeek,
                  scheduleId: habit.scheduleId
              }
          }).unwrap()

          if (updateResult.habit.datesCompleted.length > habit.datesCompleted.length) {
              toast({
                  title: 'Routine Day Completed',
                  description: `"${habit.name}" completed for ${
                      today.toLocaleDateString(
                          undefined, 
                          {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                          }
                      )}.`,
                  status: 'success',
                  variant: 'subtle',
                  duration: 9000,
                  isClosable: true,
                  icon: <CheckIcon boxSize="1.4em"/>
              })
          }

          if (updateResult.habit.datesCompleted.length < habit.datesCompleted.length) {
              toast({
                  title: 'Routine Day Incomplete',
                  description: `"${habit.name}" marked incomplete for ${
                      today.toLocaleDateString(
                          undefined, 
                          {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                          }
                      )}.`,
                  status: 'info',
                  variant: 'subtle',
                  duration: 9000,
                  isClosable: true,
                  icon: <RepeatClockIcon boxSize="1.4em"/>
              })
          }
      } catch (e) {
          toast({
              title: 'ERROR',
              description: `Unable to complete "${habit.name}" for ${today.toLocaleDateString(
                  undefined, 
                  {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                  }
              )}`,
              status: 'error',
              duration: 9000,
              isClosable: true
          })
      }      
    }
  } 
  
  const isStatusReportSent = isMostRecentStatusReportSent(habit);
  
  const midnightOfFirstCheckIn = getFirstCheckInDayDate(habit)?.setHours(0, 0, 0, 0)
  const isTodayBeforeFirstCheckInDayDate = midnightOfFirstCheckIn && Date.now() < midnightOfFirstCheckIn

  if (currentWeek.every(date => date.setHours(0, 0, 0, 0) > new Date(goal.dueDate).setHours(0, 0, 0, 0))) {
    let targetWeek = getPreviousWeek(currentWeek);

    while (targetWeek.every(date => date.setHours(0, 0, 0, 0) > new Date(goal.dueDate).setHours(0, 0, 0, 0))) {
      targetWeek = getPreviousWeek(targetWeek);
    }

    setCurrentWeek(targetWeek);
  }

  // Function for left arrow button that displays previous week
  const handleLeftArrowClick = () => {
    const previousWeek = getPreviousWeek(currentWeek);
    setCurrentWeek(previousWeek);
  }

    // Function for right arrow button that displays previous week
  const handleRightArrowClick = () => {
    const nextWeek = getNextWeek(currentWeek);
    setCurrentWeek(nextWeek);
  }


  return (
    <Card
      backgroundColor="transparent"
      boxShadow="none"
    >
      <CardHeader
        paddingTop="0"      
        paddingBottom="20px"
      >
        <Flex
          flexFlow={{
            base: "column",
            md: "row"
          }}
          justifyContent="space-between"
          alignItems="center"
          gap="1vw"
        >
          <Heading 
            sx={{ marginRight: "auto" }} 
            as="h4"
            flex={1}
            size="md"
            color={goal.isCanceled || goal.isCompleted ? "darkslategray.600" : ""}
            width={{
              base: "100%",
              md: undefined
            }}
          >
            <Text 
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              textAlign={{
                base: "center",
                md: "start"
              }}
            >
              {habit.name}
            </Text>
          </Heading>
          <Menu
            isLazy
            closeOnSelect={false}
            closeOnBlur={false}
          >
            {({ isOpen}) => (
              <>
                <MenuButton
                  marginTop={{
                    base: "1rem",
                    md: "0"
                  }}
                  as={IconButton}
                  aria-label="Open Habit options menu"
                  icon={<SettingsIcon/>}
                  backgroundColor="cornflowerblue.100"
                  _hover={{
                    backgroundColor: "cornflowerblue.300",
                    color: "floralwhite.50"    
                  }}
                  _active={{
                    backgroundColor: "cornflowerblue.600",
                    color: "floralwhite.50"    
                  }} 
                  isActive={isOpen}
                />
                <MenuList
                  backgroundColor="cornflowerblue.50"
                >
                  <UpdateHabitButton habit={habit}/>
                  <DeleteHabitButton habit={habit}/>
                </MenuList>
              </>
            )}
          </Menu>
          {
            isHabitRoutineDay(habit, today) && 
            !isDateOutOfRange(new Date(habit.dateCreated), new Date(goal.dueDate), today) &&
            !goal.isCompleted &&
            !goal.isCanceled ? 
            <Button
              marginTop={{
                base: ".5rem",
                md: "0"
              }}
              backgroundColor={goal.isCompleted ? "peach.100" : "peach.300"}
              color="#353231"
              _hover={
                goal.isCompleted ? 
                { backgroundColor: "peach.200"} :
                { backgroundColor: "peach.500"}
              }
              _active={{
                backgroundColor: "peach.600",
                color: "floralwhite.50"
              }}
              isLoading={isLoading}
              leftIcon={!isCompleted ? <CheckIcon/> : undefined}
              onClick={() => {
                handleClick();
              }}
            >
              {isCompleted ? `Undo Complete Today` : `Complete Today`}
            </Button> :
            ""
          }
        </Flex>
      </CardHeader>
      <Flex 
        direction={"column"} 
        align={"center"}
      >
        {
          !currentWeek.some(date => isDateToday(date)) &&
          today.setHours(0, 0, 0, 0) < new Date(goal.dueDate).setHours(0, 0, 0, 0) ?
          <Button
            position="relative"
            leftIcon={
              currentWeek[0].setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0) ?
              <ChevronLeftIcon/> :
              undefined 
            }
            rightIcon={
              currentWeek[6].setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ?
              <ChevronRightIcon/> :
              undefined 
            }
            top="30px"
            aria-label="go to current week"
            backgroundColor="cornflowerblue.100"
            _hover={{
              backgroundColor: "cornflowerblue.300",
              color: "floralwhite.50"    
            }}
            _active={{
              backgroundColor: "cornflowerblue.600",
              color: "floralwhite.50"    
            }} 
            onClick={e => {
              e.preventDefault();

              let targetWeek = currentWeek;

              while (targetWeek.every(date => !isDateToday(date))) {
                if (targetWeek[0].setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {
                  targetWeek = getPreviousWeek(targetWeek);
                }

                if (targetWeek[6].setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                  targetWeek = getNextWeek(targetWeek);
                }
                
              }
              setCurrentWeek(targetWeek);
            }}
          >
            Today
          </Button> : 
          ""
        }
        <CardBody
          padding="0"
        >
          <Grid 
            templateColumns="repeat(17, 1fr)" 
            templateRows="repeat(6, 1fr)" 
            p="1vw"
            rounded="lg"
          >
            <GridItem
              padding={".2vw"}
              colStart={1}
              colSpan={1}
              rowSpan={1}
              rowStart={3}
            >
              <IconButton
                fontSize={{
                  base: ".6rem",
                  md: "1rem"
                }}   
                aria-label="see-previous-week" 
                icon={<ArrowLeftIcon />}
                size="sm"
                variant="unstyled"
                isDisabled={currentWeek.some(day => {
                  return areDatesSameDayMonthYear(day, new Date(habit.dateCreated))
                })}
                onClick={handleLeftArrowClick}
              />
            </GridItem>
            <GridItem
              padding={".2vw"}
              colStart={17}
              colSpan={1}
              rowSpan={1}
              rowStart={3}
            >
              <IconButton 
                fontSize={{
                  base: ".6rem",
                  md: "1rem"
                }}
                aria-label="see-next-week" 
                icon={<ArrowRightIcon />} 
                size="sm"
                variant="unstyled"
                isDisabled={currentWeek.some(day => {
                  return (
                    (goal.isCompleted || goal.isCanceled) && 
                    isDateToday(day) || 
                    day.setHours(0, 0, 0, 0) >= new Date(goal.dueDate).setHours(0, 0, 0, 0) 
                  )
                })}
                onClick={handleRightArrowClick}
              />
                  
            </GridItem>
            {currentWeek.map((day, i) => {
              // get boolean for if the date prop is today's date
              const isToday = isDateToday(day);

              // extract day of the week abbreviation for label
              const dayAbbreviation = getDayOfWeekLabelText(day);

              // Determine if day Check-In Day
              const isCheckInDay = DAY_STRINGS[day.getDay()] === habit.checkIn?.dayOfTheWeek && !areDatesSameDayMonthYear(day, new Date(habit.dateCreated))

              // Determine if day is out of range
              const isOutOfRange = isDateOutOfRange(new Date(habit.dateCreated), new Date(), day)

              const todayBorder =  isToday && 
                day.setHours(0, 0, 0, 0) <= new Date(goal.dueDate).setHours(0, 0, 0, 0) &&
                !goal.isCompleted &&
                !goal.isCanceled  ? 
                "2px solid #282625" : 
                {}
                
              
              return (
                <React.Fragment key={`${day}`}>
                  {
                    isToday && 
                    day.setHours(0, 0, 0, 0) <= new Date(goal.dueDate).setHours(0, 0, 0, 0) &&
                    !goal.isCompleted &&
                    !goal.isCanceled ?  
                    <GridItem 
                      colStart={(i * 2) + 1} 
                      textAlign="center" 
                      rowStart={1} 
                      colSpan={5} 
                      rowSpan={1}
                      color={"darkslategray.900"}
                    >
                      Today
                    </GridItem> : 
                    ""
                  }
                  {
                    (goal.isCompleted || goal.isCanceled) && isOutOfRange ? 
                    "" :
                    !isDateOutOfRange(new Date(habit.dateCreated), new Date(goal.dueDate), day) ?
                    <>
                      <GridItem
                        fontSize={{
                          base: ".6rem",
                          'smaller-md': ".8rem",
                          'sm-md': "1rem"
                        }}
                      padding={".2vw"}
                      borderTop={todayBorder}
                      borderLeft={todayBorder}
                      borderRight={todayBorder}
                      borderTopRadius={isToday ? 10 : {}}
                      colStart={(i * 2) + 3}
                      colSpan={1} 
                      rowStart={2}
                      textAlign="center"
                      color={isDateOutOfRange(new Date(habit.dateCreated), new Date(goal.dueDate), day) || isOutOfRange || goal.isCanceled || goal.isCompleted ? "darkslategray.600" : "darkslategray.900"}
                    >
                      {dayAbbreviation}
                    </GridItem>
                    <GridItem
                      fontSize={{
                        base: ".6rem",
                        'smaller-md': ".8rem",
                        'sm-md': "1rem"
                      }}
                      padding={".2vw"} 
                      colStart={(i * 2) + 3}
                      colSpan={1} 
                      rowStart={3}
                      textAlign="center"
                      borderLeft={todayBorder}
                      borderRight={todayBorder}
                      borderBottom={!isHabitRoutineDay(habit, day) ? todayBorder : ""}
                      borderBottomRadius={isToday && !isHabitRoutineDay(habit, day)? 10 : {}}
                      color={isDateOutOfRange(new Date(habit.dateCreated), new Date(goal.dueDate), day) || isOutOfRange || goal.isCanceled || goal.isCompleted  ? "darkslategray.600" : "darkslategray.900"}
                    >
                      {
                        (day.getMonth() === 11 && day.getDate() === 31) ||
                        (day.getMonth() === 0 && day.getDate() === 1) ?
                        day.toLocaleDateString(undefined, {month: 'numeric', day: 'numeric', year: '2-digit'}) :
                        day.toLocaleDateString(undefined, {month: 'numeric', day: 'numeric'}) 
                      }
                    </GridItem>
                    <GridItem
                      padding={".2vw"}
                      borderBottom={isHabitRoutineDay(habit, day) ? todayBorder : {}}
                      borderLeft={isHabitRoutineDay(habit, day) ? todayBorder : {}}
                      borderRight={isHabitRoutineDay(habit, day) ? todayBorder : {}}
                      borderBottomRadius={isToday && isHabitRoutineDay(habit, day)? 10 : {}}
                      colStart={(i * 2) + 3}
                      colSpan={1} 
                      rowStart={4}
                      textAlign="center"
                      onClickCapture={isToggleLoading ? 
                        (e) => {
                        e.stopPropagation();
                      } : undefined
                    }
                    > 
                    <ToggleButton
                      goal={goal}
                      date={day}
                      habit={habit}
                      isOutOfRange={isOutOfRange}
                      isToggleLoading={isToggleLoading}
                      setIsToggleLoading={setIsToggleLoading}
                    /> 
                    </GridItem>
                    </> :
                    ""
                  }
                  
                  {
                    isCheckInDay && 
                    !isDateOutOfRange(new Date(habit.dateCreated), new Date(goal.dueDate), day) &&
                    !goal.isCompleted &&
                    !goal.isCanceled &&
                    !areDatesSameDayMonthYear(day, new Date(goal.dueDate)) ?
                    <>
                      <GridItem
                        padding={".2vw"}
                        colStart={(i * 2) + 3}
                        colSpan={1} 
                        rowStart={isHabitRoutineDay(habit, day) ? 5 : 4}
                        textAlign="center"
                      >
                        <ChevronUpIcon color={isOutOfRange ? "darkslategray.600" : "darkslategray.900"}/>
                      </GridItem>
                      <GridItem
                        padding={".2vw"}
                        colStart={(i * 2) + 1}
                        colSpan={5} 
                        rowStart={isHabitRoutineDay(habit, day) ? 6 : 5}
                        textAlign="center"
                      >
                        <Box
                          color={isOutOfRange ? "darkslategray.600" : "darkslategray.900"}
                        >
                          Check-In
                        </Box>
                      </GridItem>
                      </>
                    : ""
                    }
                    {
                    areDatesSameDayMonthYear(day, new Date(habit.dateCreated)) ?
                    <>
                      <GridItem
                        padding={".2vw"}
                        colStart={(i * 2) + 3}
                        colSpan={1} 
                        rowStart={isHabitRoutineDay(habit, day) ? 5 : 4}
                        textAlign="center"
                      >
                        <ChevronUpIcon color={goal.isCanceled || goal.isCompleted ? "darkslategray.600" : "darkslategray.900"}/>
                      </GridItem>
                      <GridItem
                        padding={".2vw"}
                        colStart={(i * 2) + 2}
                        colSpan={3} 
                        rowStart={isHabitRoutineDay(habit, day) ? 6 : 5}
                        textAlign="center"
                      >
                        <Box
                          color={goal.isCanceled || goal.isCompleted ? "darkslategray.600" : "darkslategray.900"}
                        >
                          Start
                        </Box>
                      </GridItem>
                      </> :
                      ""
                    }
                    {
                      areDatesSameDayMonthYear(day, new Date(goal.dueDate)) &&
                      !goal.isCompleted &&
                      !goal.isCanceled ?
                      <>
                        <GridItem
                          padding={".2vw"}
                          colStart={(i * 2) + 3}
                          colSpan={1} 
                          rowStart={isHabitRoutineDay(habit, day) ? 5 : 4}
                          textAlign="center"
                        >
                          <ChevronUpIcon 
                            color={
                              goal.isCanceled || 
                              goal.isCompleted ||
                              new Date().setHours(0, 0, 0, 0) < new Date(goal.dueDate).setHours(0, 0, 0, 0) ?  
                              "darkslategray.600" : 
                              "darkslategray.900"
                            }
                          />
                        </GridItem>
                        <GridItem
                          padding={".2vw"}
                          colStart={(i * 2) + 2}
                          colSpan={3} 
                          rowStart={isHabitRoutineDay(habit, day) ? 6 : 5}
                          textAlign="center"
                        >
                          <Box
                            color={
                              goal.isCanceled || 
                              goal.isCompleted || 
                              new Date().setHours(0, 0, 0, 0) < new Date(goal.dueDate).setHours(0, 0, 0, 0) ? 
                              "darkslategray.600" : 
                              "darkslategray.900"
                            }
                          >
                            Due Date
                          </Box>
                        </GridItem>
                      </> : 
                      ""
                    }
                </React.Fragment>
              )
            })}
          </Grid>
        </CardBody>       
        {
          goal && 
          goal.isCompleted || 
          goal.isCanceled ? "" : 
          (
            !isStatusReportSent && 
            !isTodayBeforeFirstCheckInDayDate &&
            <Box
              mb="20px"
            >
              <StatusReportFormButton
                habit={habit}
                goal={goal}
                textContent={
                  new Date().setHours(0, 0, 0, 0) >= new Date(goal.dueDate).setHours(0, 0, 0, 0) ? 
                  "Send Final Check-In Report" :
                  "Send Check-In Report"
                }
              />
            </Box>
          )
        }
      </Flex>
    </Card>
  );
};

export default HabitCard;