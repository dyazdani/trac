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
          <CardFooter>1.23.34 - 5.67.89</CardFooter>
        </Flex>
      </Card>
    </>
  );
};

export default HabitCard;
