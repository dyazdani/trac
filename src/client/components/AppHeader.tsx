import React from "react";
import { 
    HStack, 
    Box, 
    Text 
} from "@chakra-ui/react";

type AppHeaderProps = {};

const AppHeader = (props: AppHeaderProps) => {
  return (
    <>
      <Box 
        bg="#b9eefe" 
        w="100%" 
        p={4}
        >
        <HStack>
          <Text fontSize='2xl'>trac</Text>
        </HStack>
      </Box>
    </>
  );
};

export default AppHeader;
