import React from 'react';
import {dashboardTestId} from './const';
import {useDarkModeContext} from '../../../../src/context/AppDataContext/hooks/useDarkModeContext';
import {AppDataValues} from '../../../../src/context/AppDataContext/AppDataContext';

/**
 * This component displays only handpicked parts of State management and only if they are defined.
 */
export const AppDataDashboard: React.FC = () => {
    const [isDarkMode] = useDarkModeContext();
    return (
        <>
            <div data-test-id={dashboardTestId}>
                {isDarkMode !== undefined && <p data-test-id={appDataValuesField('isDarkMode')}>{String(isDarkMode)}</p>}
            </div>
        </>
    );
};

function appDataValuesField<TField extends keyof AppDataValues>(field: TField): TField {
    return field;
}
