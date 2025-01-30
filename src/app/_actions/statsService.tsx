"use server"
//cookie based client is my repo layer
//this is my service layer
import { cookieBasedClient } from "@/utils/amplify-utils"
import { redirect } from 'next/navigation';
import { revalidatePath } from "next/cache";
import { UserProfile, Bike as BikeType, brandData, modelData, bikeData, totalData, brandModelFieldsToUpdate, modelDataWID, brandDataWID } from "@/compon/interfaces";
import { updateBrandModelStatsBy } from "./statsServiceHelpers";

export async function getBrandStats(brandName: string) {
  const { data: brandData, errors } = await cookieBasedClient.models.BrandStats.list({
    filter: {
      brandName: { eq: brandName }
    }
  });
  if (errors) {
    console.log("error getting the brand Stat Data");
  }
  return brandData[0] as brandDataWID;
}

export async function getModelStats(modelName: string) {
  const { data: modelData, errors } = await cookieBasedClient.models.ModelStats.list({
    filter: {
      modelName: { eq: modelName }
    }
  });
  if (errors) {
    console.log("error getting the brand Stat Data");
  }
  return modelData[0] as modelDataWID;
}

export async function getTotalStats() {
  const { data: totalData, errors } = await cookieBasedClient.models.TotalStats.list();
  console.log("total stats" + JSON.stringify(totalData));
  return totalData[0] as totalData;
}

export async function deleteAllStats(bikeData: BikeType) {
  deleteBrandStats(bikeData);
  deleteBikeStats(bikeData);
  deleteModelStats(bikeData);
  deleteTotalStats(bikeData);

}

async function deleteBikeStats(bikeData: BikeType) {
  //pull up the bike stat data we are going to update 

  const { data: bikeStats, errors } = await cookieBasedClient.models.BikeStats.list({
    filter: {
      modelName: { eq: bikeData.model ?? undefined },
      bikeYear: { eq: bikeData.year ?? undefined }
    }
  });
  if (errors) {
    console.error("error fetching bikeStats");
    return;
  }

  //now update the pulled data. Data should be already in the database so we dont need to worry about the case in which no stats are present.
  var pulledBikeStatData = bikeStats[0] as bikeData;
  const fieldsToUpdate = {
    bikeNum: pulledBikeStatData.bikeNum
  }
  //only have to update this field
  fieldsToUpdate.bikeNum = (fieldsToUpdate.bikeNum ?? 0) - 1;
  {
    const { errors } = await cookieBasedClient.models.BikeStats.update(
      {
        id: bikeStats[0].id,
        ...fieldsToUpdate
      }
    );
    if (errors) {
      console.error("error updating the bikeStats");
    }
  }
}

async function deleteBrandStats(bikeData: BikeType) {
  // Query for existing model stats
  var brandData: brandDataWID = await getBrandStats(bikeData.brand ?? "");


  // If model exists, update the existing entry

  const fieldsToUpdate: brandModelFieldsToUpdate = {
    totalNumBikes: brandData.totalNumBikes ?? 0,
    numBroken: brandData.numBroken ?? 0,
    numSold: brandData.numSold ?? 0,
    numFirstBike: brandData.numFirstBike ?? 0,
    numSecondBike: brandData.numSecondBike ?? 0,
    numThirdPlusBike: brandData.numThirdPlusBike ?? 0,
    avgOwnership: brandData.avgOwnership ?? 0,
    avgSatisScore: brandData.avgSatisScore ?? 0
  }

  const updatedFieldsToUpdate = await updateBrandModelStatsBy(-1, fieldsToUpdate, bikeData);

  // Update avgSatisScore and avgOwnership
  const totalBikes = updatedFieldsToUpdate.totalNumBikes ?? 0;

  //new formula for updating avg data post delete from chatGPT

  updatedFieldsToUpdate.avgSatisScore = totalBikes > 0
    ? ((updatedFieldsToUpdate.avgSatisScore ?? 0) * totalBikes - (bikeData.score ?? 0)) / totalBikes
    : 0;

  updatedFieldsToUpdate.avgOwnership = totalBikes > 0
    ? ((updatedFieldsToUpdate.avgOwnership ?? 0) * totalBikes - (bikeData.ownershipMonths ?? 0)) / totalBikes
    : 0;


  // Now create a copy of the existing entry and save the updated data
  try {
    const update = {
      id: brandData.id,
      ...updatedFieldsToUpdate,
    }
    await cookieBasedClient.models.ModelStats.update(update);
    console.log("model stats updated successfully");
  } catch (error) {
    console.error("Error updating brand data:", error);
  }
}

