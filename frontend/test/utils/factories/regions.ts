import {RegionDto} from '../../../src/api/rest/regions.dto';
import * as Factory from 'factory.ts';
import {faker} from '@faker-js/faker';

export const regionFactory = Factory.Sync.makeFactory<RegionDto>({
    id: faker.number.int(),
    name: faker.location.state(),
});
