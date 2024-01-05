import React from "react";
import todayImg from "../../../images/trac_today_icon.png";
import checkInDayImg from "../../../images/trac_check_in_day_img.png";

import { Heading, Text, Image, HStack, VStack, Box } from "@chakra-ui/react";

type MyHabitsProps = {};

const MyHabits = (props: MyHabitsProps) => {
  const array = [];
  for (let i = 0; i < 1000; i++) {
    array.push("I am a div");
  }
  return (
    <>
      <Box
        w={"100vw"}
        h={"100vh"}
        pl={10}
        bg={"lightgrey"}
        sx={{ overflow: "scroll" }}
      >
        <Box bg={'inherit'} sx={{opacity: 1 }} position={"sticky"} top={"3rem"} >
          <Heading>My Habits</Heading>
          <HStack>
            <HStack spacing={0}>
              <Image src={todayImg} p={0} />
              <Text>= today</Text>
            </HStack>
            <HStack spacing={0}>
              <Image src={checkInDayImg} />
              <Text>= check-in day</Text>
            </HStack>
          </HStack>
        </Box>
        <VStack 
        
        marginTop={"5%"}
        align={"start"}
        >
          {array.map((ele, index) => {
            return <div key={index}>{ele}</div>;
          })}
        </VStack>
      </Box>
    </>
  );
};

export default MyHabits;
