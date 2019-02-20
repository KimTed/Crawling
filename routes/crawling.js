'use strict'

const puppeteer = require('puppeteer');
const async = require('async');
const stringify = require('csv-stringify/lib/sync');
const fs = require('fs');

const crawler = async () => {
  try {
    const result = [];
    const targetUrl = 'https://shopee.vn/Ch%C4%83m-s%C3%B3c-da-cat.160.2341';
    const browser = await puppeteer.launch({headless: false, args: ['--window-size=1920,1080'] });
    const page = await browser.newPage();
    await page.setViewport({width: 1920,height: 1080,});
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36');
    await page.goto(targetUrl);
    await page.waitFor(30000);


    const resultStr = await page.evaluate(() => {
      const tmpArr = [];
      const products = document.querySelectorAll('._1T9dHf._3XaILN');
      if (products.length > 1) {
        for(const product of products) {
          console.log("style: ", product.style.backgroundImage);
          tmpArr.push(product.style.backgroundImage);
        }
      }
        return tmpArr;
    });
    await page.waitFor(2000);
    console.log("END~~~~~~~", resultStr);
    await page.close();
    await browser.close();

    if (resultStr.length !== 0) {
      const csv = stringify(resultStr);
      fs.writeFileSync('cvs/result.csv', csv);
    }

  } catch (err) {
    console.log('Error: ', err);
  }
}

crawler();