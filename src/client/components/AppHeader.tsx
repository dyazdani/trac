import { useAppDispatch } from "../app/hooks.js";
import { logout } from "../features/authSlice.js";

import { 
    HStack, 
    Box, 
    Text,
    Button,
    Spacer
} from "@chakra-ui/react";

type AppHeaderProps = {
  isBannerDisplayed: boolean | undefined
};

const AppHeader = ({isBannerDisplayed}: AppHeaderProps) => {
  const dispatch = useAppDispatch()

  return (
    <>
      <Box 
        bg="#b9eefe" 
        w="100%" 
        p={4}
        minHeight="70px"
        position={"sticky"}
        top={isBannerDisplayed ? "54px" : "0px"}
        zIndex={100}
        >
        <HStack>
          <Text fontSize='2xl'>trac</Text>
            <Spacer/>
            <Button
                type="button"
                onClick={() => {dispatch(logout())}}
            >
                Logout
            </Button>
        </HStack>
      </Box>
    </>
  );
};

export default AppHeader;
