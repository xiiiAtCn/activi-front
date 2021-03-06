module.exports = {
    'supplier information': function(browser) {
        let host = browser.globals.devServerURL
        let path = '/layoutContent/03/page?url=%2Fapi%2Ffilter%2FgetPage%2F50000%2FBO%3Fat%3D'
        + '%2FlayoutContent%2F03%2Fpage%26title%3D供应商档案%26subTitle%3D供应商'
        browser
            .url(host + path)
            .maximizeWindow()
            .pause(5000)
            .waitForElementVisible('body', 1000)
            .assert.title('供应商档案')
            .elements('xpath' , '//*[@id="app"]/div/div/div/div/div/div[2]/div/div[1]/div[1]/div/span', function(res) {
                console.log('.out-use-menu-horizontal a')
                console.log(res)
                for(let i = 0, length = res.length; i < length; i++) {
                    console.log(res[i].innerHTML)
                }
            })
            .refresh()
            .pause(5000)
            .saveScreenshot( browser.globals.screenshot + '/supplierInfo.png')
            .end()
    }
}