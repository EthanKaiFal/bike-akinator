"use server"

import { Bike as BikeType, brandModelFieldsToUpdate, totalStatsFieldsToUpdate } from "@/compon/interfaces";




export async function updateBrandModelStatsBy(incr: number, fieldsToUpdate: brandModelFieldsToUpdate, bikeData: BikeType) {
    // decrement totalNumBikes
    if ((bikeData.score ?? 0) > 0) {
        fieldsToUpdate.totalNumBikes = (fieldsToUpdate.totalNumBikes ?? 0) + incr;
    }
    //console.log("decrement" + incr);
    //console.log(fieldsToUpdate.totalNumBikes);
    // Increment broken and sold numbers
    if (bikeData.broken) {
        fieldsToUpdate.numBroken = (fieldsToUpdate.numBroken ?? 0) + incr;
    }

    if (bikeData.sold) {
        fieldsToUpdate.numSold = (fieldsToUpdate.numSold ?? 0) + incr;
    }

    // Increment right bike number
    if (bikeData.bikeNumber === 1) {
        fieldsToUpdate.numFirstBike = (fieldsToUpdate.numFirstBike ?? 0) + incr;
    } else if (bikeData.bikeNumber === 2) {
        fieldsToUpdate.numSecondBike = (fieldsToUpdate.numSecondBike ?? 0) + incr;
    } else if (bikeData.bikeNumber ?? 0 >= 3) {
        fieldsToUpdate.numThirdPlusBike = (fieldsToUpdate.numThirdPlusBike ?? 0) + incr;
    }

    const totalBikes = fieldsToUpdate.totalNumBikes ?? 0;
    if (((bikeData.score ?? 0) > 0) && totalBikes > 0) {
        if (incr > 0) {
            // For addition: oldCount is totalBikes before adding the new bike.
            const oldCount = totalBikes - incr;
            fieldsToUpdate.avgSatisScore =
                ((fieldsToUpdate.avgSatisScore ?? 0) * oldCount + (bikeData.score ?? 0)) / totalBikes;
        } else {
            // For removal: oldCount is the count before removal.
            const oldCount = totalBikes - incr; // since incr is negative, this adds back 1.
            fieldsToUpdate.avgSatisScore =
                totalBikes > 0
                    ? (((fieldsToUpdate.avgSatisScore ?? 0) * oldCount) - (bikeData.score ?? 0)) / totalBikes
                    : 0;
        }
    }


    else {
        //fieldsToUpdate.avgSatisScore = 0;
    }

    if ((bikeData.ownershipMonths ?? 0) > 0) {
        // You might also consider a separate counter for bikes that contribute to ownership average.
        // For now, we assume totalNumBikes should include these bikes as well.
        if (incr > 0 && totalBikes > 0) {
            const oldCount = totalBikes - incr;
            fieldsToUpdate.avgOwnership =
                (((fieldsToUpdate.avgOwnership ?? 0) * oldCount) + (bikeData.ownershipMonths ?? 0)) / totalBikes;
        } else if (incr < 0 && totalBikes > 0) {
            const oldCount = totalBikes - incr;
            fieldsToUpdate.avgOwnership =
                (((fieldsToUpdate.avgOwnership ?? 0) * oldCount) - (bikeData.ownershipMonths ?? 0)) / totalBikes;
        }
    } else {
        //fieldsToUpdate.avgOwnership = 0;
    }
    return fieldsToUpdate;
}

export async function incrementTotalStatsBy(incr: number, fieldsToUpdate: totalStatsFieldsToUpdate, bikeData: BikeType) {
    if (((bikeData.score ?? 0) > 0) && ((bikeData.ownershipMonths ?? 0) > 0)) {
        fieldsToUpdate.totalNumBikes = (fieldsToUpdate.totalNumBikes ?? 0) + incr;
    }
    if (bikeData.broken) {
        fieldsToUpdate.totalNumBroken = (fieldsToUpdate.totalNumBroken ?? 0) + incr;
    }
    if (bikeData.sold) {
        fieldsToUpdate.totalNumSold = (fieldsToUpdate.totalNumSold ?? 0) + incr;
    }

    if (bikeData.bikeNumber === 1) {
        fieldsToUpdate.totalNumFirst = (fieldsToUpdate.totalNumFirst ?? 0) + incr;
    }
    if (bikeData.bikeNumber === 2) {
        fieldsToUpdate.totalNumSecond = (fieldsToUpdate.totalNumSecond ?? 0) + incr;
    }
    if ((bikeData.bikeNumber ?? 0) >= 3) {
        fieldsToUpdate.totalNumThird = (fieldsToUpdate.totalNumThird ?? 0) + incr;
    }

    const totalBikes = fieldsToUpdate.totalNumBikes ?? 0;

    if ((incr > 0) && ((bikeData.score ?? 0) > 0)) {
        fieldsToUpdate.totalAvgSatisScore = (((fieldsToUpdate.totalAvgSatisScore ?? 0) * (totalBikes - 1)) + (bikeData.score ?? 0)) / totalBikes;
        if ((incr > 0) && ((bikeData.ownershipMonths ?? 0) > 0)) {
            fieldsToUpdate.totalAvgOwnership = (((fieldsToUpdate.totalAvgOwnership ?? 0) * (totalBikes - 1)) + (bikeData.ownershipMonths ?? 0)) / totalBikes;
        }
    }
    //decrementing case 
    else {
        //new formula for updating avg data post delete from chatGPT

        fieldsToUpdate.totalAvgSatisScore = totalBikes > 0
            ? ((fieldsToUpdate.totalAvgSatisScore ?? 0) * (totalBikes + 1) - (bikeData.score ?? 0)) / totalBikes
            : 0;

        fieldsToUpdate.totalAvgOwnership = totalBikes > 0
            ? ((fieldsToUpdate.totalAvgOwnership ?? 0) * (totalBikes + 1) - (bikeData.ownershipMonths ?? 0)) / totalBikes
            : 0;
    }
    return fieldsToUpdate;
}