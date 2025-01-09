"use server"
//cookie based client is my repo layer
//this is my service layer
import { cookieBasedClient } from "@/utils/amplify-utils"
import {redirect} from 'next/navigation';
import { revalidatePath } from "next/cache";
import { UserProfile, Bike as BikeType, brandData, modelData, bikeData, totalData } from "@/compon/interfaces";

export async function deleteBike(toBeDeleted: any){
    const{data: deletedBike, errors} = await cookieBasedClient.models.Bike.delete(toBeDeleted);
}

export async function createBike(toBeCreated:any){
    const {data, errors} = await cookieBasedClient.models.Bike.create(toBeCreated)
    console.log(errors);
    return data
}

