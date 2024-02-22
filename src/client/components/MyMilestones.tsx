import { VStack } from "@chakra-ui/react";
import Milestone from "./Milestone.js";
import { MilestoneWithDetails } from "../../types/index.js";

export interface MyMilestonesProps {
    milestones: MilestoneWithDetails[] | undefined
}

const MyMilestones = ({ milestones }: MyMilestonesProps) => {
    return (
        <VStack
            paddingTop="7vh"
            align="start"
            spacing="20"
        >
            {milestones && 
                [...milestones].sort((a, b) =>  
                    a.name.localeCompare(b.name, "en", {ignorePunctuation: true}))
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