
import React from "react";
import { Bike as Bike } from "./interfaces"
import * as statsService from '../app/_actions/statsService';

import * as Papa from 'papaparse';

function delay(ms: number, callback: () => void) {
    setTimeout(callback, ms);
}

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

export function updateAllBikeStats(bikeData: Bike, category: string, engineSize: number, horsePower: number, torque: number, engineConfig: string) {
    //console.log("listing"+ JSON.stringify(bikeData));

    try {
        statsService.updateBrandStats(bikeData, 1);
        statsService.updateModelStats(bikeData, 1, category).then((modelId) => {
            statsService.updateBikeStats(bikeData, 1, (modelId ?? ""), engineSize, horsePower, torque, engineConfig);
        })
        statsService.updateTotalStats(bikeData, 1);
    }
    catch {
        console.error("error updating");
    }
}




export default async function DataImportCompon() {
    // fetch('../dataImport/all_bikes_curated.csv')
    //     .then(response => response.text())
    //     .then(responseText => {
    //         var data = Papa.parse(responseText);
    //         console.log('data:', data);
    //         setLoading(false);
    //     });
    const response = await fetch('http://127.0.0.1:3001/all_bikez_curated.csv');
    const text = await response.text();
    const batchSize = 10;
    var stepCount = 0;
    let batch: Bike[] = [];

    Papa.parse<DataEntry>(text, {
        delimiter: ',',
        dynamicTyping: true,
        header: true,
        preview: 2000,
        skipEmptyLines: true,
        transform: (value) => {
            return value === "_" ? "" : value; // Replace "_" back to an empty string
        },
        complete: (result) => {
            console.log('Finished parsing');
        },
        error: (error: any) => {
            console.error(error);
        },
        step: (results, parser) => {
            stepCount = stepCount + 1;
            console.log(stepCount);
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
            //put into DB per row
            //batch.push(bikeData);
            parser.pause();
            updateAllBikeStats(bikeData, results.data['Category'], results.data['Displacement (ccm)'] ?? 0, results.data['Power (hp)'] ?? 0, results.data['Torque (Nm)'] ?? 0, results.data['Engine cylinder'])
            setTimeout(function () { parser.resume(); }, 5000);

        },
    });





    return (
        <div>
            finished
        </div>
    )
}
