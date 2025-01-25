"use server"
//cookie based client is my repo layer
//this is my service layer
import { cookieBasedClient } from "@/utils/amplify-utils"
import {redirect} from 'next/navigation';
import { revalidatePath } from "next/cache";
import { UserProfile, Bike as BikeType, brandData, modelData, bikeData, totalData } from "@/compon/interfaces";

export async function getBrandStats(brandName: string){
    const{data: brandData, errors} = await cookieBasedClient.models.BrandStats.list({
      filter:{
        brandName: {eq: brandName}
      }
    });
    if(errors){
      console.log("error getting the brand Stat Data");
    }
    return brandData[0] as brandData;
  }
  
  export async function getModelStats(modelName: string){
    const{data: modelData, errors} = await cookieBasedClient.models.ModelStats.list({
      filter:{
        modelName: {eq: modelName}
      }
    });
    if(errors){
      console.log("error getting the brand Stat Data");
    }
    return modelData[0] as modelData;
  }
  
  export async function getTotalStats(){
    const{data: totalData, errors} = await cookieBasedClient.models.TotalStats.list({
    });
    console.log("total stats" + JSON.stringify(totalData));
    return totalData[0] as totalData;
  }

export async function updateBrandStats(bikeData: BikeType) {
    // Query for existing brand stats
    const {data: brands, errors} = await cookieBasedClient.models.BrandStats.list({
        filter: {
            brandName: {eq: bikeData.brand?? undefined}
        }
    });

    if(errors){
        console.error("error fectching brand stats");
    }
    
    let brandData :brandData;
    
    // Create new brand entry if the brand does not exist
    if (brands.length === 0) {
      brandData = {
        brandName: bikeData.brand,
        avgSatisScore: bikeData.score,
        totalNumBikes: 1, // Start counting from 1 for the first entry
        numFirstBike: 0,
        numSecondBike: 0,
        numThirdPlusBike: 0,
        numBroken: bikeData.broken ? 1 : 0, // Initialize based on current bike
        numSold: bikeData.sold ? 1 : 0, // Initialize based on current bike
        avgOwnership: bikeData.ownershipMonths,
      };
      
      // Save the new brand data
        const {errors} = await cookieBasedClient.models.BrandStats.create(brandData) // Use the model constructor
        console.log("New brand data created successfully");
        if(errors){
        console.error("Error saving new brand data:"+errors);
        }
    } 
    else {
      // If brand exists, update the existing entry
      brandData = brands[0] as brandData;
  
      // Increment totalNumBikes
      brandData.totalNumBikes = (brandData.totalNumBikes ?? 0) + 1;
  
      // Update avgSatisScore and avgOwnership
      const totalBikes = brandData.totalNumBikes;
        brandData.avgSatisScore = (((brandData.avgSatisScore??0) * (totalBikes - 1)) + (bikeData.score??0)) / totalBikes;
        brandData.avgOwnership = (((brandData.avgOwnership??0) * (totalBikes - 1)) + (bikeData.ownershipMonths??0)) / totalBikes;
  
      // Increment broken and sold numbers
      if (bikeData.broken) {
        if (bikeData.broken) {
            brandData.numBroken = (brandData.numBroken ?? 0) + 1;
        }
        
      }
      if (bikeData.sold) {
        brandData.numSold = (brandData.numSold ?? 0) + 1;
      }
  
      // Increment right bike number
      if (bikeData.bikeNumber === 1) {
        brandData.numFirstBike =(brandData.numFirstBike??0) + 1;
      } else if (bikeData.bikeNumber === 2) {
        brandData.numSecondBike =(brandData.numFirstBike??0) + 1;
      } else if (bikeData.bikeNumber??0 >= 3) {
        brandData.numThirdPlusBike =(brandData.numThirdPlusBike??0) + 1;
      }
  
      // Now create a copy of the existing entry and save the updated data
      try {
        await cookieBasedClient.models.BrandStats.update({
            id: brands[0].id,
            ...brandData,
        });
        console.log("Brand stats updated successfully");
      } catch (error) {
        console.error("Error updating brand data:", error);
      }
    }
  }


