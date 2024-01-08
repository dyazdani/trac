import React from "react";
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
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowLeftIcon,
    ArrowRightIcon
} from "@chakra-ui/icons";
import { Habit } from "@prisma/client";
import { HabitWithDetails } from "../../types/index.js";

type HabitProps = {
  habit: HabitWithDetails
};

const Habit = ({ habit }: HabitProps) => {
  return (
    <>
      <Card 
        size={"sm"} 
        maxW={"3xl"}
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
        />
        <CardHeader>
          <HStack justify={"end"}>
            <Heading 
                sx={{ marginRight: "auto" }} 
                size="md"
            >
              Habit Name
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

export default Habit;
