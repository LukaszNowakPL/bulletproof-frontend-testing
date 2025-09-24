import {Notification} from '../AppDataContext';

export type NotificationActions = ReturnType<typeof setNotification>;

export const notificationTypes = {
    SET_NOTIFICATION: 'SET_NOTIFICATION',
} as const;

export const setNotification = (notification: Notification) => ({
    type: notificationTypes.SET_NOTIFICATION,
    notification,
});