async function deleteModelStats(bikeData: BikeType) {
  // Query for existing model stats
  var modelData: modelDataWID = await getModelStats(bikeData.model ?? "");


  // If model exists, update the existing entry

  const fieldsToUpdate: brandModelFieldsToUpdate = {
    totalNumBikes: modelData.totalNumBikes ?? 0,
    numBroken: modelData.numBroken ?? 0,
    numSold: modelData.numSold ?? 0,
    numFirstBike: modelData.numFirstBike ?? 0,
    numSecondBike: modelData.numSecondBike ?? 0,
    numThirdPlusBike: modelData.numThirdPlusBike ?? 0,
    avgOwnership: modelData.avgOwnership ?? 0,
    avgSatisScore: modelData.avgSatisScore ?? 0
  }

  const updatedFieldsToUpdate = await updateBrandModelStatsBy(-1, fieldsToUpdate, bikeData);

  // Update avgSatisScore and avgOwnership
  const totalBikes = updatedFieldsToUpdate.totalNumBikes ?? 0;
  if (totalBikes == 0) {
    console.error("for some reason we have zero total bikes and we are deleting");
    return;
  }

  //new formula for updating avg data post delete from chatGPT

  updatedFieldsToUpdate.avgSatisScore = totalBikes > 0
    ? ((updatedFieldsToUpdate.avgSatisScore ?? 0) * totalBikes - (bikeData.score ?? 0)) / totalBikes
    : 0;

  updatedFieldsToUpdate.avgOwnership = totalBikes > 0
    ? ((updatedFieldsToUpdate.avgOwnership ?? 0) * totalBikes - (bikeData.ownershipMonths ?? 0)) / totalBikes
    : 0;


  // Now create a copy of the existing entry and save the updated data
  try {
    const update = {
      id: modelData.id,
      ...updatedFieldsToUpdate,
    }
    await cookieBasedClient.models.ModelStats.update(update);
    console.log("model stats updated successfully");
  } catch (error) {
    console.error("Error updating model data:", error);
  }
}

async function deleteTotalStats(bikeData: BikeType) {

}

export async function updateBrandStats(bikeData: BikeType) {
  // Query for existing brand stats
  const { data: brands, errors } = await cookieBasedClient.models.BrandStats.list({
    filter: {
      brandName: { eq: bikeData.brand ?? undefined }
    }
  });

  if (errors) {
    console.error("error fectching brand stats");
  }

  let brandData: brandData;

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
    if (bikeData.bikeNumber === 1) {
      brandData.numFirstBike = (brandData.numFirstBike ?? 0) + 1;
    } else if (bikeData.bikeNumber === 2) {
      brandData.numSecondBike = (brandData.numFirstBike ?? 0) + 1;
    } else if (bikeData.bikeNumber ?? 0 >= 3) {
      brandData.numThirdPlusBike = (brandData.numThirdPlusBike ?? 0) + 1;
    }

    // Save the new brand data
    const { errors } = await cookieBasedClient.models.BrandStats.create(brandData) // Use the model constructor
    console.log("New brand data created successfully");
    if (errors) {
      console.error("Error saving new brand data:" + errors);
    }
  }
  else {
    // If brand exists, update the existing entry
    brandData = brands[0] as brandData;

    const fieldsToUpdate = {
      totalNumBikes: brandData.totalNumBikes,
      numBroken: brandData.numBroken,
      numSold: brandData.numSold,
      numFirstBike: brandData.numFirstBike,
      numSecondBike: brandData.numSecondBike,
      numThirdPlusBike: brandData.numThirdPlusBike,
      avgOwnership: brandData.avgOwnership,
      avgSatisScore: brandData.avgSatisScore
    }

    const updatedFieldsToUpdate = await updateBrandModelStatsBy(+1, fieldsToUpdate, bikeData);

    // Update avgSatisScore and avgOwnership
    const totalBikes = updatedFieldsToUpdate.totalNumBikes ?? 0;
    updatedFieldsToUpdate.avgSatisScore = (((updatedFieldsToUpdate.avgSatisScore ?? 0) * (totalBikes - 1)) + (bikeData.score ?? 0)) / totalBikes;
    updatedFieldsToUpdate.avgOwnership = (((updatedFieldsToUpdate.avgOwnership ?? 0) * (totalBikes - 1)) + (bikeData.ownershipMonths ?? 0)) / totalBikes;

    // Now create a copy of the existing entry and save the updated data
    try {
      await cookieBasedClient.models.BrandStats.update({
        id: brands[0].id,
        ...updatedFieldsToUpdate,
      });
      console.log("Brand stats updated successfully");
    } catch (error) {
      console.error("Error updating brand data:", error);
    }
  }
}


