import * as Factory from 'factory.ts';
import {AirportDto} from '../../../src/api/rest/airports.dto';
import {faker} from '@faker-js/faker';

/**
 * Factories like this produce default objects made out of random (yet realistic) data sets.
 * Data crucial for the test case should be hardcoded on the case and override the default factory build.
 */
export const airportFactory = Factory.Sync.makeFactory<AirportDto>({
    id: faker.number.int(),
    name: faker.airline.airport().name,
    iata: faker.airline.airport().iataCode,
    country_id: faker.number.int(),
    regions: faker.helpers.multiple(() => faker.number.int(), {count: faker.number.int(5)}),
});
