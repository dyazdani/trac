import { VStack } from "@chakra-ui/react";
import Milestone from "./Milestone.js";
import { MilestoneWithDetails } from "../../types/index.js";

export interface MyMilestonesProps {
    milestones: MilestoneWithDetails[] | undefined
}

const MyMilestones = ({ milestones }: MyMilestonesProps) => {
    return (
        <VStack
            paddingY="3rem"
            align="start"
            spacing="20"
        >
            {milestones && 
                [...milestones].sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
                .map(milestone => (
                    <Milestone
                        key={milestone.id}
                        milestone={milestone}
                    />
                ))
            }
        </VStack>
    )
}

export default MyMilestones;