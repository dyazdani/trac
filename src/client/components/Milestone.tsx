import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { 
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Card, 
    CardBody, 
    CardFooter, 
    CardHeader, 
    Flex, 
    HStack, 
    Heading, 
    IconButton
} from "@chakra-ui/react";
import HabitCard from "./HabitCard.js";
import { DayOfTheWeek } from "@prisma/client";

// TODO: This variable will be deleted once the milestones are mapped and passed milestone as prop
const milestone = {
    id: 1,
    name: "Know kung fu",
    habits: [
        {
            id: 1,
            name: "Habit One",
            dateCreated: new Date(),
            dateUpdated: new Date(),
            datesCompleted: [],
            ownerId: 5,
            routine: {
                id: 1,
                dateCreated: new Date(),
                dateUpdated: new Date(),
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
                habitId: 1
            },
            checkIn: {
                id: 1,
                dayOfTheWeek: DayOfTheWeek["SATURDAY"],
                habitId: 1
            },
            statusReports: [],
            scheduleId: null,
            milestoneId: 1
        },
        {
            id: 2,
            name: "Habit Two",
            dateCreated: new Date(),
            dateUpdated: new Date(),
            datesCompleted: [new Date()],
            ownerId: 5,
            routine: {
                id: 1,
                dateCreated: new Date(),
                dateUpdated: new Date(),
                monday: true,
                tuesday: false,
                wednesday: true,
                thursday: false,
                friday: true,
                saturday: false,
                sunday: false,
                habitId: 2
            },
            checkIn: {
                id: 2,
                dayOfTheWeek: DayOfTheWeek["MONDAY"],
                habitId: 2
            },
            statusReports: [],
            scheduleId: null,
            milestoneId: 1
        }
    ]
}

const Milestone = () => {

    return (
        <Card
        // as={motion.div}
        // animation={!isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? animation : ""}
        w="30vw" 
        maxW="500px"
        minW="320px"
        bg="pink"
        borderRadius="20px"
        // border={!isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? "2mm ridge rgba(255,215,0, .6)" : ""}
        // backgroundSize={!isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? "300%" : ""}
        // sx={!isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? 
        //   {backgroundPositionX: '100%'} : 
        //   {}
        // }
      >
        <CardHeader>
          <HStack justify={"end"}>
            <Heading 
                sx={{ marginRight: "auto" }} 
                size="md"
            >
             {milestone.name}
            </Heading>
            <IconButton 
                aria-label="update-milestone-button" 
                icon={<EditIcon />} 
                variant="unstyled"
            />
            <IconButton 
                aria-label="delete-milestone-button" 
                icon={<DeleteIcon />} 
                variant="unstyled"
            />
          </HStack>
        </CardHeader>
        <Flex 
            direction={"column"} 
            align={"center"}
            >
          <CardBody>
          <Accordion defaultIndex={[0]} allowMultiple>
            {/* TODO: Map accordion items to milestone.habits array */}
            {milestone.habits.map(habit => {
                return (
                    <AccordionItem
                        key={habit.id}
                        w="450px"
                    >
                        {({ isExpanded }) => (
                            <>
                                <h2>
                                <AccordionButton>
                                    <Box as="span" flex='1' textAlign='left'>
                                        {isExpanded ? "" : habit.name}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <HabitCard 
                                        habit={habit}
                                        handleClick={() => {console.log(habit)}}
                                    />
                                </AccordionPanel>
                            </>

                        )}
                        
            </AccordionItem>
                )
            })}     
        </Accordion>
          </CardBody>
          <CardFooter>
            
          </CardFooter>
          
        </Flex>
      </Card>
    )
}

export default Milestone;