export async function updateModelStats(bikeData: BikeType) {
  // Query for existing model stats
  const { data: models, errors } = await cookieBasedClient.models.ModelStats.list({
    filter: {
      modelName: { eq: bikeData.model ?? undefined }
    }
  });

  if (errors) {
    console.error("error fectching model stats");
  }

  let modelData: modelData;
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

    if (bikeData.bikeNumber === 1) {
      modelData.numFirstBike = (modelData.numFirstBike ?? 0) + 1;
    } else if (bikeData.bikeNumber === 2) {
      modelData.numSecondBike = (modelData.numFirstBike ?? 0) + 1;
    } else if (bikeData.bikeNumber ?? 0 >= 3) {
      modelData.numThirdPlusBike = (modelData.numThirdPlusBike ?? 0) + 1;
    }

    // Save the new model data
    const { errors } = await cookieBasedClient.models.ModelStats.create(modelData) // Use the model constructor
    console.log("New model data created successfully");
    if (errors) {
      console.error("Error saving new model data:" + errors);
    }
  }
  else {
    // If model exists, update the existing entry
    modelData = models[0] as modelData;

    const fieldsToUpdate = {
      totalNumBikes: modelData.totalNumBikes,
      numBroken: modelData.numBroken,
      numSold: modelData.numSold,
      numFirstBike: modelData.numFirstBike,
      numSecondBike: modelData.numSecondBike,
      numThirdPlusBike: modelData.numThirdPlusBike,
      avgOwnership: modelData.avgOwnership,
      avgSatisScore: modelData.avgSatisScore
    }
    const updatedFieldsToUpdate = await updateBrandModelStatsBy(+1, fieldsToUpdate, bikeData);

    // Update avgSatisScore and avgOwnership
    const totalBikes = updatedFieldsToUpdate.totalNumBikes ?? 0;
    updatedFieldsToUpdate.avgSatisScore = (((updatedFieldsToUpdate.avgSatisScore ?? 0) * (totalBikes - 1)) + (bikeData.score ?? 0)) / totalBikes;
    updatedFieldsToUpdate.avgOwnership = (((updatedFieldsToUpdate.avgOwnership ?? 0) * (totalBikes - 1)) + (bikeData.ownershipMonths ?? 0)) / totalBikes;

    // Now create a copy of the existing entry and save the updated data
    try {
      const update = {
        id: models[0].id,
        ...updatedFieldsToUpdate,
      }
      await cookieBasedClient.models.ModelStats.update(update);
      console.log("model stats updated successfully");
    } catch (error) {
      console.error("Error updating model data:", error);
    }
  }
}

