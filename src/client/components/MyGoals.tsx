import { VStack } from "@chakra-ui/react";
import Goal from "./Goal.js";
import { GoalWithDetails } from "../../types/index.js";

export interface MyGoalsProps {
    goals: GoalWithDetails[] | undefined
}

const MyGoals = ({ goals }: MyGoalsProps) => {
    return (
        <VStack
            align="start"
            spacing="10"
            paddingBottom="3rem"
            paddingTop={{
                base: "1.5rem",
                lg: "3rem"
            }}
        >
            {goals && 
                [...goals].sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
                .map(goal => (
                    <Goal
                        key={goal.id}
                        goal={goal}
                    />
                ))
            }
        </VStack>
    )
}

export default MyGoals;