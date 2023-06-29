import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());
const URL = 'https://www.al-islam.org/quran/';

(async () => {
  // Launch browser and open a new page
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 100000,
  });
  const page = await browser.newPage();

  // Go to the specified website
  await page.goto(URL);

  // Wait for the container elements to load
  await page.waitForXPath('//*[@id="app"]/div[2]/div/div[2]/div[2]/div[1]');

  // Scrape the data
  const data = await page.evaluate(() => {
    const containerElement = document.evaluate(
      '//*[@id="app"]/div[2]/div/div[2]/div[2]/div[1]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    if (!containerElement) {
      return null; // Return null if container element not found
    }

    const items = containerElement.querySelectorAll('div.col-4');

    const scrapedData = [];
    items.forEach((item,index) => {
      const url = item.querySelector('a').href;
      const name = item.querySelector('div.sura-name').innerText;
      const title = item.querySelector('div.sura-english-name').innerText;
      const verses = item.querySelector('div.sura-verse-count').innerText;

      scrapedData.push({
        url,
        name,
        title,
        chapter: (index+1),
        verses,
      });
    });

    return scrapedData;
  });

  // Save data to a JSON file
  fs.writeFileSync('./data/scraped_chapters.json', JSON.stringify(data, null, 2));
  // console.log(data);

  console.log('Data saved to ./data/scraped_chapters.json');

  // Close the browser
  await browser.close();
})();
