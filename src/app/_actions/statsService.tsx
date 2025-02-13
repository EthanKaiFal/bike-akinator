"use server"
//cookie based client is my repo layer
//this is my service layer
import { cookieBasedClient } from "@/utils/amplify-utils"
import { Bike as BikeType, bikeData, totalData, brandModelFieldsToUpdate, modelDataWID, brandDataWID, totalDataWID } from "@/compon/interfaces";
import { incrementTotalStatsBy, updateBrandModelStatsBy } from "./statsServiceHelpers";

export async function getBrandStats(brandName: string) {
  //console.log("inside");
  const { data: brandData, errors } = await cookieBasedClient.models.BrandStats.list({
    filter: {
      brandName: { eq: brandName }
    }
  });
  if (errors) {
    console.log("error getting the brand Stat Data");
  }

  if (brandData.length == 0) {
    return null;
  }
  //console.log("success")
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

  if (modelData.length == 0) {
    return null;
  }
  const { bikeStats, ...filteredModel } = modelData[0];
  console.log(bikeStats);
  return filteredModel as modelDataWID;
}

export async function getStats(): Promise<modelDataWID> {
  const { data: modelData, errors } = await cookieBasedClient.models.ModelStats.get({
    id: 'f1812211-ae9b-4dae-adbb-04fecf1445eb'
  });
  if (errors) {
    console.log("error getting the brand Stat Data" + JSON.stringify(errors));
  }
  const { bikeStats, ...filteredData } = { ...modelData };
  console.log("hello" + JSON.stringify(modelData));
  return filteredData as modelDataWID;
}

export async function getAllModelStats(pattern: string) {
  const { data: modelData, errors } = await cookieBasedClient.models.ModelStats.list({
    filter: {
      brandName: {
        contains: pattern.toLowerCase().trim(),
      }
    }
  });

  if (!modelData || modelData.length == 0) {
    console.log("null?")
    return null;
  }

  const filteredData: modelDataWID[] = modelData.map(({ bikeStats, ...model }) => {
    console.log("Filtered out bikeStats:", bikeStats); // Prevents unused variable error
    return model;
  });
  return filteredData;
}


export async function getTotalStats() {
  const { data: totalData } = await cookieBasedClient.models.TotalStats.list();
  //console.log("total stats" + JSON.stringify(totalData));
  return totalData[0] as totalDataWID;
}



export async function updateBrandStats(bikeData: BikeType, increment: number) {
  //console.log("bike Data");
  const brandData: brandDataWID | null = await getBrandStats((bikeData.brand ?? "").toLowerCase());
  //console.log("out");
  // Create new brand entry if the brand does not exist
  if (brandData === null) {
    const createData = {
      brandName: (bikeData.brand ?? "").toLowerCase(),
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
      createData.numFirstBike = (createData.numFirstBike ?? 0) + 1;
    } else if (bikeData.bikeNumber === 2) {
      createData.numSecondBike = (createData.numSecondBike ?? 0) + 1;
    } else if (bikeData.bikeNumber ?? 0 >= 3) {
      createData.numThirdPlusBike = (createData.numThirdPlusBike ?? 0) + 1;
    }

    // Save the new brand data
    //console.log("creating");
    const { errors } = await cookieBasedClient.models.BrandStats.create(createData) // Use the model constructor
    if (errors) {
      console.error("Error saving new brand data:" + errors);
    }
  }
  else {
    // If brand exists, update the existing entry

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

    const updatedFieldsToUpdate = await updateBrandModelStatsBy(increment, fieldsToUpdate, bikeData);
    // Now create a copy of the existing entry and save the updated data
    try {
      await cookieBasedClient.models.BrandStats.update({
        id: brandData.id,
        ...updatedFieldsToUpdate,
      });
      //console.log("Brand stats updated successfully");
    } catch (error) {
      console.error("Error updating brand data:", error);
    }
  }
}