export async function updateBikeStats(bikeData: BikeType) {
  const { data: bikeStats, errors } = await cookieBasedClient.models.BikeStats.list({
    filter: {
      modelName: { eq: bikeData.model ?? undefined },
      bikeYear: { eq: bikeData.year ?? undefined }
    }
  });
  if (errors) {
    console.error("error fetching bikeStats");
    return;
  }

  var pulledBikeStatData: bikeData;
  if (bikeStats.length === 0) {
    pulledBikeStatData = {
      modelName: bikeData.model,
      bikeNum: 1,
      bikeYear: bikeData.year
    };

    const { errors } = await cookieBasedClient.models.BikeStats.create(pulledBikeStatData);
    if (errors) {
      console.error("error creating new bike stat");
    }
  }
  else {
    pulledBikeStatData = bikeStats[0] as bikeData;
    const fieldsToUpdate = {
      bikeNum: pulledBikeStatData.bikeNum
    }
    fieldsToUpdate.bikeNum = (fieldsToUpdate.bikeNum ?? 0) + 1;

    const { errors } = await cookieBasedClient.models.BikeStats.update({
      id: bikeStats[0].id,
      ...fieldsToUpdate
    }
    );
    if (errors) {
      console.error("error updating the bikeStats");
    }
  }
}

export async function updateTotalStats(bikeData: BikeType) {
  const { data: entries, errors } = await cookieBasedClient.models.TotalStats.list();
  if (errors) {
    console.error("couldnt get total stats");
    return;
  }
  else {
    console.log("grabbed total stats");
  }
  var pulledStatData: totalData;

  if (entries.length === 0) {
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
  else {
    pulledStatData = entries[0] as totalData;

  }
  console.log("updatign with this var" + JSON.stringify(pulledStatData));
  const fieldsToUpdate = {
    totalNumBikes: pulledStatData.totalNumBikes,
    totalNumBroken: pulledStatData.totalNumBroken,
    totalNumSold: pulledStatData.totalNumSold,
    totalNumFirst: pulledStatData.totalNumFirst,
    totalNumSecond: pulledStatData.totalNumSecond,
    totalNumThird: pulledStatData.totalNumThird,
    totalAvgOwnership: pulledStatData.totalAvgOwnership,
    totalAvgSatisScore: pulledStatData.totalAvgSatisScore
  }
  // Increment totalNumBikes
  fieldsToUpdate.totalNumBikes = (fieldsToUpdate.totalNumBikes ?? 0) + 1;
  console.log("total bikes" + fieldsToUpdate.totalNumBikes);
  if (bikeData.broken) {
    fieldsToUpdate.totalNumBroken = (fieldsToUpdate.totalNumBroken ?? 0) + 1;
  }
  if (bikeData.sold) {
    fieldsToUpdate.totalNumSold = (fieldsToUpdate.totalNumSold ?? 0) + 1;
  }

  if (bikeData.bikeNumber === 1) {
    fieldsToUpdate.totalNumFirst = (fieldsToUpdate.totalNumFirst ?? 0) + 1;
  }
  if (bikeData.bikeNumber === 2) {
    fieldsToUpdate.totalNumSecond = (fieldsToUpdate.totalNumSecond ?? 0) + 1;
  }
  if ((bikeData.bikeNumber ?? 0) >= 3) {
    fieldsToUpdate.totalNumThird = (fieldsToUpdate.totalNumThird ?? 0) + 1;
  }

  const totalBikes = fieldsToUpdate.totalNumBikes;
  fieldsToUpdate.totalAvgSatisScore = (((fieldsToUpdate.totalAvgSatisScore ?? 0) * (totalBikes - 1)) + (bikeData.score ?? 0)) / totalBikes;
  fieldsToUpdate.totalAvgOwnership = (((fieldsToUpdate.totalAvgOwnership ?? 0) * (totalBikes - 1)) + (bikeData.ownershipMonths ?? 0)) / totalBikes;
  if (entries.length != 0) {
    console.log("updating total stats");
    const { data, errors } = await cookieBasedClient.models.TotalStats.update({
      id: entries[0].id,
      ...fieldsToUpdate,
    })
    if (errors) {
      console.error("error updating totalStat")
    }
    else {
      console.log("updated data" + JSON.stringify(data));
    }
  }
  else {
    console.log("creating total stats entry" + JSON.stringify(fieldsToUpdate));
    const { errors } = await cookieBasedClient.models.TotalStats.create(
      fieldsToUpdate)
    if (errors) {
      console.error("error creating new totalStat")
    }
  }
}

