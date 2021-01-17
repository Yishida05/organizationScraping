(async function() {
    const puppeteer = require('puppeteer')
    const startDiv = 2
    const organizationPerPage = 20
    let organizationList = []
    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 50
    })
    const page = await browser.newPage()
    await page.goto('https://qiita.com/organizations')
    const pagination = await page.$x('/html/body/div[1]/div[3]/div[2]/div/div[1]/div/div[22]/ul/li[1]')
    const paginationMaxTypeString = await (await pagination[0].getProperty('textContent')).jsonValue() // ここ正規表現にしたいけど後で考える
    const paginationMax = paginationMaxTypeString.slice(-2) // 画面下部のページネーションからページ数を取得
    for ( let startPage = 0; startPage < paginationMax; startPage ++) {
      for (let divNumber = startDiv; divNumber < organizationPerPage; divNumber++ ) {
        await page.waitForXPath(`/html/body/div[1]/div[3]/div[2]/div/div[1]/div/div[${divNumber}]/div[2]/strong`)
        const target = await page.$x(`/html/body/div[1]/div[3]/div[2]/div/div[1]/div/div[${divNumber}]/div[2]/strong`)
        const value = await (await target[0].getProperty('textContent')).jsonValue()
        organizationList.push(value)
      }
    }
    await browser.close()
    console.log(organizationList)
  }
)()