export async function updateModelStats(bikeData: BikeType, increment: number, categoryy: string) {
  // Query for existing model stats
  const modelData: modelDataWID | null = await getModelStats((bikeData.model ?? "").toLowerCase());


  // Create new model entry if the model does not exist
  if (modelData === null) {
    let fieldsToUpdate: brandModelFieldsToUpdate = {
      totalNumBikes: 0,
      numBroken: 0,
      numSold: 0,
      numFirstBike: 0,
      numSecondBike: 0,
      numThirdPlusBike: 0,
      avgOwnership: 0,
      avgSatisScore: 0
    }

    fieldsToUpdate = await updateBrandModelStatsBy(increment, fieldsToUpdate, bikeData);

    const createData = {
      modelName: bikeData.model?.toLowerCase(),
      brandName: bikeData.brand?.toLowerCase(),
      category: categoryy.toLowerCase(),
      avgSatisScore: fieldsToUpdate.avgSatisScore,
      totalNumBikes: fieldsToUpdate.totalNumBikes,
      numFirstBike: fieldsToUpdate.numFirstBike,
      numSecondBike: fieldsToUpdate.numSecondBike,
      numThirdPlusBike: fieldsToUpdate.numThirdPlusBike,
      numBroken: fieldsToUpdate.numBroken,
      numSold: fieldsToUpdate.numSold,
      avgOwnership: fieldsToUpdate.avgOwnership
    }
    // Save the new model data
    const { data, errors } = await cookieBasedClient.models.ModelStats.create(createData); // Use the model constructor
    //console.log("New model data created successfully");
    if (errors) {
      console.error("Error saving new model data:" + JSON.stringify(errors));
    }
    return data?.id;
  }
  else {
    // If model exists, update the existing entry
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
    const updatedFieldsToUpdate = await updateBrandModelStatsBy(increment, fieldsToUpdate, bikeData);
    // Now create a copy of the existing entry and save the updated data
    try {
      const update = {
        id: modelData.id,
        ...updatedFieldsToUpdate,
      }
      await cookieBasedClient.models.ModelStats.update(update);
      //console.log("model stats updated successfully");
      return modelData.id;
    } catch (error) {
      console.error("Error updating model data:", error);
    }
  }
}

export async function updateBikeStats(bikeData: BikeType, increment: number, modelId: string, engineSize: number, horsePower: number, torque: number, engineConfig: string) {
  const { data: bikeStats, errors } = await cookieBasedClient.models.BikeStats.list({
    filter: {
      modelName: { eq: (bikeData.model ?? "").toLowerCase() },
      bikeYear: { eq: bikeData.year ?? 0 }
    }
  });
  if (errors) {
    console.error("error fetching bikeStats");
    return;
  }

  let pulledBikeStatData: bikeData;
  if (bikeStats.length === 0) {
    pulledBikeStatData = {
      modelName: (bikeData.model ?? "").toLowerCase(),
      bikeNum: 1,
      bikeYear: bikeData.year,
      engineSize: engineSize,
      horsePower: horsePower,
      torque: torque,
      engineConfig: engineConfig,
      modelStatId: modelId

    };

    const { errors } = await cookieBasedClient.models.BikeStats.create(pulledBikeStatData);
    if (errors) {
      console.error("error creating new bike stat:" + JSON.stringify(errors));
      //console.log("torque:" + torque);
      console.log("engineSize" + engineSize);
    }
  }
  else {
    pulledBikeStatData = bikeStats[0] as bikeData;
    const fieldsToUpdate = {
      bikeNum: pulledBikeStatData.bikeNum
    }
    fieldsToUpdate.bikeNum = (fieldsToUpdate.bikeNum ?? 0) + increment;

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

export async function updateTotalStats(bikeData: BikeType, increment: number) {
  const { data: entries, errors } = await cookieBasedClient.models.TotalStats.list();
  if (errors) {
    console.error("couldnt get total stats");
    return;
  }
  else {
    //console.log("grabbed total stats");
  }
  let pulledStatData: totalData;

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
  //console.log("updatign with this var" + JSON.stringify(pulledStatData));
  let fieldsToUpdate = {
    totalNumBikes: pulledStatData.totalNumBikes,
    totalNumBroken: pulledStatData.totalNumBroken,
    totalNumSold: pulledStatData.totalNumSold,
    totalNumFirst: pulledStatData.totalNumFirst,
    totalNumSecond: pulledStatData.totalNumSecond,
    totalNumThird: pulledStatData.totalNumThird,
    totalAvgOwnership: pulledStatData.totalAvgOwnership,
    totalAvgSatisScore: pulledStatData.totalAvgSatisScore
  }

  fieldsToUpdate = await incrementTotalStatsBy(increment, fieldsToUpdate, bikeData);


  if (entries.length != 0) {
    //console.log("updating total stats");
    const { errors } = await cookieBasedClient.models.TotalStats.update({
      id: entries[0].id,
      ...fieldsToUpdate,
    })
    if (errors) {
      console.error("error updating totalStat")
    }
    else {
      //console.log("updated data" + JSON.stringify(data));
    }
  }

  //need to create a new entry case
  else {
    //console.log("creating total stats entry" + JSON.stringify(fieldsToUpdate));
    const { errors } = await cookieBasedClient.models.TotalStats.create(
      fieldsToUpdate)
    if (errors) {
      console.error("error creating new totalStat")
    }
  }
}

