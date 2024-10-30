"use server"

import { cookieBasedClient } from "@/utils/amplify-utils"
import {redirect} from 'next/navigation';
import { revalidatePath } from "next/cache";
import { UserProfile, Bike as BikeType } from "@/compon/interfaces";

export async function createPost(formData: FormData) {
    const {data, errors} = await cookieBasedClient.models.Post.create({
        title: formData.get("title")?.toString() || ""
})
    console.log(formData.get("title"));
    console.log(errors);
    redirect("/");
}

export async function onDeletePost(idName: string) {
    const toBeDeleted = {
        id: idName
    }
    const{data: deletedPost, errors} = await cookieBasedClient.models.Post.delete(toBeDeleted);

   // console.log("data deleted", deletedPost, errors);
    revalidatePath("/");
}

export async function onDeleteBike(idName: string) {
    const toBeDeleted = {
        id: idName
    }
    const{data: deletedBike, errors} = await cookieBasedClient.models.Bike.delete(toBeDeleted);

   // console.log("data deleted", deletedPost, errors);
    revalidatePath("/profile");
}

export async function checkForProfile() {
    const { data: localProfiles, errors} = await cookieBasedClient.models.User.list();
    if(errors){
        console.error("error pulling current user profile from non amplify system")
    }
    if(localProfiles.length===0){
        //need to create a new profile in the Users model
        createUserProfile();
    
    }
    else{
        //it exists in the user model
        console.log("user profiles" + JSON.stringify(localProfiles[0]));
    }

}
async function createUserProfile(){
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

export async function fetchUserbikes(){
    const { data: users, errors} = await cookieBasedClient.models.User.list();
    console.log("Bikes"+ users[0].bikes);
    return users[0].bikes as unknown as BikeType[];
}

export async function fetchUserId(): Promise<string>{
    const { data: users} = await cookieBasedClient.models.User.list();
    return users[0].id;
}

export async function createBike(formData: FormData) {
    const {data, errors} = await cookieBasedClient.models.Bike.create({
        bikeNumber: Number(formData.get("bikeNumber")) || 0,
        brand: formData.get("bikebrand")?.toString() || "",
        model: formData.get("bikeModel")?.toString() || "",
        year: Number(formData.get("bikeYear")) || 0,
        sold: formData.get("title")?.toString() || "",
        broken: formData.get("title")?.toString() || "",
        ownershipMonths: Number(formData.get("monthsOwned"))|| 0,
        score: Number(formData.get("bikeScore")) || 0,
})
    console.log(errors);
    redirect("/profile");
}
