"use server"

import { UserProfile, Bike as BikeType, brandData, modelData, bikeData, totalData, brandModelFieldsToUpdate } from "@/compon/interfaces";

export function updateBrandModelStatsBy(num: number, fieldsToUpdate: brandModelFieldsToUpdate, bikeData: BikeType) {
    // decrement totalNumBikes
    fieldsToUpdate.totalNumBikes = (fieldsToUpdate.totalNumBikes ?? 0) + num;

    // Increment broken and sold numbers
    if (bikeData.broken) {
        fieldsToUpdate.numBroken = (fieldsToUpdate.numBroken ?? 0) + num;
    }

    if (bikeData.sold) {
        fieldsToUpdate.numSold = (fieldsToUpdate.numSold ?? 0) + num;
    }

    // Increment right bike number
    if (bikeData.bikeNumber === 1) {
        fieldsToUpdate.numFirstBike = (fieldsToUpdate.numFirstBike ?? 0) + num;
    } else if (bikeData.bikeNumber === 2) {
        fieldsToUpdate.numSecondBike = (fieldsToUpdate.numFirstBike ?? 0) + num;
    } else if (bikeData.bikeNumber ?? 0 >= 3) {
        fieldsToUpdate.numThirdPlusBike = (fieldsToUpdate.numThirdPlusBike ?? 0) + num;
    }

    return fieldsToUpdate;
}