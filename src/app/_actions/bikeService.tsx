"use server"
//cookie based client is my repo layer
//this is my service layer
import { cookieBasedClient } from "@/utils/amplify-utils"
import { Bike as BikeType, justId } from "@/compon/interfaces";

export async function deleteBike(toBeDeleted: justId) {
    await cookieBasedClient.models.Bike.delete(toBeDeleted);
}

export async function createBike(formData: FormData) {
    const { data: users } = await cookieBasedClient.models.User.list();
    const bikeData = {
        userId: users[0].id,
        bikeNumber: Number(formData.get("bikeNumber")) || 0,
        brand: formData.get("bikeBrand")?.toString().toLowerCase() || "",
        model: formData.get("bikeModel")?.toString().toLowerCase() || "",
        year: Number(formData.get("bikeYear")) || 0,
        sold: (formData.get("bikeSold")?.toString() === "Yes" ? true : false),
        broken: (formData.get("bikeBroken")?.toString() === "Yes" ? true : false),
        ownershipMonths: Number(formData.get("monthsOwned")) || 0,
        score: Number(formData.get("bikeScore")) || 0,
    }
    const { data } = await cookieBasedClient.models.Bike.create(bikeData);
    //console.log("printing"+ JSON.stringify(data));
    //now i need to update the stats
    return data as BikeType;
}

