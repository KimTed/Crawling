'use strict'

const fs = require('fs');
const path = require('path');
const {logger} = require('../config/logConfig');

const fileDir = 'cvs';
const filePrefix = "result_";
const fileType = ".csv";

const files = fs.readdirSync(fileDir);
try {
    for (let fileNm of files) {
        let fileInfo = fs.statSync(path.join(fileDir, fileNm));
        let fileData = fs.readFileSync(path.join(fileDir, fileNm), 'utf-8');
        let fileDataJson = JSON.parse(fileData);
        let fileTimeStr = fileNm.replace(fileType, "").replace(filePrefix,"");
    
        let yearStr = fileInfo.birthtime.getUTCFullYear();
        let monthStr = fileInfo.birthtime.getUTCMonth() + 1;
        let dateStr = fileInfo.birthtime.getUTCDate();
        let hourStr = fileInfo.birthtime.getHours();
        let minStr = fileInfo.birthtime.getUTCMinutes();
        
        let dayStr = yearStr + ""
            + ((monthStr + "").length === 1 ? "0" + monthStr : monthStr) + ""
            + ((dateStr + "").length === 1 ? "0" + dateStr : dateStr) + ""
            + ((hourStr + "").length === 1 ? "0" + hourStr : hourStr) + ""
            + ((minStr + "").length === 1 ? "0" + minStr : minStr);
    
        console.log(dayStr);
    
        fileDataJson.map(ele => {
            ele.resultStr.map(content => {
                content.createDt = dayStr;
            });
        });
    
        fs.writeFileSync(path.join(fileDir, filePrefix + dayStr + fileType), JSON.stringify(fileDataJson));
    }
} catch(e) {
    console.log("error 발생", e);
    logger.error("chgCvsFileNm Error: "+ e);
}
