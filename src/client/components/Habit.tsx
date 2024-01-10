import React from "react";
import ToggleButton from "./ToggleButton.js";
import { HabitWithDetails } from "../../types/index.js";
import { useDeleteHabitMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";

import {
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  IconButton,
  Flex
} from "@chakra-ui/react";

import { 
    EditIcon, 
    DeleteIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
} from "@chakra-ui/icons";

type HabitProps = {
  habit: HabitWithDetails
};

const Habit = ({ habit }: HabitProps) => {
  const currentUser = useAppSelector(state => state.auth.user);
  const [deleteHabit, { isLoading, isError, error }] = useDeleteHabitMutation();

  const handleDeleteHabit = async () => {
    if (currentUser) {
      const deletedHabit = await deleteHabit({id: currentUser.id, habitId: habit.id})
      console.log(deletedHabit, "THE DELETED HABIT")
    }
  }
  
  return (
    <>
      <Card 
        size={"md"} 
        w="35vw"
        minW="sm"
        maxW="650px"
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
                onClick={handleDeleteHabit}
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
