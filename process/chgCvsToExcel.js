'use strict'

const fs = require('fs');
const path = require('path');
const {logger} = require('../config/logConfig');
const excel = require('exceljs');

const fileDir = 'data';
const filePrefix = "result_";
const fileType = ".csv";

const files = fs.readdirSync(fileDir);

const firstArr = [];
const secondArr = [];
const thirdArr = [];
const forthArr = [];

const excelColumns = [
{header: '상품명', key: 'prdNm'},
{header: '최소가격', key: 'fromPrdCost'},
{header: '최대가격', key: 'toPrdCost'},
{header: '원가격', key: 'originalPrdCost'},
{header: 'URL', key: 'url'},
{header: '판매량', key: 'soldCnt'},
{header: 'Favorite', key: 'isFavorite'},
{header: '이미지 URL', key: 'imgUrl'},
{header: '생성일', key: 'createDt'}
];

try {
    const workbook = new excel.Workbook();
    for (let fileNm of files) {
        // let fileInfo = fs.statSync(path.join(fileDir, fileNm));
        let fileData = fs.readFileSync(path.join(fileDir, fileNm), 'utf-8');
        let fileDataJson = JSON.parse(fileData);
        
        console.log(fileDataJson);
        fileDataJson.some((ele, idx) => {
            
            let worksheet = workbook.addWorksheet(ele.targetUrl);
            worksheet.columns = excelColumns;
            ele.productArr.forEach(ele => {
                worksheet.addRow(ele);
            });
        });
    }


    workbook.xlsx.writeFile("shopee.xlsx").then(function() {
        // done
        console.log("success");
    });

} catch(e) {
    console.log("error 발생", e);
    logger.error("chgCvsFileNm Error: "+ e);
}
