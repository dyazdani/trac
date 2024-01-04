import React from "react";
import todayImg from "../../../images/trac_today_icon.png";
import checkInDayImg from "../../../images/trac_check_in_day_img.png";

import { 
    Heading, 
    Text, 
    Image, 
    HStack 
} from "@chakra-ui/react";

type MyHabitsProps = {};

const MyHabits = (props: MyHabitsProps) => {
  return (
    <>
      <Heading>My Habits</Heading>
      <HStack>

      <HStack>
        <Image src={todayImg} />
        <Text>= today</Text>
      </HStack>
      <HStack>
        <Image src={checkInDayImg} />
        <Text>= check-in day</Text>
      </HStack>
      </HStack>
    </>
  );
};

export default MyHabits;
