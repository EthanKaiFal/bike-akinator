"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("node:fs");
var Papa = require("papaparse");
var stream = fs.createReadStream('./all_bikez_curated.csv', 'utf8');
Papa.parse(stream, {
    delimiter: ',',
    dynamicTyping: true,
    header: true,
    skipEmptyLines: true,
    complete: function () {
        console.log('Finished parsing');
    },
    error: function (error) {
        console.error(error);
    },
    step: function (results) {
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
