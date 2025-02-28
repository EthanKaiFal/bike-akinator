
import React from "react";
import { Bike as Bike } from "../interfaces"
import * as statsService from '../../app/_actions/statsService';
import * as statsServiceBatch from '../../app/_actions/statsServiceBatch';
import * as Papa from 'papaparse';
import { downloadData } from "aws-amplify/storage";



type DataEntry = {
    'Brand': string;
    'Model': string;
    'Year': number;
    'Category': string;
    'Rating': number;
    'Displacement (ccm)': number;
    'Power (hp)': number;
    'Torque (Nm)': number;
    'Engine cylinder': string;
    'Engine stroke': string;
};


interface bikeNums {
    engineSize: number,
    horsePower: number,
    torque: number,
    engineConfig: string,
}
function uploadBatch(bikes: Bike[], category: string, bikeNums: bikeNums[]) {
    try {
        statsServiceBatch.updateModelStats(bikes, 1, category).then((modelId) => {
            for (let j = 0; j < bikeNums.length; j++) {
                statsService.updateBikeStats(bikes[j], 1, (modelId ?? ""), bikeNums[j].engineSize, bikeNums[j].horsePower, bikeNums[j].torque, bikeNums[j].engineConfig);
            }
        })

    }
    catch {
        console.error("error updating");
    }
}

function uploadBatchForBrand(bikes: Bike[], brand: string) {
    try {
        statsServiceBatch.updateBrandStats(bikes, 1, brand);
        statsServiceBatch.updateTotalStats(bikes, 1);
    }
    catch {
        console.error("error updating");
    }
}


const firstIndex = 808;



export default async function DataImportCompon() {
    // fetch('../dataImport/all_bikes_curated.csv')
    //     .then(response => response.text())
    //     .then(responseText => {
    //         var data = Papa.parse(responseText);
    //         console.log('data:', data);
    //         setLoading(false);
    //     });
    let text: string;
    try {
        const result = await downloadData({
            path: "certain_bikez_curated.csv",
            options: {
                bucket: {
                    bucketName: "amplify-d3ao0vrc5bac3j-ma-bikeakindrivebuckete2718-ahiacbyscenh",
                    region: "us-east-1"
                }
            }
        }).result;
        text = await result.body.text();
    }
    catch (error) {
        console.log(`Error: ${error}`)
        text = "";
    }


    // const text = await file.text();
    const batchSize = 1142;
    let stepCount = 0;
    let curModel = "";
    let bikes: Bike[] = [];
    let curBrand = "";
    let bikesInBrand: Bike[] = [];
    let bikeNums: bikeNums[] = [];
    let category = "";

    Papa.parse<DataEntry>(text, {
        delimiter: ',',
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true,
        transform: (value) => {
            return value === "_" ? "" : value; // Replace "_" back to an empty string
        },
        complete: () => {
            console.log('Finished parsing');
            uploadBatch(bikes, category, bikeNums);
            uploadBatchForBrand(bikesInBrand, curBrand);
        },
        error: () => {
            console.log("import error");
        },
        step: (results, parser) => {
            stepCount = stepCount + 1;
            // console.log(results.data['Brand']);
            // console.log(results.data['Model']);
            // console.log(results.data['Year']);
            // console.log(results.data['Category']);
            // console.log(results.data['Rating']);
            // console.log(results.data['Displacement (ccm)']);
            // console.log(results.data['Power (hp)']);
            // console.log(results.data['Torque (Nm)']);
            // console.log(results.data['Engine cylinder']);
            // console.log(results.data['Engine stroke']);
            if (stepCount >= (firstIndex - 1) && (stepCount <= ((firstIndex - 1) + batchSize))) {
                console.log(stepCount);
                const bikeData: Bike = {
                    id: "",
                    year: results.data['Year'],
                    bikeNumber: 0,
                    brand: results.data['Brand'],
                    model: results.data['Model'],
                    sold: false,
                    broken: false,
                    ownershipMonths: ((results.data['Rating']) * 2) ** 2,
                    score: ((results.data['Rating']) * 2),
                }

                const curBikeNum: bikeNums = {
                    engineSize: results.data['Displacement (ccm)'] ?? 0,
                    horsePower: results.data['Power (hp)'] ?? 0,
                    torque: results.data['Torque (Nm)'] ?? 0,
                    engineConfig: results.data['Engine cylinder']
                }
                category = results.data['Category'];
                //build the batch
                if (bikeData.model === curModel) {
                    bikes.push(bikeData);
                    bikeNums.push(curBikeNum);
                }
                //batch finished
                else {
                    //handleUpload of batch to DB
                    uploadBatch(bikes, results.data['Category'], bikeNums);
                    //reset
                    bikes = [];
                    bikeNums = [];
                    curModel = bikeData.model ?? "";
                    bikeNums.push(curBikeNum);
                    bikes.push(bikeData);
                }
                //build brand batch
                if (bikeData.brand === curBrand) {
                    bikesInBrand.push(bikeData);
                }
                else {
                    uploadBatchForBrand(bikesInBrand, curBrand);
                    curBrand = bikeData.brand ?? "";
                    bikesInBrand = [];
                    bikesInBrand.push(bikeData);

                }
                //put into DB per row
                //batch.push(bikeData);
                parser.pause();
                setTimeout(function () { parser.resume(); }, 5000);
            }

        },
    });

    if (stepCount < 20000) {
        return (
            <div style={{ marginTop: '50px' }}>
                importing...{stepCount}
            </div>
        )
    }



    return (
        <div>
            finished import
        </div>
    )
}
