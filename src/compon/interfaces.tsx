export interface UserProfile {
  bikes: Bike[]
}

export interface modelStats {
  modelName: string,
  brandName: string,
  avgSatisScore: number,
  totalNumBikes: number,
  numFirstBike: number,
  numSecondBike: number,
  numThirdPlusBike: number,
  numBroken: number,
  numSold: number,
  avgOwnership: number,
}

export interface bikeStats {
  id: string;
  modelName: string | null;
  bikeYear: number | null;
  bikeNum: number | null;
  engineSize: number | null;
  horsePower: number | null;
  torque: number | null;
  engineConfig: string | null;
  modelStatId: string; // Foreign key reference to ModelStats
}


export interface Bike {
  id: string;
  bikeNumber: number | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  sold: boolean | null;
  broken: boolean | null;
  ownershipMonths: number | null;
  score: number | null;
}

export interface brandData {
  brandName: string | null,
  avgSatisScore: number | null,
  totalNumBikes: number | null, // Start counting from 1 for the first entry
  numFirstBike: number | null,
  numSecondBike: number | null,
  numThirdPlusBike: number | null,
  numBroken: number | null, // Initialize based on current bike
  numSold: number | null, // Initialize based on current bike
  avgOwnership: number | null,
}

export interface modelData {
  modelName: string | null,
  brandName: string | null,
  avgSatisScore: number | null,
  totalNumBikes: number | null, // Start counting from 1 for the first entry
  numFirstBike: number | null,
  numSecondBike: number | null,
  numThirdPlusBike: number | null,
  numBroken: number | null, // Initialize based on current bike
  numSold: number | null, // Initialize based on current bike
  avgOwnership: number | null,
}

export interface modelDataWID {
  id: string,
  modelName: string | null,
  brandName: string | null,
  category: string | null,
  avgSatisScore: number | null,
  totalNumBikes: number | null, // Start counting from 1 for the first entry
  numFirstBike: number | null,
  numSecondBike: number | null,
  numThirdPlusBike: number | null,
  numBroken: number | null, // Initialize based on current bike
  numSold: number | null, // Initialize based on current bike
  avgOwnership: number | null,
}

export interface modelDataWBikeStats {
  id: string,
  modelName: string | null,
  brandName: string | null,
  category: string | null,
  avgSatisScore: number | null,
  totalNumBikes: number | null, // Start counting from 1 for the first entry
  numFirstBike: number | null,
  numSecondBike: number | null,
  numThirdPlusBike: number | null,
  numBroken: number | null, // Initialize based on current bike
  numSold: number | null, // Initialize based on current bike
  avgOwnership: number | null,
  bikeStats: bikeStats[];
}

export interface brandDataWID {
  id: string,
  brandName: string | null,
  avgSatisScore: number | null,
  totalNumBikes: number | null, // Start counting from 1 for the first entry
  numFirstBike: number | null,
  numSecondBike: number | null,
  numThirdPlusBike: number | null,
  numBroken: number | null, // Initialize based on current bike
  numSold: number | null, // Initialize based on current bike
  avgOwnership: number | null,
}

export interface bikeData {
  modelName: string | null,
  bikeYear: number | null,
  bikeNum: number | null,
  engineSize: number | null,
  horsePower: number | null,
  torque: number | null,
  engineConfig: string | null,
  modelStatId: string | null,
}

export interface totalData {
  totalAvgSatisScore: number | null,
  totalNumBikes: number | null,
  totalNumFirst: number | null,
  totalNumSecond: number | null,
  totalNumThird: number | null,
  totalNumBroken: number | null,
  totalNumSold: number | null,
  totalAvgOwnership: number | null,
}

export interface totalDataWID {
  id: string,
  totalAvgSatisScore: number | null,
  totalNumBikes: number | null,
  totalNumFirst: number | null,
  totalNumSecond: number | null,
  totalNumThird: number | null,
  totalNumBroken: number | null,
  totalNumSold: number | null,
  totalAvgOwnership: number | null,
}

export interface brandModelFieldsToUpdate {
  totalNumBikes: number | null,
  numBroken: number | null,
  numSold: number | null,
  numFirstBike: number | null,
  numSecondBike: number | null,
  numThirdPlusBike: number | null,
  avgOwnership: number | null,
  avgSatisScore: number | null
}

export interface totalStatsFieldsToUpdate {
  totalNumBikes: number | null,
  totalNumBroken: number | null,
  totalNumSold: number | null,
  totalNumFirst: number | null,
  totalNumSecond: number | null,
  totalNumThird: number | null,
  totalAvgOwnership: number | null,
  totalAvgSatisScore: number | null
}

export interface justId {
  id: string
}

export interface queryData {
  minEngineSize: number,
  maxEngineSize: number,
  categories: string[],
  brands: Set<string>,
  minYear: number,
  maxYear: number,
  minAvgMonths: number,
  maxAvgMonths: number,
}