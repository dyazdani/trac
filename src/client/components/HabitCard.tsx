import React, {useState} from "react";
import ToggleButton from "./ToggleButton.js";

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

const HabitCard = ({ habit }: HabitProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([])

  if (!currentWeek.length) {
    let firstWeek = [];
    const today = new Date(Date.now())

    // Get number associated with day of the week
    const todayNumber = new Date(today).getDay()

    // Push Sunday date before today't date to firstWeek array
    firstWeek.push(new Date(today.setDate(today.getDate() - todayNumber)))

    // Push the rest of the following dates that week to firstWeek array
    for (let i = 1; i < 7; i++) {
      const newDate = new Date();
      firstWeek.push(new Date(newDate.setDate(firstWeek[i - 1].getDate() + 1)))
    }

    console.log(firstWeek)
    setCurrentWeek(firstWeek);
  }

  const handleLeftArrowClick = () => {
    const previousWeek: Date[] = [];

    for (let i = 0; i < currentWeek.length; i++) {
      const newDate = new Date();
      previousWeek.push(new Date(newDate.setDate(currentWeek[i].getDate() - 7)))
    }
    setCurrentWeek(previousWeek);
  }

  const handleRightArrowClick = () => {
    const nextWeek: Date[] = [];

    for (let i = 0; i < currentWeek.length; i++) {
      const newDate = new Date();
      nextWeek.push(new Date(newDate.setDate(currentWeek[i].getDate() + 7)))
    }
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
            <IconButton 
                aria-label="delete-habit-button" 
                icon={<DeleteIcon />} 
                variant="unstyled"
            />
          </HStack>
        </CardHeader>
        <Flex 
            direction={"column"} 
            align={"center"}
            >
          <CardBody>
            <HStack>
                <ToggleButton date={new Date(Date.now())} habitId={23} isCheckInDay={true}/>
                <ToggleButton date={new Date(Date.now())} habitId={23} isCheckInDay={false}/>
                <ToggleButton date={new Date(Date.now())} habitId={23} isCheckInDay={false}/>
                <ToggleButton date={new Date(Date.now())} habitId={23} isCheckInDay={false}/>
                <ToggleButton date={new Date(Date.now())} habitId={23} isCheckInDay={false}/>
                <ToggleButton date={new Date(Date.now())} habitId={23} isCheckInDay={false}/>
                <ToggleButton date={new Date(Date.now())} habitId={23} isCheckInDay={false}/>
            </HStack>
          </CardBody>
          {/* TODO: make this date string less verbose */}
          <CardFooter>{`${currentWeek[0].toDateString()} - ${currentWeek[6].toDateString()}`}</CardFooter>
        </Flex>
      </Card>
    </>
  );
};

export default HabitCard;