export async function updateModelStats(bikeData: BikeType) {
    // Query for existing model stats
    const {data: models, errors} = await cookieBasedClient.models.ModelStats.list({
        filter: {
            modelName: {eq: bikeData.model?? undefined}
        }
    });

    if(errors){
        console.error("error fectching model stats");
    }
    
    let modelData :modelData;
    
    // Create new model entry if the model does not exist
    if (models.length === 0) {
      modelData = {
        brandName: bikeData.brand,
        modelName: bikeData.model,
        avgSatisScore: bikeData.score,
        totalNumBikes: 1, // Start counting from 1 for the first entry
        numFirstBike: 0,
        numSecondBike: 0,
        numThirdPlusBike: 0,
        numBroken: bikeData.broken ? 1 : 0, // Initialize based on current bike
        numSold: bikeData.sold ? 1 : 0, // Initialize based on current bike
        avgOwnership: bikeData.ownershipMonths,
      };
      
      // Save the new model data
        const {errors} = await cookieBasedClient.models.ModelStats.create(modelData) // Use the model constructor
        console.log("New model data created successfully");
        if(errors){
        console.error("Error saving new model data:"+errors);
        }
    } 
    else {
      // If model exists, update the existing entry
      modelData = models[0] as modelData;
  
      // Increment totalNumBikes
      modelData.totalNumBikes = (modelData.totalNumBikes ?? 0) + 1;
  
      // Update avgSatisScore and avgOwnership
      const totalBikes = modelData.totalNumBikes;
        modelData.avgSatisScore = (((modelData.avgSatisScore??0) * (totalBikes - 1)) + (bikeData.score??0)) / totalBikes;
        modelData.avgOwnership = (((modelData.avgOwnership??0) * (totalBikes - 1)) + (bikeData.ownershipMonths??0)) / totalBikes;
  
      // Increment broken and sold numbers
        if (bikeData.broken) {
            modelData.numBroken = (modelData.numBroken ?? 0) + 1;
        }
        
      if (bikeData.sold) {
        modelData.numSold = (modelData.numSold ?? 0) + 1;
      }
  
      // Increment right bike number
      if (bikeData.bikeNumber === 1) {
        modelData.numFirstBike =(modelData.numFirstBike??0) + 1;
      } else if (bikeData.bikeNumber === 2) {
        modelData.numSecondBike =(modelData.numFirstBike??0) + 1;
      } else if (bikeData.bikeNumber??0 >= 3) {
        modelData.numThirdPlusBike =(modelData.numThirdPlusBike??0) + 1;
      }
  
      // Now create a copy of the existing entry and save the updated data
      try {
        await cookieBasedClient.models.ModelStats.update({
            id: models[0].id,
            ...modelData,
        });
        console.log("model stats updated successfully");
      } catch (error) {
        console.error("Error updating model data:", error);
      }
    }
  }

export async function updateBikeStats(bikeData: BikeType) {
    const {data: bikeStats, errors} = await cookieBasedClient.models.BikeStats.list({
        filter: {
            modelName: {eq: bikeData.model?? undefined},
            bikeYear: {eq: bikeData.year??undefined}
        }
    });
    if(errors){
        console.error("error fetching bikeStats");
        return;
    }

    var pulledBikeStatData : bikeData;
    if(bikeStats.length===0){
        pulledBikeStatData = {
            modelName: bikeData.model,
            bikeNum: 1,
            bikeYear: bikeData.year
        };

        const {errors} = await cookieBasedClient.models.BikeStats.create(pulledBikeStatData);
        if(errors){
            console.error("error creating new bike stat");
        }
    }
    else{
        pulledBikeStatData = bikeStats[0] as bikeData;
        pulledBikeStatData.bikeNum = (pulledBikeStatData.bikeNum??0)+1;

        const {errors} = await cookieBasedClient.models.BikeStats.update({
            id: bikeStats[0].id,
            ...pulledBikeStatData
        }
        );
        if(errors){
            console.error("error updating the bikeStats");
        }
    }
  }

export async function updateTotalStats(bikeData:BikeType){
    const {data: entries, errors} = await cookieBasedClient.models.TotalStats.list();
    if(errors){
        console.error("couldnt get total stats");
        return;
    }
    var pulledStatData: totalData;

    if(entries.length===0){
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
    else{
        pulledStatData = entries[0] as totalData;

    }

    // Increment totalNumBikes
    pulledStatData.totalNumBikes = pulledStatData.totalNumBikes??0 +1;
    if(bikeData.broken){
    pulledStatData.totalNumBroken = pulledStatData.totalNumBroken??0 +1;
    }
    if(bikeData.sold){
    pulledStatData.totalNumSold = pulledStatData.totalNumSold??0 +1;
    }

    if(bikeData.bikeNumber === 1){
    pulledStatData.totalNumFirst = pulledStatData.totalNumFirst??0 +1;
    }
    if(bikeData.bikeNumber === 2){
    pulledStatData.totalNumSecond = pulledStatData.totalNumSecond??0 +1;
    }
    if((bikeData.bikeNumber??0) >= 3){
    pulledStatData.totalNumThird = pulledStatData.totalNumThird??0 +1;
    }

    const totalBikes = pulledStatData.totalNumBikes;
        pulledStatData.totalAvgSatisScore = ((pulledStatData.totalAvgSatisScore??0 * (totalBikes - 1)) + (bikeData.score??0)) / totalBikes;
        pulledStatData.totalAvgOwnership = ((pulledStatData.totalAvgOwnership??0 * (totalBikes - 1)) + (bikeData.ownershipMonths??0)) / totalBikes;
    if(entries.length!=0){
        const {errors} = await cookieBasedClient.models.TotalStats.update({
        id: entries[0].id,
        ...pulledStatData,
    })
    if(errors){
        console.error("error updating totalStat")
    }
}
else{
    const {errors} = await cookieBasedClient.models.TotalStats.create(
        pulledStatData)
        if(errors){
            console.error("error creating new totalStat")
        }
}
}