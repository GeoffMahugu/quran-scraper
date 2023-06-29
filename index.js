import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

(async () => {
  // Read the JSON file
  const jsonData = fs.readFileSync('./data/scraped_chapters.json');
  const data = JSON.parse(jsonData); // Keep only the first item

  // Launch browser and open a new page
  const browser = await puppeteer.launch({
    headless: 'new',
    timeout: 100000,
  });
  const page = await browser.newPage();

  for (const item of data) {
    const chapter = item.chapter;
    const fileName = `${chapter}_${item.name.replace(/\s+/g, '-')}.json`;
    const filePath = `./data/chapters/${fileName}`;

    if (fs.existsSync(filePath)) {
      console.log(`Skipping chapter ${chapter} - File already exists`);
      continue;
    }
    console.log(`SCRAPING Sura:${chapter}`)


    // Navigate to the URL
    await page.goto(item.url);

    // Wait for the container elements to load
    await page.waitForXPath('//*[@id="arabic"]/div');

    // Scrape the Arabic data
    const arabicData = await page.evaluate((chapter) => {
      const containerElement = document.querySelector('#arabic > div');

      const anchorElements = containerElement.querySelectorAll('a');

      const scrapedVerses = [];

      anchorElements.forEach((anchorElement) => {
        const url = anchorElement.href;
        const verse = parseInt(url.split('/').pop());
        const arabic = anchorElement.innerText.trim();

        scrapedVerses.push({
          url,
          arabic,
          chapter,
          verse,
        });
      });

      return scrapedVerses;
    }, chapter);

    // Click on the "Shakir" tab
    await page.evaluate(() => {
      const shakirTab = document.querySelector('a#en_shakir-tab');
      shakirTab.click();
    });

    // Wait for the visibility of the element
    await page.waitForXPath('//*[@id="en_shakir"]');

    // Scrape the English data
    const englishData = await page.evaluate((chapter) => {

      const containerElement = document.querySelector('#en_shakir');

      const anchorElements = containerElement.querySelectorAll('a');

      const scrapedVerses = [];

      anchorElements.forEach((anchorElement) => {
        const url = anchorElement.href;
        const verse = parseInt(url.split('/').pop());
        const eng = anchorElement.innerText.trim();

        scrapedVerses.push({
          url,
          eng,
          chapter,
          verse,
        });

      });

      return scrapedVerses;
    },chapter);

    // Merge Arabic and English data
    const scrapedData = arabicData.map((verseData, index) => {
      const englishVerseData = englishData[index];
      return {
        ...verseData,
        eng: englishVerseData ? englishVerseData.eng : '',
      };
    });

    if (scrapedData && scrapedData.length > 0) {
      fs.writeFileSync(filePath, JSON.stringify(scrapedData, null, 2));
      console.log(`CHAPTER ${chapter} FILE WRITE:Data saved to ${filePath}`);
    } else {
      console.log(`Skipping chapter ${chapter} - No data scraped`);
    }
  }

  console.log('Scraping completed for all chapters.');

  // Close the browser
  await browser.close();
})();
