import React from "react";

import {
  HStack,
  Text,
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
    DeleteIcon 
} from "@chakra-ui/icons";

type HabitProps = {};

const Habit = (props: HabitProps) => {
  return (
    <>
      <Card 
        size={"sm"} 
        maxW={"3xl"}
      >
        <CardHeader>
          <HStack justify={"end"}>
            <Heading 
                sx={{ marginRight: "auto" }} 
                size="md"
            >
              Habit Name
            </Heading>
            <IconButton aria-label="edit-habit-button">
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete-habit-button">
              <DeleteIcon />
            </IconButton>
          </HStack>
        </CardHeader>
        <Flex 
            direction={"column"} 
            align={"center"}
            >
          <CardBody>
            <Text>Hello</Text>
          </CardBody>
          <CardFooter>ex: 1.23.34 - 5.67.89</CardFooter>
        </Flex>
      </Card>
    </>
  );
};

export default Habit;
