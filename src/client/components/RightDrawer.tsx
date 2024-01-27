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
    MenuItemOption,
    useToast
  } from '@chakra-ui/react'
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useCreateHabitMutation, useCreateScheduleMutation } from '../features/api.js'
import { useAppSelector } from '../app/hooks.js'
import getBooleanRoutineDays from '../../utils/getBooleanRoutineDays.js'
import { RoutineDaysArrayType } from '../../types/index.js'
import { DayOfTheWeek } from '@prisma/client'
import { DaysOfWeek } from '@knocklabs/node'
import CreateHabitForm from './CreateHabitForm.js'

export interface RightDrawerProps {
    toggleBannerDisplayed: () => void
}

const RightDrawer = ({ toggleBannerDisplayed }: RightDrawerProps) => {
    // TODO: Set this value to upper case when sending it to database
    const { isOpen, onClose, onOpen} = useDisclosure();

    const currentUser = useAppSelector((state) => state.auth.user);

    return (
        <>
        {currentUser && 
            <IconButton
                isRound={true}
                variant='solid'
                colorScheme='teal'
                aria-label='Create Habit'
                fontSize='20px'
                icon={<AddIcon />}
                position="fixed"
                bottom="50px"
                right="50px"
                onClick={onOpen}
            />}
            <CreateHabitForm
                onClose={onClose}
                isOpen={isOpen}
            />
        </>
    )
}

export default RightDrawer;