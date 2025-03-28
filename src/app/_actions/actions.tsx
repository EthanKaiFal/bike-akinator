"use server"

import { cookieBasedClient } from "@/utils/amplify-utils"
import { redirect } from 'next/navigation';
import { revalidatePath } from "next/cache";
import { Bike as BikeType, justId, modelDataWBikeStats, queryData } from "@/compon/interfaces";
import * as bikeService from './bikeService';
import * as statsService from './statsService';
import * as profileService from './profileService'

export async function onDeleteBike(idName: string) {
    const toBeDeleted: justId = {
        id: idName
    }
    const { data: bikeData, errors } = await cookieBasedClient.models.Bike.get(toBeDeleted);
    bikeService.deleteBike(toBeDeleted);
    //get bike data
    //then delete stats
    if (errors) {
        console.error(errors);
    }
    deleteAllStats(bikeData as BikeType);

    // console.log("data deleted", deletedPost, errors);
    revalidatePath("/profile");
}

export async function checkForProfile() {
    const { data: localProfiles, errors } = await cookieBasedClient.models.User.list();
    if (errors) {
        console.error("error pulling current user profile from non amplify system")
    }
    if (localProfiles.length === 0) {
        //need to create a new profile in the Users model
        profileService.createUserProfile();

    }
    else {
        //it exists in the user model
        //console.log("user profiles" + JSON.stringify(localProfiles[0]));
    }

}

export async function fetchUserbikes() {
    return profileService.getUserBikes();
}

export async function fetchUserId(): Promise<string> {
    const { data: users } = await cookieBasedClient.models.User.list();
    //console.log("Users"+users);
    return users[0].id;
}

export async function createBike(formData: FormData) {
    const data: BikeType = await bikeService.createBike(formData);
    //now i need to update the stats
    updateAllBikeStats(data, "", -1, -1, -1, "");
    redirect("/profile");
}



export async function getBikes(queryData: queryData, categories: string[]) {
    const Models: modelDataWBikeStats[] = await statsService.getModelByBrandCat(queryData.brands, categories);
    console.log("what the" + queryData.brands.size);
    const filteredAvgMonths: modelDataWBikeStats[] = [];
    Models.map((model) => {
        if (((model.avgOwnership ?? -1) < queryData.maxAvgMonths) && ((model.avgOwnership ?? -1) > queryData.minAvgMonths)) {
            filteredAvgMonths.push(model);
        }
    });
    return Models;
}

//UPDATE STATS FUNCTIONS

export async function updateAllBikeStats(bikeData: BikeType, category: string, engineSize: number, horsePower: number, torque: number, engineConfig: string) {
    //console.log("listing"+ JSON.stringify(bikeData));
    let modelId;

    try {
        statsService.updateBrandStats(bikeData, 1);
        modelId = await statsService.updateModelStats(bikeData, 1, category);
        statsService.updateBikeStats(bikeData, 1, (modelId ?? ""), engineSize, horsePower, torque, engineConfig);
        statsService.updateTotalStats(bikeData, 1);
    }
    catch {
        console.error("error updating");
    }
}

async function deleteAllStats(bikeData: BikeType) {
    statsService.updateBrandStats(bikeData, -1);
    statsService.updateModelStats(bikeData, -1, "");
    statsService.updateBikeStats(bikeData, -1, "", -1, -1, -1, "");
    statsService.updateTotalStats(bikeData, -1);

}







export async function getBrandStats(brandName: string) {
    return statsService.getBrandStats(brandName);
}

export async function getModelStats(modelName: string, brandName: string) {
    return statsService.getModelStats(modelName, brandName);
}

export async function getTotalStats() {
    return await statsService.getTotalStats();
}