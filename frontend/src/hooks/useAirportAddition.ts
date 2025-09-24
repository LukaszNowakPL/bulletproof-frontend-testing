import {useMutation, useQueryClient} from '@tanstack/react-query';
import {MUTATIONS, QUERIES} from '../helpers/consts';
import {postAirport} from '../api/rest/airports';
import {AirportModel} from '../api/rest/airports.dto';

export const useAirportAddition = () => {
    const queryClient = useQueryClient();
    const {mutateAsync: addAirport, ...mutation} = useMutation({
        mutationKey: [MUTATIONS.airports],
        mutationFn: async ({data}: {data: AirportModel; onSuccessCallback: () => void; onErrorCallback: () => void}) =>
            await postAirport(data),
        onSuccess: (_, {onSuccessCallback}) => {
            queryClient.invalidateQueries({queryKey: [QUERIES.airports]});
            onSuccessCallback();
        },
        onError: (_, {onErrorCallback}) => {
            onErrorCallback();
        },
    });

    return {...mutation, addAirport};
};
