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
    ChevronUpIcon,
    CloseIcon,
    HamburgerIcon,
} from "@chakra-ui/icons";
import { HabitWithDetails, MilestoneWithDetails } from "../../types/index.js";
import areDatesSameDayMonthYear from "..//utils/areDatesSameDayMonthYear.js";
import UpdateHabitButton from "./UpdateHabitButton.js";
import StatusReportFormButton from "./StatusReportFormButton.js";
import isMostRecentStatusReportSent from "..//utils/isMostRecentStatusReportSent.js";
import getFirstCheckInDayDate from "..//utils/getFirstCheckInDayDate.js";
import isDateToday from "../utils/isDateToday.js";
import getDayOfWeekLabelText from "../utils/getDayOfWeekLabelText.js";
import isHabitRoutineDay from "./isHabitRoutineDay.js";
import isDateOutOfRange from "../utils/isDateOutOfRange.js";

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

const SEVEN_DAYS_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;


const HabitCard = ({ habit, milestone }: HabitProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([])

  const isStatusReportSent = isMostRecentStatusReportSent(habit);
  
  const midnightOfFirstCheckIn = getFirstCheckInDayDate(habit)?.setHours(0, 0, 0, 0)
  const isTodayBeforeFirstCheckInDayDate = midnightOfFirstCheckIn && Date.now() < midnightOfFirstCheckIn

  if (!currentWeek.length) {
    let firstWeek = [];
    const firstDay = new Date(habit.dateCreated)

    // Get number associated with current day of the week
    const firstDayNumber = firstDay.getDay()

    // Push Sunday before firstDay's date to firstWeek array
    firstWeek.push(new Date(firstDay.setDate(firstDay.getDate() - firstDayNumber)))

    // Push the rest of dates in that week to firstWeek array
    for (let i = 1; i < 7; i++) {
      const newDate = new Date();
      firstWeek.push(new Date(newDate.setDate(firstWeek[i - 1].getDate() + 1)))
    }
    setCurrentWeek(firstWeek);
  } 

  // Function for left arrow button that displays previous week
  const handleLeftArrowClick = () => {
    const previousWeek: Date[] = [];

    for (let i = 0; i < currentWeek.length; i++) {
      const newDate = new Date();
      previousWeek.push(new Date(newDate.setTime(currentWeek[i].getTime() - SEVEN_DAYS_IN_MILLISECONDS)))
    }
    setCurrentWeek(previousWeek);
  }

    // Function for right arrow button that displays previous week
  const handleRightArrowClick = () => {
    const nextWeek: Date[] = [];

    for (let i = 0; i < currentWeek.length; i++) {
      const newDate = new Date();
      nextWeek.push(new Date(newDate.setTime(currentWeek[i].getTime() + SEVEN_DAYS_IN_MILLISECONDS)))
    }
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
        minW="345px"
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
                  <>
                    {
                      isToday ? 
                      <GridItem colStart={(i * 2) + 1} textAlign="center" key={`today-${Date.parse(day.toISOString())}`}rowStart={1} colSpan={5} rowSpan={1}>Today</GridItem>
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
                      key={`day-label-${Date.parse(day.toISOString())}`}
                    >
                      {dayAbbreviation}
                    </GridItem>
                    <GridItem
                      padding={".2vw"} 
                      colStart={(i * 2) + 3}
                      colSpan={1} 
                      rowStart={3}
                      textAlign="center"
                      key={`date-label-${Date.parse(day.toISOString())}`}
                      borderLeft={isToday ? "2px solid #3a3c3c" : {}}
                      borderRight={isToday ? "2px solid #3a3c3c" : {}}
                      borderBottom={isToday && !isHabitRoutineDay(habit, day) ? "2px solid #3a3c3c" : {}}
                      borderBottomRadius={isToday && !isHabitRoutineDay(habit, day)? 10 : {}}
                      color="gray"
                    >
                      {day.toLocaleDateString(undefined, {month: 'numeric', day: 'numeric'})}
                    </GridItem>
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
                        key={`checkbox-${Date.parse(day.toISOString())}`}
                      >
                        <ToggleButton
                        milestone={milestone}
                        date={day}
                        habit={habit}
                        isOutOfRange={isOutOfRange}
                      />
                      </GridItem>
                    </Tooltip>
                    
                    {
                      isCheckInDay ?
                      <>
                        <GridItem
                          padding={".2vw"}
                          colStart={(i * 2) + 3}
                          colSpan={1} 
                          rowStart={isHabitRoutineDay(habit, day) ? 5 : 4}
                          textAlign="center"
                          key={`check-in-pointer-${Date.parse(day.toISOString())}`}
                        >
                          <ChevronUpIcon/>
                        </GridItem>
                        <GridItem
                          padding={".2vw"}
                          colStart={(i * 2) + 1}
                          colSpan={5} 
                          rowStart={isHabitRoutineDay(habit, day) ? 6 : 5}
                          textAlign="center"
                          key={`check-in-label-${Date.parse(day.toISOString())}`}
                        >
                          <Box>
                            Check-In Day
                          </Box>
                        </GridItem>
                       </>
                      : ""
                     }
                  </>
                )
              })}
            </Grid>
          </CardBody>
          <CardFooter
            color={milestone.isCanceled || milestone.isCompleted ? "gray" : ""}
          >
          </CardFooter>
          
          {milestone && milestone.isCompleted || milestone.isCanceled ? "" : (!isStatusReportSent && !isTodayBeforeFirstCheckInDayDate &&
            <Box
            mt="15px"
            mb="20px"
          >
            <StatusReportFormButton
              habit={habit}
            />
            </Box>
          )}
        </Flex>
      </Card>
    </>
  );
};

export default HabitCard;