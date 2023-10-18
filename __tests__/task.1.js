const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
let browser;
let page;
const browserOptions = {
    headless: true,
    defaultViewport: null,
    devtools: true
};
beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.join(__dirname, '../index.html'));
    await page.setViewport({
        width: 1920,
        height: 1080
    });
}, 30000);
afterAll(async () => {
    await browser.close();
});
describe('Semantic HTML', () => {
    test('`HTML5` document declared', () => {
        const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8').replace(/(\ )/gm,"");
        expect(html).toMatch(/<!DOCTYPEhtml>/);
    });
    test('Language is defined', () => {
        const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8').replace(/(\ )/gm,"");
        expect(html).toMatch(/<htmllang="/);
    });
    test('The navigation element exists', async () => {
        // get element contains "Our Mission"
        const navElement = await page.evaluate(() => {
            const navElm = Array.from(document.querySelectorAll('nav')).find(elm => elm.textContent.toLowerCase().includes('our mission')); 
            return navElm;
        });
        expect(navElement).toBeTruthy();
    });
    test('The header element exists', async () => {
        // get element contains "Our Mission"
        const headerElement = await page.evaluate(() => {
            const headerElm = Array.from(document.querySelectorAll('header')).find(elm => elm.textContent.toLowerCase().includes('our mission')); 
            return headerElm;
        });
        expect(headerElement).toBeTruthy();
    });
    test('The image element has correct attribute', async () => {
        // get the image element
        const imageAltAttr = await page.$eval('img', elm => elm.alt);
        expect(imageAltAttr).not.toBe('');
    });
    test('The correct html element for the article exists and is not empty', async () => {
        // get tag `<article>`
        const articleElement = await page.evaluate(() => {
            const articleElm = document.querySelectorAll('article')[0]; 
            return articleElm.textContent.trim();
        });
        expect(articleElement).toBeTruthy();
    });
    test('The correct html element for the sections of content exists and is not empty', async () => {
        // get tag `<section>`
        const sectionElement = await page.evaluate(() => {
            const sectionElm = document.querySelectorAll('section')[0]; 
            return sectionElm.textContent.trim();
        });
        expect(sectionElement).toBeTruthy()
    });
    test('The elements at the bottom of the page are inside the correct html element', async () => {
        // get element contains "©DCI 2021"
        const footerElement = await page.evaluate(() => {
            const footerElm = Array.from(document.querySelectorAll('footer')).find(elm => elm.textContent.toLowerCase().includes('dci 2021')); 
            return footerElm;
        });
        expect(footerElement).toBeTruthy();
    });
});
describe('Style', () => {
    test('The navigation elements text color has sufficient contrast relative to background', async () => {
        // get element contains "Our Mission"
        const navElement = await page.evaluate(() => {
            const navElm = Array.from(document.querySelectorAll('nav')).find(elm => elm.textContent.toLowerCase().includes('our mission')); 
            return window.getComputedStyle(navElm).color;
        });
        // get element contains "Our Mission" background color
        const navElementBackground = await page.evaluate(() => {
            const navElmBackground = Array.from(document.querySelectorAll('nav')).find(elm => elm.textContent.toLowerCase().includes('our mission')); 
            return window.getComputedStyle(navElmBackground).backgroundColor;
        });
        console.log('\u001b[36m%s\u001b[0m', 'navElement: ' + navElement, 'navElementBackground: ' + navElementBackground, 'HexCode: ' + navElementBackground.substring(4, navElementBackground.length - 1));
        //expect(navElement).toBe('rgb(255, 255, 255)');
        expect(navElementBackground).not.toBe(navElement);
        expect(navElement.substring(4, navElement.length - 1)).not.toBe('126, 125, 125');
    });
    test('The heading elements text color has sufficient contrast relative to background', async () => {
        // get h1 element computed style
        const headerElement = await page.evaluate(() => {
            const headerElm = document.querySelectorAll('header')[0]; 
            return window.getComputedStyle(headerElm).color;
        });
        expect(headerElement).not.toBe('rgb(198, 196, 196)');
        expect(headerElement).not.toBe('rgb(255, 255, 255)');
    });
    test('The mouse cursor is visible when over a navigation element', async () => {
        // get element contains "Our Mission"
        const navElement = await page.evaluate(() => { 
            const navElm = Array.from(document.querySelectorAll('nav')).find(elm => elm.textContent.toLowerCase().includes('our mission')); 
            return window.getComputedStyle(navElm).cursor;
        });
        // the navElement cursor should be 'pointer' or not 'none'
        expect(navElement).not.toBe('none');
    });
});