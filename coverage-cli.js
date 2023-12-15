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
            type: fileType,
            pathMode:'unmodified'
        })
        .then(results => console.log(JSON.stringify(parseOutput(results))));
}

function parseOutput(results){

    let data = results.map((record) => {

        let file = record.file;
        let functions = record.functions;
        let lines = record.lines;
        let coveredFunctions = '';
        let uncoveredFunctions = '';
        let coveredLines = '';
        let uncoveredLines = '';
        let coveredLineCount = 0;
        let uncoveredLineCount = 0;
        lines.details.map((detail) => {
            let line = detail.line;
            let hit = detail.hit;
            if(hit == 0){
                uncoveredLines += '^'+line
                uncoveredLineCount++;
            }else{
                coveredLines += '^'+line
                coveredLineCount++;
            }
        });
        functions.details.map((detail) => {
            let functionName = detail.name;
            let hit = detail.hit;
            if(hit == 0){
                uncoveredFunctions += '^'+functionName
            }else{
                coveredFunctions += '^'+functionName
            }
        })
        return {file:file, uncoveredFunctions:uncoveredFunctions, coveredFunctions:coveredFunctions, coveredLines:coveredLines, uncoveredLines: uncoveredLines, coverage:(( coveredLineCount/(coveredLineCount+uncoveredLineCount))*100).toFixed(2) };
    })
    return data;
}

module.exports = {
    start: start
}