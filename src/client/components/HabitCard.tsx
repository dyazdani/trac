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
  Spacer,
  Box,
  keyframes,
  Button
} from "@chakra-ui/react";
import { motion } from 'framer-motion';
import { 
    EditIcon, 
    ArrowLeftIcon,
    ArrowRightIcon
} from "@chakra-ui/icons";
import { HabitWithDetails, MilestoneWithDetails } from "../../types/index.js";
import areDatesSameDayMonthYear from "../../utils/areDatesSameDayMonthYear.js";
import UpdateHabitButton from "./UpdateHabitButton.js";
import StatusReportFormButton from "./StatusReportFormButton.js";
import isTodayCheckInDay from "../../utils/isTodayCheckInDay.js";
import isMostRecentStatusReportSent from "../../utils/isMostRecentStatusReportSent.js";
import getMostRecentCheckInDayDate from "../../utils/getMostRecentCheckInDayDate.js";
import getFirstCheckInDayDate from "../../utils/getFirstCheckInDayDate.js";

type HabitProps = {
  habit: HabitWithDetails
  milestone: MilestoneWithDetails
  handleClick: () => void
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


const HabitCard = ({ habit, milestone, handleClick }: HabitProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([])

  const isStatusReportSent = isMostRecentStatusReportSent(habit);
  
  const midnightOfFirstCheckIn = getFirstCheckInDayDate(habit)?.setHours(0, 0, 0, 0)
  const isTodayBeforeFirstCheckInDayDate = midnightOfFirstCheckIn && Date.now() < midnightOfFirstCheckIn

  // Variable for displaying date range at bottom of HabitCard
  let dateRangeString = ""

  if (!currentWeek.length) {
    let firstWeek = [];
    const today = new Date(Date.now())

    // Get number associated with day of the week
    const todayNumber = new Date(today).getDay()

    // Push Sunday before today's date to firstWeek array
    firstWeek.push(new Date(today.setDate(today.getDate() - todayNumber)))

    // Push the rest of dates in that week to firstWeek array
    for (let i = 1; i < 7; i++) {
      const newDate = new Date();
      firstWeek.push(new Date(newDate.setDate(firstWeek[i - 1].getDate() + 1)))
    }
    setCurrentWeek(firstWeek);
  } else {

    dateRangeString = `${currentWeek[0].toDateString().slice(4)} - ${currentWeek[6].toDateString().slice(4)}`
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
        animation={milestone && milestone.isCompleted ? "" :
          !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? animation : ""
        }
        w="30vw" 
        maxW="400px"
        minW="320px"
        bg={milestone && milestone.isCompleted ? `rgba(255,192,203, 0.2)` :
          !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? "linear-gradient(-45deg, #ffc0cb 40%, #ffe4e1 50%, #ffc0cb 60%)" : "pink"
        }
        borderRadius="20px"
        border={milestone && milestone.isCompleted ? "" :
          !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? "2mm ridge rgba(255,215,0, .6)" : ""
        }
        backgroundSize={milestone && milestone.isCompleted ? "" :
          !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? "300%" : ""
        }
        sx={milestone && milestone.isCompleted ? {} :
          !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? 
          {backgroundPositionX: '100%'} : 
          {}
        }
      >
        <IconButton 
            aria-label="habit-navigate-left" 
            icon={<ArrowLeftIcon />} 
            pos="absolute" 
            top="40%" 
            left="0"
            size="lg"
            variant="unstyled"
            isDisabled={currentWeek.some(day => {
              return areDatesSameDayMonthYear(day, new Date(habit.dateCreated))
            })}
            onClick={handleLeftArrowClick}
        />
        <IconButton 
            aria-label="habit-navigate-right" 
            icon={<ArrowRightIcon />} 
            pos="absolute" 
            top="40%" 
            right="0"
            size="lg"
            variant="unstyled"
            colorScheme="teal"
            isDisabled={currentWeek.some(day => {
              return areDatesSameDayMonthYear(day, new Date(Date.now()))
            })}
            onClick={handleRightArrowClick}
        />
        <CardHeader>
          <HStack justify={"end"}>
            <Heading 
                sx={{ marginRight: "auto" }} 
                size="md"
            >
              {habit.name}
            </Heading>
            <UpdateHabitButton habit={habit} handleClick={handleClick} milestone={milestone}/>
            <DeleteHabitButton habit={habit} handleClick={handleClick} milestone={milestone}/>
          </HStack>
        </CardHeader>
        <Flex 
            direction={"column"} 
            align={"center"}
            >
          <CardBody>
            <HStack>
              {currentWeek.map(day => {
                return (
                  <ToggleButton
                    key={Date.parse(day.toISOString())} 
                    milestone={milestone}
                    date={day}
                    habit={habit}
                    isCheckInDay={DAY_STRINGS[day.getDay()] === habit.checkIn?.dayOfTheWeek}
                  />
                )
              })}
            </HStack>
          </CardBody>
          <CardFooter>
            {dateRangeString}
          </CardFooter>
          
          {milestone && milestone.isCompleted ? "" : (!isStatusReportSent && !isTodayBeforeFirstCheckInDayDate &&
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