// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { UserProfile, Bike, brandStats, makeStats, bikeStats, totalStats } = initSchema(schema);

export {
  UserProfile,
  Bike,
  brandStats,
  makeStats,
  bikeStats,
  totalStats
};