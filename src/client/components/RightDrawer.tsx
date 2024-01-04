import React, { useState } from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button,
    Stack,
    FormLabel,
    Box,
    Input,
    IconButton,
    ButtonGroup,
    Editable,
    EditablePreview,
    EditableInput,
    CheckboxGroup,
    Checkbox,
    FormControl,
    useCheckboxGroup,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuOptionGroup,
    MenuItemOption
  } from '@chakra-ui/react'
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useAppSelector } from '../app/hooks.js'

const RightDrawer = () => {
    const [menuValue, setMenuValue] = useState<string | undefined>()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const inputRef = React.useRef<HTMLInputElement>(null);
    // TODO: use checkboxGroupValue to require at least one checkbox selected before submitting form
    const {value: checkboxGroupValue} = useCheckboxGroup();

    const currentUser = useAppSelector((state) => state.auth.user);

    
    return (
        <>
        {currentUser && 
            <IconButton
                isRound={true}
                variant='solid'
                colorScheme='teal'
                aria-label='Create'
                fontSize='20px'
                icon={<AddIcon />}
                position="fixed"
                bottom="50px"
                right="50px"
                onClick={onOpen}
            />}
            <Drawer 
                placement='right' 
                onClose={onClose} 
                isOpen={isOpen}
                closeOnEsc={false}
                closeOnOverlayClick={false}
                size="sm"
                initialFocusRef={inputRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                <DrawerHeader 
                    borderBottomWidth='1px'
                >
                    Create a Habit
                </DrawerHeader>
                <DrawerBody>
                    <Stack
                        as="form"
                        onSubmit={onClose}
                        id="habitForm"
                        spacing="3vw"
                    >
                        <Box>
                            <FormControl isRequired>
                                <FormLabel
                                    htmlFor="habitName"
                                >
                                    Name
                                </FormLabel>
                                <Editable
                                    defaultValue='New Habit'
                                >
                                    <EditablePreview />
                                    <EditableInput id="habitName" ref={inputRef}/>
                                </Editable>
                            </FormControl>
                            
                        </Box>
                        {/* TODO: Prevent submitting form unless > 0 boxes are checked */}
                        <Box as="fieldset">
                            <FormLabel>Weekly Routine</FormLabel>
                            <CheckboxGroup>
                                <Stack direction='row'>
                                    <Checkbox>M</Checkbox>
                                    <Checkbox>T</Checkbox>
                                    <Checkbox>W</Checkbox>
                                    <Checkbox>Th</Checkbox>
                                    <Checkbox>F</Checkbox>
                                    <Checkbox>Sa</Checkbox>
                                    <Checkbox>Su</Checkbox>
                                </Stack>
                            </CheckboxGroup>
                        </Box>
                        <Box>
                            <FormLabel>Check-In Day</FormLabel>
                            <Menu>
                                <MenuButton 
                                    as={Button} 
                                    rightIcon={<ChevronDownIcon />}
                                    // TODO: figure out a way to make this button text not all caps
                                >{menuValue}</MenuButton>
                                <MenuList>
                                    <MenuOptionGroup type='radio' onChange={
                                        (e) => {
                                            if (typeof e === 'string')
                                            setMenuValue(e)
                                        }}
                                    >
                                        <MenuItemOption value='MONDAY'>Monday</MenuItemOption>
                                        <MenuItemOption value='TUESDAY'>Tuesday</MenuItemOption>
                                        <MenuItemOption value='WEDNESDAY'>Wednesday</MenuItemOption>
                                        <MenuItemOption value='THURSDAY'>Thursday</MenuItemOption>
                                        <MenuItemOption value='FRIDAY'>Friday</MenuItemOption>
                                        <MenuItemOption value='SATURDAY'>Saturday</MenuItemOption>
                                        <MenuItemOption value='SUNDAY'>Sunday</MenuItemOption>
                                    </MenuOptionGroup>
                                </MenuList>
                            </Menu>
                        </Box>
                    </Stack>
                </DrawerBody>
                <DrawerFooter>
                    <ButtonGroup>
                        <Button 
                            variant="outline" 
                            colorScheme='teal' 
                            mr={3} 
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button 
                            mr={3}  
                            colorScheme='teal' 
                            type="submit"
                            form="habitForm"
                        >
                            Create
                        </Button>
                    </ButtonGroup>
                    
                </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default RightDrawer;