'use strict'

const schedule = require('node-schedule');
const puppeteer = require('puppeteer');
const async = require('async');
const stringify = require('csv-stringify/lib/sync');
const fs = require('fs');
const {logger} = require('../config/logConfig');

const wait = (ms) => {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

const urlArr = [
  
];

const getDateStr = () => {
  let yearStr = new Date().getFullYear() + "" ;
  let monthStr = ((new Date().getMonth() + 1) + "").length === 1 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1) + "";
  let dateStr = (new Date().getDate() + "").length === 1 ? "0" + new Date().getDate() : new Date().getDate() + "";
  let hoursStr = (new Date().getHours() + "").length === 1 ? "0" + new Date().getHours() : new Date().getHours() + "";
  let minStr = (new Date().getMinutes() + "").length === 1 ? "0" + new Date().getMinutes() : new Date().getMinutes() + "";

  return yearStr + monthStr + dateStr + hoursStr + minStr;
}

const crawler = async () => {
  
  const browser = await puppeteer.launch({headless: false, args: ['--window-size=1920,1080', '--disable-notifications']});

  try {
    const result = [];
    for (const targetUrl of urlArr) {
      
      const page = await browser.newPage();
      await page.setViewport({width: 1920,height: 1080,});
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36');
      await page.goto(targetUrl);
      await page.waitForSelector('.col-xs-2-4.shopee-search-item-result__item');
      
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
            let yearStr = new Date().getFullYear() + "" ;
            let monthStr = ((new Date().getMonth() + 1) + "").length === 1 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1) + "";
            let dateStr = (new Date().getDate() + "").length === 1 ? "0" + new Date().getDate() : new Date().getDate() + "";
            let hoursStr = (new Date().getHours() + "").length === 1 ? "0" + new Date().getHours() : new Date().getHours() + "";
            let minStr = (new Date().getMinutes() + "").length === 1 ? "0" + new Date().getMinutes() : new Date().getMinutes() + "";
            
            let productInfo = {};
            productInfo.url = ele.querySelector('a').href;
            productInfo.imgUrl = ele.querySelector('._1T9dHf._3XaILN') ? ele.querySelector('._1T9dHf._3XaILN').style.backgroundImage.split('"')[1] : 'fail to get image';
            productInfo.isFavorite = ele.querySelector('._3BQlNg.bgXBUk') ? "Y" : "N";
            productInfo.prdNm = ele.querySelector('._1NoI8_._2gr36I').textContent;
            productInfo.prdCost = ele.querySelector('._341bF0').textContent;
            if (ele.querySelector('._18SLBt')) productInfo.soldCnt = ele.querySelector('._18SLBt').textContent;

            productInfo.targetUrl = window.location.href;
            productInfo.createDt = yearStr + monthStr + dateStr + hoursStr + minStr;

            tmpArr.push(productInfo);
          }
        }
          return tmpArr;
      });

      console.log("END~~~~~~~", resultStr);
      await page.close();
      
      result.push({targetUrl, resultStr});
    }
    // throw new Error("test");
    console.dir(result);
    
    if (result.length !== 0) {
      const dirNm = 'cvs/result_'+getDateStr()+'.csv';
      
      fs.writeFileSync(dirNm, JSON.stringify(result));
    }
    
  } catch (err) {
    console.log('Error: ', err);
    logger.error("Error 발생: " + err);
  } finally {
    await browser.close();
  }
}

schedule.scheduleJob('0 * * * *', () => {
  crawler();  
});