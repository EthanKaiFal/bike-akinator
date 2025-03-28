'use client'
import { Bike as Bike } from "../interfaces"
import * as statsService from '../../app/_actions/statsService';
import * as statsServiceBatch from '../../app/_actions/statsServiceBatch';
import * as Papa from 'papaparse';
import { downloadData } from "aws-amplify/storage";
import { useEffect, useState } from "react";




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
            const modelIDD = modelId ?? "";
            if (modelIDD === "") {
                //console.log("boo");
            }
            else {
                for (let j = 0; j < bikeNums.length; j++) {
                    statsService.updateBikeStats(bikes[j], 1, modelIDD, bikeNums[j].engineSize, bikeNums[j].horsePower, bikeNums[j].torque, bikeNums[j].engineConfig);
                }
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





const DataImportCompon = ({ index, size }: {
    index: number,
    size: number
}) => {
    // fetch('../dataImport/all_bikes_curated.csv')
    //     .then(response => response.text())
    //     .then(responseText => {
    //         var data = Papa.parse(responseText);
    //         console.log('data:', data);
    //         setLoading(false);
    //     });
    const [stepCount, setStepCount] = useState(0);
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {

        async function fetchData() {

            try {
                const result = await downloadData({
                    path: "certain_bikez_curated.csv",
                    options: {
                        bucket: {
                            bucketName: "amplify-d3ao0vrc5bac3j-ma-bikeakindrivebuckete2718-ahiacbyscenh",
                            region: "us-east-1",
                        },
                    },
                }).result;

                const text = await result.body.text();

                parseCSV(text);
            } catch (error) {
                console.error("Error downloading data:", error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    function parseCSV(text: string) {

        // const text = await file.text();
        const batchSize = size;
        const firstIndex = index;
        let curModel = "";
        let localStepCount = 0
        let bikes: Bike[] = [];
        let curBrand = "";
        let bikesInBrand: Bike[] = [];
        let bikeNums: bikeNums[] = [];
        let category = "";

        Papa.parse<DataEntry>(text,
            {
                delimiter: ',',
                dynamicTyping: true,
                header: true,
                skipEmptyLines: true,
                transform: (value) => {
                    return value === "_" ? "" : value; // Replace "_" back to an empty string
                },
                complete: () => {
                    console.log('Finished parsing');
                    if (bikes.length) {
                        uploadBatch(bikes, category, bikeNums);
                    }
                    if (bikesInBrand.length != 0) {
                        uploadBatchForBrand(bikesInBrand, curBrand);
                    }
                    setLoading(false);
                },
                error: () => {
                    console.log("import error");
                },
                step: (results, parser) => {
                    localStepCount = localStepCount + 1;
                    setStepCount((prev) => prev + 1);
                    console.log(firstIndex);
                    console.log(localStepCount);
                    if (localStepCount >= (firstIndex - 1) && (localStepCount <= ((firstIndex - 1) + batchSize))) {
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
                            if (bikes.length != 0) {
                                uploadBatch(bikes, results.data['Category'], bikeNums);
                            }
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
                            if (bikesInBrand.length != 0) {
                                uploadBatchForBrand(bikesInBrand, curBrand);
                            }
                            curBrand = bikeData.brand ?? "";
                            bikesInBrand = [];
                            bikesInBrand.push(bikeData);

                        }
                        //put into DB per row
                        //batch.push(bikeData);
                        parser.pause();
                        setTimeout(function () { parser.resume(); }, 50);

                    }
                }
            });


    }
    if (isLoading) {
        return (
            <div style={{ marginTop: '50px' }}>
                isLoading
            </div>
        )
    }

    return (
        <div style={{ marginTop: '50px' }}>
            importing...{stepCount}
        </div>
    )

}
export default DataImportCompon;
