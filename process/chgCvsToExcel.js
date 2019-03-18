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
{header: '가격', key: 'prdCost'},
{header: 'URL', key: 'url'},
{header: '판매량', key: 'soldCnt'},
{header: 'Favorite', key: 'isFavorite'},
{header: '이미지 URL', key: 'imgUrl'},
{header: '생성일', key: 'createDt'}
];

try {
    for (let fileNm of files) {
        // let fileInfo = fs.statSync(path.join(fileDir, fileNm));
        let fileData = fs.readFileSync(path.join(fileDir, fileNm), 'utf-8');
        let fileDataJson = JSON.parse(fileData);
        console.log(fileDataJson);
        fileDataJson.some((ele, idx) => {
            if (idx === 0 ) ele.resultStr.map(ele => firstArr.push(ele));
            else if (idx === 1 ) ele.resultStr.map(ele => secondArr.push(ele));
            else if (idx === 2 ) ele.resultStr.map(ele => thirdArr.push(ele));
            else if (idx === 3 ) ele.resultStr.map(ele => forthArr.push(ele));
        });
    }

    console.log(firstArr)
    console.log(secondArr)
    console.log(thirdArr)
    console.log(forthArr)

    const workbook = new excel.Workbook();
    const worksheet0 = workbook.addWorksheet('');
    const worksheet1 = workbook.addWorksheet('');
    const worksheet2 = workbook.addWorksheet('');
    const worksheet3 = workbook.addWorksheet('');
    worksheet0.columns = excelColumns;
    worksheet1.columns = excelColumns;
    worksheet2.columns = excelColumns;
    worksheet3.columns = excelColumns;

    firstArr.forEach(ele => {
        worksheet0.addRow(ele);
    });
    secondArr.forEach(ele => {
        worksheet1.addRow(ele);
    });
    thirdArr.forEach(ele => {
        worksheet2.addRow(ele);
    });
    forthArr.forEach(ele => {
        worksheet3.addRow(ele);
    });

    workbook.xlsx.writeFile("shopee.xlsx").then(function() {
        // done
        console.log("success");
    });

} catch(e) {
    console.log("error 발생", e);
    logger.error("chgCvsFileNm Error: "+ e);
}
