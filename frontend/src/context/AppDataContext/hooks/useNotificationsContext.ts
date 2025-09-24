import {AppDataContext} from '../AppDataContext';
import {useCallback, useContext} from 'react';
import {setNotification} from '../actions/NotificationActions';
import {Notification} from '../AppDataContext';

export const useNotificationsContext = () => {
    const [{notifications}, dispatch] = useContext(AppDataContext);

    return [notifications, useCallback((notification: Notification) => dispatch(setNotification(notification)), [dispatch])] as const;
};
