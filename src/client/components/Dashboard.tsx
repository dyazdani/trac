import { Box } from "@chakra-ui/react";
import RightDrawer from "./RightDrawer.js";
import { useGetHabitsByUserQuery } from "../features/api.js";
import { useSelector } from "react-redux";
import { RootState } from "../app/store.js";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  let habits;
  if (user) {
    const { data } = useGetHabitsByUserQuery(user.id);
    habits = data?.habits || [];
  }

  return (
    <Box as="div" h="100vh" w="100vw">
      {habits &&
        habits.map((habit) => (
          <div key={habit.id}>
            <p>{habit.name}</p>
          </div>
        ))}
      <RightDrawer />
    </Box>
  );
};

export default Dashboard;
