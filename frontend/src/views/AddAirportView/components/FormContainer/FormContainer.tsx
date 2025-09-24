import React from 'react';
import {Form, FormRenderProps} from 'react-final-form';
import {AirportForm} from '../../utils/types';
import {ButtonContainer} from './ButtonContainer';
import {useAirportAddition} from '../../../../hooks/useAirportAddition';
import {mapAirportFormToModel} from '../../utils/mappers';
import {AirportsDto} from '../../../../api/rest/airports.dto';
import {useNotificationsContext} from '../../../../context/AppDataContext/hooks/useNotificationsContext';
import {useNavigate} from 'react-router';

interface FormContainerProps {
    children: React.ReactNode;
    airports: AirportsDto;
}

export const FormContainer: React.FC<FormContainerProps> = ({children, airports}) => {
    const {addAirport} = useAirportAddition();
    const [, setNotification] = useNotificationsContext();
    const navigate = useNavigate();

    const handleSubmit = async (values: AirportForm) => {
        try {
            const onSuccessCallback = () => {
                setNotification({color: 'green', text: 'Airport added successfully'});
                navigate('/airports');
            };
            const onErrorCallback = () => {
                setNotification({color: 'red', text: 'Error while adding an airport'});
            };
            await addAirport({data: mapAirportFormToModel(values), onSuccessCallback, onErrorCallback});
        } catch (error) {
            // Muting errors as they are handled by onErrorCallback
        }
    };

    return (
        <Form
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validate={(values) => validateAirportForm(values, airports)}
            render={({handleSubmit}: FormRenderProps<AirportForm>) => (
                <form onSubmit={handleSubmit}>
                    {children}
                    <ButtonContainer />
                </form>
            )}
        />
    );
};

const initialValues: AirportForm = {
    name: '',
    iata: '',
    countryId: '',
    regions: [],
    regionsFilter: '',
    vaccinationNotes: '',
};

const validateAirportForm = ({name, iata, countryId, regions}: AirportForm, airports: AirportsDto) => {
    return {
        name: validateName(name),
        iata: validateIataCode(iata, airports),
        countryId: validateCountryId(countryId),
        regions: validateRegions(regions),
    };
};

const validateName = (name: AirportForm['name']) => {
    if (name === undefined || name.length === 0) {
        return 'Airport name is required';
    }
};

const validateIataCode = (iata: AirportForm['iata'], airports: AirportsDto) => {
    if (iata === undefined || iata.length === 0) {
        return 'Airport IATA code is required';
    }
    if (iata.length !== 3) {
        return 'IATA code has to be 3 characters';
    }
    if (airports.find(({iata: airportIata}) => airportIata === iata) !== undefined) {
        return 'Airport IATA code has to be unique';
    }
};

const validateCountryId = (countryId: AirportForm['countryId']) => {
    if (countryId === undefined || countryId.length === 0) {
        return 'Country selection is required';
    }
};

const validateRegions = (regions: AirportForm['regions']) => {
    if (regions === undefined || regions.length === 0) {
        return 'At least one region has to be selected';
    }
};
