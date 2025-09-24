import React, {Dispatch, useReducer} from 'react';
import {AppDataContextReducer} from './AppDataContextReducer';
import {AppDataActions} from './actions/AppDataContextActions';

export interface Notification {
    color: 'green' | 'red';
    text: string;
}
export type NotificationContext = Notification & {
    timestamp: number;
};

export interface AppDataValues {
    isDarkMode: boolean;
    notifications: NotificationContext[];
}

export const initialValues: AppDataValues = {
    isDarkMode: false,
    notifications: [],
};

const initialDispatch = () => {};

type AppDataContextValues = [AppDataValues, Dispatch<AppDataActions>];

export const AppDataContext = React.createContext<AppDataContextValues>([initialValues, initialDispatch]);

interface AppDataProviderProps {
    children: React.ReactNode;
    appData?: AppDataValues;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({children, appData = initialValues}) => {
    return <AppDataContext.Provider value={useReducer(AppDataContextReducer, appData)}>{children}</AppDataContext.Provider>;
};
