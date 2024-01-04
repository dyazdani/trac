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
    // TODO: Set this value to upper case when sending it to database
    const [menuValue, setMenuValue] = useState<string | string[]>('Monday')
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
                                >{menuValue}</MenuButton>
                                <MenuList>
                                    <MenuOptionGroup 
                                    type='radio'
                                    value={menuValue}
                                    onChange={
                                        (e) => {
                                            setMenuValue(e)
                                    }}
                                    >
                                        <MenuItemOption value='Monday'>Monday</MenuItemOption>
                                        <MenuItemOption value='Tuesday'>Tuesday</MenuItemOption>
                                        <MenuItemOption value='Wednesday'>Wednesday</MenuItemOption>
                                        <MenuItemOption value='Thursday'>Thursday</MenuItemOption>
                                        <MenuItemOption value='Friday'>Friday</MenuItemOption>
                                        <MenuItemOption value='Saturday'>Saturday</MenuItemOption>
                                        <MenuItemOption value='Sunday'>Sunday</MenuItemOption>
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