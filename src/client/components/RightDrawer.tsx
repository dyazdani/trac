import React from 'react'
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
  } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useAppSelector } from '../app/hooks.js'

const RightDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

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
            <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                <DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader>
                <DrawerBody>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default RightDrawer;