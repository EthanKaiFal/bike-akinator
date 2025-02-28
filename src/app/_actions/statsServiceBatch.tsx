"use server"
//cookie based client is my repo layer
//this is my service layer
import { cookieBasedClient } from "@/utils/amplify-utils"
import { Bike as BikeType, totalData, brandModelFieldsToUpdate, modelDataWID, brandDataWID } from "@/compon/interfaces";
import { incrementTotalStatsBy, updateBrandModelStatsBy } from "./statsServiceHelpers";


export async function getModelStats(modelName: string, brandName: string) {
    const { data: modelData, errors } = await cookieBasedClient.models.ModelStats.list({
        filter: {
            modelName: { eq: modelName.trim() },
            brandName: { eq: brandName.trim() }
        },
    },
    );
    if (errors) {
        console.log("error getting the brand Stat Data");
    }
    if (modelData.length === 0) {
        console.log("not found Batch");
        return null;
    }
    const { bikeStats, ...filteredModel } = modelData[0];
    console.log(bikeStats);

    return filteredModel as modelDataWID;
}

export async function getBrandStats(brandName: string) {
    //console.log("inside");
    const { data: brandData, errors } = await cookieBasedClient.models.BrandStats.list({
        filter: {
            brandName: { eq: brandName }
        }
    });
    if (errors) {
        console.log("error getting the brand Stat Data");
    }

    if (brandData.length == 0) {
        return null;
    }
    //console.log("success")
    return brandData[0] as brandDataWID;
}

export async function updateModelStats(bikeDatas: BikeType[], increment: number, categoryy: string) {
    // Query for existing model stats
    console.log(bikeDatas[0].model);
    const modelName: string = (bikeDatas[0].model ?? "").toLowerCase();
    const brandName: string = (bikeDatas[0].brand ?? "").toLowerCase();
    const modelData: modelDataWID | null = await getModelStats(modelName, brandName);


    // Create new model entry if the model does not exist
    if (modelData === null) {
        //console.log("in here creating");
        let fieldsToUpdate: brandModelFieldsToUpdate = {
            totalNumBikes: 0,
            numBroken: 0,
            numSold: 0,
            numFirstBike: 0,
            numSecondBike: 0,
            numThirdPlusBike: 0,
            avgOwnership: 0,
            avgSatisScore: 0
        }
        for (let i = 0; i < bikeDatas.length; i++) {
            fieldsToUpdate = await updateBrandModelStatsBy(increment, fieldsToUpdate, bikeDatas[i]);

        }

        const createData = {
            modelName: modelName.trim(),
            brandName: brandName.trim(),
            category: categoryy.toLowerCase(),
            avgSatisScore: fieldsToUpdate.avgSatisScore,
            totalNumBikes: fieldsToUpdate.totalNumBikes,
            numFirstBike: fieldsToUpdate.numFirstBike,
            numSecondBike: fieldsToUpdate.numSecondBike,
            numThirdPlusBike: fieldsToUpdate.numThirdPlusBike,
            numBroken: fieldsToUpdate.numBroken,
            numSold: fieldsToUpdate.numSold,
            avgOwnership: fieldsToUpdate.avgOwnership
        }
        // Save the new model data
        const { data, errors } = await cookieBasedClient.models.ModelStats.create(createData); // Use the model constructor
        //console.log("New model data created successfully");
        if (errors) {
            console.error("Error saving new model data:" + JSON.stringify(errors));
        }
        return data?.id;
    }

}

