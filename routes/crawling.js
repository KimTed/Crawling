'use strict'

const schedule = require('node-schedule');
const puppeteer = require('puppeteer');
const async = require('async');
const stringify = require('csv-stringify/lib/sync');
const fs = require('fs');

const wait = (ms) => {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

const urlArr = [
  
];

const crawler = async () => {
  try {
    const result = [];

    for (const targetUrl of urlArr) {
      const browser = await puppeteer.launch({headless: false, args: ['--window-size=1920,1080'] });
      const page = await browser.newPage();
      await page.setViewport({width: 1920,height: 1080,});
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36');
      await page.goto(targetUrl ,{waitUntil: 'load'});
      await page.waitFor(3000);
      await page.waitForSelector

      const bodyHandle = await page.$('body');
      const { height } = await bodyHandle.boundingBox();
      await bodyHandle.dispose();
    
      const viewportHeight = page.viewport().height;
      let viewportIncr = 0;
      while (viewportIncr + viewportHeight < height) {
        await page.evaluate(_viewportHeight => {
          window.scrollBy(0, _viewportHeight);
        }, viewportHeight);
        await wait(2000);
        viewportIncr = viewportIncr + viewportHeight;
      }
    
      // await page.evaluate(_ => {
      //   window.scrollTo(0, 0);
      // });
    
      const resultStr = await page.evaluate(() => {
        const tmpArr = [];
        const products = document.querySelectorAll('.col-xs-2-4.shopee-search-item-result__item');
        if (products.length > 1) {
          for(const ele of products) {
            let productInfo = {};
            productInfo.url = ele.querySelector('a').href;
            productInfo.imgUrl = ele.querySelector('._1T9dHf._3XaILN').style.backgroundImage.split('"')[1];
            (ele.querySelector('._3BQlNg.bgXBUk')) ? productInfo.isFavorite = "Y" :  productInfo.isFavorite = "N";
            productInfo.prdNm = ele.querySelector('._1NoI8_._2gr36I').textContent;
            productInfo.prdCost = ele.querySelector('._341bF0').textContent;
            if (ele.querySelector('._18SLBt')) productInfo.soldCnt = ele.querySelector('._18SLBt').textContent;

            tmpArr.push(productInfo);
          }
        }
          return tmpArr;
      });
      // await page.waitFor(5000);
      console.log("END~~~~~~~", resultStr);
      await page.close();
      await browser.close();

      result.push({targetUrl, resultStr});
    }

    // debugger;
    console.dir(result);
    
    if (result.length !== 0) {
      const csv = stringify(result);
      fs.writeFileSync('cvs/result_'+Date.now()+'.csv', JSON.stringify(result));
    }

  } catch (err) {
    console.log('Error: ', err);
  }
}

schedule.scheduleJob('0 * * * * *', () => {
  crawler();
})

