import React from 'react';
import {Callout, Flex} from '@radix-ui/themes';
import * as styles from './Notifications.styles';
import {InfoCircledIcon} from '@radix-ui/react-icons';
import {useDarkModeContext} from '../../context/AppDataContext/hooks/useDarkModeContext';
import {Notification} from '../../context/AppDataContext/AppDataContext';

interface NotificationItemProps {
    notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({notification}) => {
    const [isDarkMode] = useDarkModeContext();
    return (
        <Flex direction="row">
            <Callout.Root color={notification.color} role={'status'} className={styles.calloutContainer(notification.color, isDarkMode)}>
                <Callout.Icon>
                    <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text aria-live={'polite'}>{notification.text}</Callout.Text>
            </Callout.Root>
        </Flex>
    );
};
