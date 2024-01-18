import React, { useState, useRef } from "react";
import {
    NotificationIconButton,
    NotificationFeedPopover,
  } from "@knocklabs/react-notification-feed";

type MessagesMenuProps = {}

const MessagesMenu = (props: MessagesMenuProps) =>  {
    const [isVisible, setIsVisible] = useState(false);
    const notifButtonRef = useRef(null);
    return(
        <>
        <NotificationIconButton
          ref={notifButtonRef}
          onClick={(e) => setIsVisible(!isVisible)}
        />
        <NotificationFeedPopover
          buttonRef={notifButtonRef}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      </>
    );
}

export default MessagesMenu;