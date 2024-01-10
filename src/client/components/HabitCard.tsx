import React, {useState} from "react";
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
} from "@chakra-ui/react";

import { 
    EditIcon, 
    DeleteIcon,
    ArrowLeftIcon,
    ArrowRightIcon
} from "@chakra-ui/icons";
import { HabitWithDetails } from "../../types/index.js";
import areDatesSameDayMonthYear from "../../utils/areDatesSameDayMonthYear.js";

type HabitProps = {
  habit: HabitWithDetails
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


const HabitCard = ({ habit }: HabitProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([])

  // Variable for displaying date range at bottom of HabitCard
  let dateRangeString = ""

  console.log("currentWeek: ", currentWeek)
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
    console.log(firstWeek)
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
    console.log("previousWeek: ", previousWeek)
    setCurrentWeek(previousWeek);
  }

    // Function for right arrow button that displays previous week
  const handleRightArrowClick = () => {
    const nextWeek: Date[] = [];

    for (let i = 0; i < currentWeek.length; i++) {
      const newDate = new Date();
      nextWeek.push(new Date(newDate.setTime(currentWeek[i].getTime() + SEVEN_DAYS_IN_MILLISECONDS)))
    }
    console.log("next: ", nextWeek)
    setCurrentWeek(nextWeek);
  }

  return (
    <>
      <Card 
        w="30vw" 
        maxW="400px"
        minW="320px"
        bg={"pink"}
        sx={{ borderRadius: "20px"}}
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
            <IconButton 
                aria-label="edit-habit-button" 
                icon={<EditIcon />} 
                variant="unstyled"
            />
            <DeleteHabitButton />
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
                      date={day}
                      habit={habit}
                      isCheckInDay={DAY_STRINGS[day.getDay()] === habit.checkIn?.dayOfTheWeek}
                    />

                  )
                })}
            </HStack>
          </CardBody>
          <CardFooter>{dateRangeString}</CardFooter>
        </Flex>
      </Card>
    </>
  );
};

export default HabitCard;
