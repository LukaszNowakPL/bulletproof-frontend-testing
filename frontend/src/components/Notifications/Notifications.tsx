import React from 'react';
import * as styles from './Notifications.styles';
import {useNotificationsContext} from '../../context/AppDataContext/hooks/useNotificationsContext';
import {NotificationItem} from './NotificationItem';

export const Notifications: React.FC = () => {
    const [notifications] = useNotificationsContext();
    return (
        <aside className={styles.asideContainer}>
            {notifications.map((notification) => (
                <NotificationItem notification={notification} key={notification.timestamp} />
            ))}
        </aside>
    );
};
