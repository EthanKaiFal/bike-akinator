import * as fs from 'node:fs';
import * as Papa from 'papaparse';


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

const stream = fs.createReadStream('./all_bikez_curated.csv', 'utf8');

Papa.parse<DataEntry>(stream, {
    delimiter: ',',
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
    complete: () => {
        console.log('Finished parsing');
    },
    error: (error) => {
        console.error(error);
    },
    step: (results) => {
        console.log(results.data['Brand']);
        console.log(results.data['Model']);
        console.log(results.data['Year']);
        console.log(results.data['Category']);
        console.log(results.data['Rating']);
        console.log(results.data['Displacement (ccm)']);
        console.log(results.data['Power (hp)']);
        console.log(results.data['Torque (Nm)']);
        console.log(results.data['Engine cylinder']);
        console.log(results.data['Engine stroke']);
        //console.log(results)
    },
});