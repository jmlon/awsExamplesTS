import fs from 'node:fs';
import readline from 'node:readline';
import date from 'date-and-time';
import { createTable, deleteTable, putItem } from './example_DynamoDB.js';


function importCSV(filename: string, tableName: string) {
    let total = 0;
    let firstRow = true;
    
    const fileStream = fs.createReadStream(filename);
    const rd = readline.createInterface({
        input: fileStream
    });

    rd.on('line', function (line) {
        if (firstRow) {
            console.log(line);
            firstRow = false;
            return;
        }
        // console.log(line, line.length);
        let r = line.replace(/"""/g, '"');
        let tmp = r.split( /(?!\B"[^"]*),(?![^"]*"\B)/g ).map( x => x.replace( /((^")|("$))/g, '') )
        let d = date.parse(tmp[5], 'MMMM D, YYYY', true); // assume UTC dates
        let views = parseFloat(tmp[6]);
        console.log(d, d.getTime(), views);
        const item = {
            Season:   { N: tmp[0] },
            Episode:  { N: tmp[1] },
            Title:    { S: tmp[2] },
            Director: { S: tmp[3] },
            Writers:  { S: tmp[4] },
            Date:     { N: d.getTime().toString() },    // Store dates as epoch times (msec)
            US_viewers: { N: '0' }                      // By default use 0 for cases where source is NaN
        };
        if (! isNaN(views)) item.US_viewers = { N: views.toString() };
        putItem(tableName, item);

        total += 1;
    });

    rd.on('close', function(x:any,err:any) {
        console.log(x, err, total);
    });

}


(async () => {
    const tableName = 'TEST_TABLE';
    // await deleteTable(tableName);
    await createTable(tableName);
    importCSV('stng.csv', tableName);

})();

/*
Testing regular expressions:

let s = "goodday,\"\"\"hola,adios\"\"\",aurevoir";
let r = s.replace(/"""/g, '"');
let x = r.matchAll( /(?!\B"[^"]*),(?![^"]*"\B)/g )
let tmp = r.split( /(?!\B"[^"]*),(?![^"]*"\B)/g )
tmp.map( x => x.replace( /((^")|("$))/g, '') )

*/
