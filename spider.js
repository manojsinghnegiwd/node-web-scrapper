const puppeteer = require("puppeteer");
const { launchAndScrollPage, scrapTags } = require("./scrapper");

const crawlPage = async (url, browser, crawledPages = [], baseUrl) => {
    let newCrawledPages = [...crawledPages];

    const page = await launchAndScrollPage(url, browser);
    const hrefs = await scrapTags('a', page, ['href', 'title', 'innerText']);

    newCrawledPages = crawledPages.concat({
        url,
        hrefs
    })

    for (let i = 0; i < hrefs.length; i++) {
        if (
            !newCrawledPages.find(crawledPage => crawledPage.url == hrefs[i].href) &&
            hrefs[i].href.includes(baseUrl) &&
            url !== hrefs[i].href
        ) {
            newCrawledPages = await crawlPage(hrefs[i].href, browser, newCrawledPages, baseUrl)
        }
    }

    await page.close();
    return newCrawledPages;
}

const spider = async (url) => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const crawledPages = await crawlPage(url, browser, [], url)
    await browser.close();

    return crawledPages;
}

module.exports = spider;
