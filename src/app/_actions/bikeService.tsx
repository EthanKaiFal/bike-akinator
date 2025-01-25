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

export async function createBike(formData: FormData){
    const {data: users} = await cookieBasedClient.models.User.list();
        const bikeData = {
            userId: users[0].id,
            bikeNumber: Number(formData.get("bikeNumber")) || 0,
            brand: formData.get("bikeBrand")?.toString() || "",
            model: formData.get("bikeModel")?.toString() || "",
            year: Number(formData.get("bikeYear")) || 0,
            sold: (formData.get("bikeSold")?.toString()==="Yes"? true : false ),
            broken: (formData.get("bikeBroken")?.toString()==="Yes"? true : false ),
            ownershipMonths: Number(formData.get("monthsOwned"))|| 0,
            score: Number(formData.get("bikeScore")) || 0,
    }
        const {data, errors} = await cookieBasedClient.models.Bike.create(bikeData);
        //console.log("printing"+ JSON.stringify(data));
        //now i need to update the stats
    return data as BikeType;
}

