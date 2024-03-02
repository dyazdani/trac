import {useState} from "react";
import ToggleButton from "./ToggleButton.js";
import DeleteHabitButton from "./DeleteHabitButton.js";
import {
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  IconButton,
  Flex,
  Box,
  keyframes,
  MenuButton,
  Menu,
  MenuList,
  Button,
  Grid,
  GridItem,
  Tooltip,
} from "@chakra-ui/react";
import { motion } from 'framer-motion';
import { 
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    ChevronUpIcon,
    CloseIcon,
    HamburgerIcon,
} from "@chakra-ui/icons";
import { 
  HabitWithDetails, 
  MilestoneWithDetails 
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


type HabitProps = {
  habit: HabitWithDetails
  milestone: MilestoneWithDetails
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


const HabitCard = ({ habit, milestone }: HabitProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([])

  const isCompleted = habit.datesCompleted.some(date => areDatesSameDayMonthYear(new Date(date), new Date()))

  const localStorageUser = localStorage.getItem("user")
  const appSelectorUser = useAppSelector(state => state.auth.user)
  const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser

  console.log(currentUser)

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

        const currentHabit = await updateHabit({
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
        })
    }
  } 
  
  const isStatusReportSent = isMostRecentStatusReportSent(habit);
  
  const midnightOfFirstCheckIn = getFirstCheckInDayDate(habit)?.setHours(0, 0, 0, 0)
  const isTodayBeforeFirstCheckInDayDate = midnightOfFirstCheckIn && Date.now() < midnightOfFirstCheckIn

  if (!currentWeek.length) {
    let thisWeek: Date[] = [];
    const firstDay = new Date()

    // Get number associated with current day of the week
    const firstDayNumber = firstDay.getDay()

    // Push Sunday before firstDay's date to firstWeek array
    thisWeek.push(new Date(firstDay.setDate(firstDay.getDate() - firstDayNumber)))

    // Push the rest of dates in that week to firstWeek array
    for (let i = 1; i < 7; i++) {
      const previousDay = new Date(thisWeek[i - 1]);
      const previousDayOfTheMonth = thisWeek[i - 1].getDate()
      thisWeek.push(new Date(previousDay.setDate(previousDayOfTheMonth + 1)))
    }
    setCurrentWeek(thisWeek);
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


  const animationKeyframes = keyframes`to { background-position-x: 0% }`;
  const animation = `${animationKeyframes} 1s infinite linear`; 

  return (
    <>
      <Card
        as={motion.div}
        animation={milestone && milestone.isCompleted || milestone.isCanceled ? "" :
          !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? animation : ""
        }
        w="40vw" 
        minW="424px"
        bg={
          milestone && milestone.isCompleted ? `rgba(249, 209, 98, 0.1)` :
          milestone && milestone.isCanceled ? "rgba(212, 211, 212, 1)" :
          !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? "linear-gradient(-45deg, #F9D162 40%, #FBE29D 50%, #F9D162 60%)" : "rgb(249, 209, 98)"
        }
        borderRadius="20px"
        border={milestone && milestone.isCompleted || milestone.isCanceled ? "" :
          !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? "2mm ridge rgba(255,215,0, .6)" : ""
        }
        backgroundSize={milestone && milestone.isCompleted || milestone.isCanceled ? "" :
          !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? "300%" : ""
        }
        sx={milestone && milestone.isCompleted || milestone.isCanceled ? {} :
          !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? 
          {backgroundPositionX: '100%'} : 
          {}
        }
      >
        <CardHeader>
          <HStack justify={"end"}>
            <Heading 
              sx={{ marginRight: "auto" }} 
              size="md"
              color={milestone.isCanceled || milestone.isCompleted ? "gray" : ""}
            >
              {habit.name}
            </Heading>
            <Menu
              isLazy
              closeOnSelect={false}
              closeOnBlur={false}
            >
              {({ isOpen}) => (
                <>
                  <MenuButton
                    as={Button}
                    aria-label="Open Habit options menu"
                    rightIcon={isOpen ? <CloseIcon/> :<HamburgerIcon/>}
                    variant={isOpen ? "solid" : "outline"}
                    colorScheme="blue"
                    isActive={isOpen}
                  >Menu</MenuButton>
                  <MenuList>
                    <UpdateHabitButton habit={habit}/>
                    <DeleteHabitButton habit={habit}/>
                  </MenuList>
                </>
              )}
            </Menu>
          </HStack>
        </CardHeader>
        <Flex 
            direction={"column"} 
            align={"center"}
            >
          <CardBody>
            <Grid 
              templateColumns="repeat(17, 1fr)" 
              templateRows="repeat(6, 1fr)" 
              p="1vw"
              boxShadow="2xl"
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
                  aria-label="see-next-week" 
                  icon={<ArrowRightIcon />} 
                  size="sm"
                  variant="unstyled"
                  isDisabled={currentWeek.some(day => {
                    return areDatesSameDayMonthYear(day, new Date(Date.now()))
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
                const isCheckInDay = DAY_STRINGS[day.getDay()] === habit.checkIn?.dayOfTheWeek

                // Determine if day is out of range
                const isOutOfRange = isDateOutOfRange(new Date(habit.dateCreated), new Date(), day)

                  
                return (
                  <React.Fragment key={`${day}`}>
                    {
                      isToday ? 
                      <GridItem colStart={(i * 2) + 1} textAlign="center" 
                      rowStart={1} colSpan={5} rowSpan={1}>Today</GridItem>
                      : ""
                    }
                    <GridItem
                      padding={".2vw"}
                      borderTop={isToday ? "2px solid #3a3c3c" : {}}
                      borderLeft={isToday ? "2px solid #3a3c3c" : {}}
                      borderRight={isToday ? "2px solid #3a3c3c" : {}}
                      borderTopRadius={isToday ? 10 : {}}
                      colStart={(i * 2) + 3}
                      colSpan={1} 
                      rowStart={2}
                      textAlign="center"
                      color={isOutOfRange ? "gray" : "#3a3c3c"}
                    >
                      {dayAbbreviation}
                    </GridItem>
                    <GridItem
                      padding={".2vw"} 
                      colStart={(i * 2) + 3}
                      colSpan={1} 
                      rowStart={3}
                      textAlign="center"
                      borderLeft={isToday ? "2px solid #3a3c3c" : {}}
                      borderRight={isToday ? "2px solid #3a3c3c" : {}}
                      borderBottom={isToday && !isHabitRoutineDay(habit, day) ? "2px solid #3a3c3c" : {}}
                      borderBottomRadius={isToday && !isHabitRoutineDay(habit, day)? 10 : {}}
                      color={isOutOfRange ? "gray" : "#3a3c3c"}
                    >
                      {day.toLocaleDateString(undefined, {month: 'numeric', day: 'numeric'})}
                    </GridItem>
                    {!isOutOfRange ? 
                    (
                      <Tooltip
                      isDisabled={!isOutOfRange}
                      label="Cannot complete dates before Habit start or after today"
                      placement="bottom"
                    >
                      <GridItem
                        padding={".2vw"}
                        borderBottom={isToday && isHabitRoutineDay(habit, day) ? "2px solid #3a3c3c" : {}}
                        borderLeft={isToday && isHabitRoutineDay(habit, day)? "2px solid #3a3c3c" : {}}
                        borderRight={isToday && isHabitRoutineDay(habit, day)? "2px solid #3a3c3c" : {}}
                        borderBottomRadius={isToday && isHabitRoutineDay(habit, day)? 10 : {}}
                        colStart={(i * 2) + 3}
                        colSpan={1} 
                        rowStart={4}
                        textAlign="center"
                      >
                        <ToggleButton
                        milestone={milestone}
                        date={day}
                        habit={habit}
                        isOutOfRange={isOutOfRange}

                      />
                      </GridItem>
                    </Tooltip>
                    ) : ""
                  }
                    
                    
                    {
                      isCheckInDay && !isDateOutOfRange(new Date(habit.dateCreated), new Date(milestone.dueDate), day) ?
                      <>
                        <GridItem
                          padding={".2vw"}
                          colStart={(i * 2) + 3}
                          colSpan={1} 
                          rowStart={isHabitRoutineDay(habit, day) ? 5 : 4}
                          textAlign="center"
                        >
                          <ChevronUpIcon color={isOutOfRange ? "gray" : "#3a3c3c"}/>
                        </GridItem>
                        <GridItem
                          padding={".2vw"}
                          colStart={(i * 2) + 1}
                          colSpan={5} 
                          rowStart={isHabitRoutineDay(habit, day) ? 6 : 5}
                          textAlign="center"
                        >
                          <Box
                            color={isOutOfRange ? "gray" : "#3a3c3c"}
                          >
                            Check-In Day
                          </Box>
                        </GridItem>
                       </>
                      : ""
                     }
                  </React.Fragment>
                )
              })}
            </Grid>
          </CardBody>
          <CardFooter
            color={milestone.isCanceled || milestone.isCompleted ? "gray" : ""}
          >
              {
                isHabitRoutineDay(habit, today) ? 
                <Button
                  colorScheme="green"
                  isLoading={isLoading}
                  variant={isCompleted ? "outline" : "solid"}
                  leftIcon={isCompleted ? <CheckIcon/> : undefined}
                  onClick={() => {
                    handleClick();
                  }}
                >
                  {isCompleted ? `"${habit.name}" Completed Today!` : `Complete "${habit.name}" Today`}
                </Button> :
                ""
              }
            
          </CardFooter>
          
          {milestone && milestone.isCompleted || milestone.isCanceled ? "" : (!isStatusReportSent && !isTodayBeforeFirstCheckInDayDate &&
            <Box
            mt="15px"
            mb="20px"
          >
            <StatusReportFormButton
              habit={habit}
              milestone={milestone}
            />
            </Box>
          )}
        </Flex>
      </Card>
    </>
  );
};

export default HabitCard;