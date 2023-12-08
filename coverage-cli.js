const parser = require('./lib/parser');
const fileParsers = require('./lib/file-parsers');
const fs = require('fs');

function start(){
    const arg = process.argv;
    const filePath = arg[2];
    const fileType = arg[3];
    if (!fs.existsSync(filePath)) {
        console.error('unable to read file '+filePath);
        return;
    } 
    // check if filetype is available in fileparsers.types 

    if(!(fileParsers.types.indexOf(fileType)>-1)){
        console.error('invalid file type, supported types are :'+fileParsers.types);
        return;
    }

    parser
        .parseGlobs(filePath, {
            type: fileType
        })
        .then(results => console.log(JSON.stringify(results)));
}

module.exports = {
    start: start
}