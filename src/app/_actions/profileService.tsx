"use server"
//cookie based client is my repo layer
//this is my service layer
import { cookieBasedClient } from "@/utils/amplify-utils"
import { Bike as BikeType } from "@/compon/interfaces";

export async function createUserProfile() {
    const { data: users, errors } = await cookieBasedClient.models.User.create({
    });
    if (errors) {
        console.error("Errors occurred while creating user:", errors);
    }
    console.log("creatign user result:" + JSON.stringify(users));

}

export async function getUserBikes() {
    const { data: users } = await cookieBasedClient.models.User.list();
    console.log("Bikes" + users[0].bikes);
    return users[0].bikes as unknown as BikeType[];
}

