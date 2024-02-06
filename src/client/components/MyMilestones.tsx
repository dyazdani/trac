import { VStack } from "@chakra-ui/react";
import { useAppSelector } from "../app/hooks.js";
import { useGetMilestonesByUserQuery } from "../features/api.js";
import Milestone from "./Milestone.js";

const MyMilestones = () => {
    const currentUser = useAppSelector(state => state.auth.user);

    if (currentUser) {
        const { data } = useGetMilestonesByUserQuery(currentUser.id)
        const milestones = data?.milestones || []

    
        return (
            <VStack
                paddingTop="4rem"
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
}

export default MyMilestones;