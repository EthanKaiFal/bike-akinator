"use server"

import { cookieBasedClient } from "@/utils/amplify-utils"
import { redirect } from 'next/navigation';
import { revalidatePath } from "next/cache";
import { UserProfile, Bike as BikeType, brandData, modelData, bikeData, totalData } from "@/compon/interfaces";
import * as postService from './postService';
import * as bikeService from './bikeService';
import * as statsService from './statsService';
import * as profileService from './profileService'

export async function onDeleteBike(idName: string) {
    const toBeDeleted = {
        id: idName
    }
    bikeService.deleteBike(toBeDeleted);
    //get bike data
    const { data: bikeData, errors } = await cookieBasedClient.models.Bike.get(toBeDeleted);
    //then delete stats

    //statsService.deleteAllStats(bikeData as BikeType);

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
    updateAllBikeStats(data);
    redirect("/profile");
}

//UPDATE STATS FUNCTIONS

async function updateAllBikeStats(bikeData: BikeType) {
    //console.log("listing"+ JSON.stringify(bikeData));
    try {
        statsService.updateBrandStats(bikeData);
        statsService.updateModelStats(bikeData);
        statsService.updateBikeStats(bikeData);
        statsService.updateTotalStats(bikeData);
    }
    catch {
        console.error("error updating");
    }
}






export async function getBrandStats(brandName: string) {
    return statsService.getBrandStats(brandName);
}

export async function getModelStats(modelName: string) {
    return statsService.getModelStats(modelName);
}

export async function getTotalStats() {
    return await statsService.getTotalStats();
}