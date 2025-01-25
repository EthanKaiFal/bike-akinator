"use server"
//cookie based client is my repo layer
//this is my service layer
import { cookieBasedClient } from "@/utils/amplify-utils"
import {redirect} from 'next/navigation';
import { revalidatePath } from "next/cache";
import { UserProfile, Bike as BikeType, brandData, modelData, bikeData, totalData } from "@/compon/interfaces";

export async function createUserProfile(){
    const newUserData = {
        bikesOwned: []
    };
    const {data: users, errors} = await cookieBasedClient.models.User.create({
    });
        if(errors){
            console.error("Errors occurred while creating user:", errors);
        }
        console.log("creatign user result:"+JSON.stringify(users));
        
}

export async function getUserBikes(){
    const { data: users, errors} = await cookieBasedClient.models.User.list();
    console.log("Bikes"+ users[0].bikes);
    return users[0].bikes as unknown as BikeType[];
}

