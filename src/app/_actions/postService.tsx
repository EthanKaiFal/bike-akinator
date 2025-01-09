"use server"
//cookie based client is my repo layer
//this is my service layer
import { cookieBasedClient } from "@/utils/amplify-utils"
import {redirect} from 'next/navigation';
import { revalidatePath } from "next/cache";
import { UserProfile, Bike as BikeType, brandData, modelData, bikeData, totalData } from "@/compon/interfaces";

export async function deletePost(toBeDeleted: any){
    const{data: deletedPost, errors} = await cookieBasedClient.models.Post.delete(toBeDeleted);
}

export async function createPost(toBeCreated: any){
    const {data, errors} = await cookieBasedClient.models.Post.create({
        title: toBeCreated
})
console.log(errors);
}