export async function updateTotalStats(bikes: BikeType[], increment: number) {
    const { data: entries, errors } = await cookieBasedClient.models.TotalStats.list();
    if (errors) {
        console.error("couldnt get total stats");
        return;
    }
    else {
        //console.log("grabbed total stats");
    }
    let pulledStatData: totalData;

    if (entries.length === 0) {
        pulledStatData = {
            totalNumBikes: 0,
            totalNumBroken: 0,
            totalNumSold: 0,
            totalNumFirst: 0,
            totalNumSecond: 0,
            totalNumThird: 0,
            totalAvgOwnership: 0,
            totalAvgSatisScore: 0,
        };
    }
    else {
        pulledStatData = entries[0] as totalData;

    }
    //console.log("updatign with this var" + JSON.stringify(pulledStatData));
    let fieldsToUpdate = {
        totalNumBikes: pulledStatData.totalNumBikes,
        totalNumBroken: pulledStatData.totalNumBroken,
        totalNumSold: pulledStatData.totalNumSold,
        totalNumFirst: pulledStatData.totalNumFirst,
        totalNumSecond: pulledStatData.totalNumSecond,
        totalNumThird: pulledStatData.totalNumThird,
        totalAvgOwnership: pulledStatData.totalAvgOwnership,
        totalAvgSatisScore: pulledStatData.totalAvgSatisScore
    }
    for (let i = 0; i < bikes.length; i++) {
        fieldsToUpdate = await incrementTotalStatsBy(increment, fieldsToUpdate, bikes[i]);
    }


    if (entries.length != 0) {
        //console.log("updating total stats");
        const { errors } = await cookieBasedClient.models.TotalStats.update({
            id: entries[0].id,
            ...fieldsToUpdate,
        })
        if (errors) {
            console.error("error updating totalStat")
        }
        else {
            //console.log("updated data" + JSON.stringify(data));
        }
    }

    //need to create a new entry case
    else {
        //console.log("creating total stats entry" + JSON.stringify(fieldsToUpdate));
        const { errors } = await cookieBasedClient.models.TotalStats.create(
            fieldsToUpdate)
        if (errors) {
            console.error("error creating new totalStat")
        }
    }
}

export async function updateBrandStats(bikes: BikeType[], increment: number, brand: string) {
    //console.log("bike Data");
    const brandData: brandDataWID | null = await getBrandStats((brand ?? "").toLowerCase());
    //console.log("out");
    // Create new brand entry if the brand does not exist
    if (brandData === null) {
        let fieldsToUpdate: brandModelFieldsToUpdate = {
            totalNumBikes: 0,
            numBroken: 0,
            numSold: 0,
            numFirstBike: 0,
            numSecondBike: 0,
            numThirdPlusBike: 0,
            avgOwnership: 0,
            avgSatisScore: 0
        }

        for (let i = 0; i < bikes.length; i++) {
            fieldsToUpdate = await updateBrandModelStatsBy(increment, fieldsToUpdate, bikes[i]);

        }

        const createData = {
            brandName: brand.trim(),
            avgSatisScore: fieldsToUpdate.avgSatisScore,
            totalNumBikes: fieldsToUpdate.totalNumBikes,
            numFirstBike: fieldsToUpdate.numFirstBike,
            numSecondBike: fieldsToUpdate.numSecondBike,
            numThirdPlusBike: fieldsToUpdate.numThirdPlusBike,
            numBroken: fieldsToUpdate.numBroken,
            numSold: fieldsToUpdate.numSold,
            avgOwnership: fieldsToUpdate.avgOwnership
        }

        // Save the new brand data
        //console.log("creating");
        const { errors } = await cookieBasedClient.models.BrandStats.create(createData) // Use the model constructor
        if (errors) {
            console.error("Error saving new brand data:" + errors);
        }
    }
    else {
        // If brand exists, update the existing entry

        let fieldsToUpdate = {
            totalNumBikes: brandData.totalNumBikes,
            numBroken: brandData.numBroken,
            numSold: brandData.numSold,
            numFirstBike: brandData.numFirstBike,
            numSecondBike: brandData.numSecondBike,
            numThirdPlusBike: brandData.numThirdPlusBike,
            avgOwnership: brandData.avgOwnership,
            avgSatisScore: brandData.avgSatisScore
        }

        for (let i = 0; i < bikes.length; i++) {
            fieldsToUpdate = await updateBrandModelStatsBy(increment, fieldsToUpdate, bikes[i]);

        }
        // Now create a copy of the existing entry and save the updated data
        try {
            await cookieBasedClient.models.BrandStats.update({
                id: brandData.id,
                ...fieldsToUpdate,
            });
            //console.log("Brand stats updated successfully");
        } catch (error) {
            console.error("Error updating brand data:", error);
        }
    }
}
