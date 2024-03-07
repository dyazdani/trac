import React, { useState, useRef } from "react";
import {
    NotificationIconButton,
    NotificationFeedPopover
} from "@knocklabs/react-notification-feed";
import "@knocklabs/react-notification-feed/dist/index.css"
import { Button, ButtonGroup } from "@chakra-ui/react";

type MessagesMenuProps = {}

const MessagesMenu = (props: MessagesMenuProps) =>  {
    const [isVisible, setIsVisible] = useState(false);
    const notifButtonRef = useRef(null);
    return(
        <>
            <ButtonGroup
                isAttached
                variant="unstyled"
                borderRadius=".5rem"
                alignItems="center"
                p=".25vw"
                _hover={{
                    backgroundColor: "turquoise.200"
                }}
                _active={{
                    backgroundColor: "turquoise.300"
                }}
                >
                <Button
                    ref={notifButtonRef}
                    onClick={(e) => setIsVisible(!isVisible)}
                    ml=".5vw"
                >Notifications</Button>
                <NotificationIconButton
                    ref={notifButtonRef}
                    onClick={(e) => setIsVisible(!isVisible)}
                />
            </ButtonGroup>
            
            <NotificationFeedPopover
                buttonRef={notifButtonRef}
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
            />
      </>
    );
}

export default MessagesMenu;