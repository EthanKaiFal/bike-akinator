import csv from 'csv-parser';
import * as fs from 'fs';


fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (row) => {
        console.log(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });