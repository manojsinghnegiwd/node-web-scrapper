const puppeteer = require('puppeteer');

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
  
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
  }

const loadAttribute = async (item, attribute) => {
    switch (attribute) {
        case 'innerText':
            return await item.evaluate(el => el.textContent)
        default:
            const attributeOBJ = await item.getProperty(attribute);
            const attributeValue = await attributeOBJ.jsonValue();
            return attributeValue;
    }
}

const launchAndScrollPage = async (url, browser) => {
    const page = await browser.newPage();

    await page.goto(url);
    await page.content();
    await autoScroll(page);

    return page;
}

const scrapImagesFromPage = async (url) => {
    const browser = await puppeteer.launch();
    const page = await launchAndScrollPage(url, browser);
    const images = await scrapTags('img', page, ['src', 'title', 'alt']);
    await page.close();
    await browser.close();

    return images;
}

const scrapTags = async (tag, page, attributes) => {
    const allTags = await page.$$(tag);
    const data = [];

    for (let i = 0; i < allTags.length; i++) {
        const item = allTags[i];
        const itemData = {};

        const attributePromises = attributes.map(
            attribute => loadAttribute(item, attribute)
        )

        const attributeValues = await Promise.all(attributePromises);
        
        attributeValues.map(
            (attributeValue, index) => {
                itemData[attributes[index]] = attributeValue
            }
        )

        data.push(itemData)
    }

    return data;
}

module.exports = {
    scrapImagesFromPage,
    launchAndScrollPage,
    scrapTags
}
