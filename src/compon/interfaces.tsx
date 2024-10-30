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
  userId: string | null;
}

export interface brandData{
        brandName: string,
        avgSatisScore: number,
        totalNumBikes: number, // Start counting from 1 for the first entry
        numFirstBike: number,
        numSecondBike: number,
        numThirdPlusBike: number,
        numBroken: number, // Initialize based on current bike
        numSold: number, // Initialize based on current bike
        avgOwnership: number,
}

export interface modelData{
  modelName: string,
  brandName: string,
  avgSatisScore: number,
  totalNumBikes: number, // Start counting from 1 for the first entry
  numFirstBike: number,
  numSecondBike: number,
  numThirdPlusBike: number,
  numBroken: number, // Initialize based on current bike
  numSold: number, // Initialize based on current bike
  avgOwnership: number,
}

export interface bikeData{
  modelName: string,
  bikeYear: number,
  bikeNum: number,
}

export interface totalData{
  totalAvgSatisScore: number,
      totalNumBikes: number,
      totalNumFirst: number,
      totalNumSecond: number,
      totalNumThird: number,
      totalNumBroken: number,
      totalNumSold: number,
      totalAvgOwnership: number,
}