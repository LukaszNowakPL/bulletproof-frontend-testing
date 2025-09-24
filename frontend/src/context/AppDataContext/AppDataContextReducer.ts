import {Draft, produce} from 'immer';
import {AppDataValues} from './AppDataContext';
import {AppDataActions} from './actions/AppDataContextActions';

export const AppDataContextReducer = produce((draft: Draft<AppDataValues>, action: AppDataActions): void => {
    switch (action.type) {
        case 'SET_IS_DARK_MODE':
            draft.isDarkMode = action.isDarkMode;
            break;
        case 'SET_NOTIFICATION':
            draft.notifications = [...draft.notifications, {...action.notification, timestamp: new Date().getMilliseconds()}];
            break;
        default:
            throw new Error('Unsupported action type');
    }
});
