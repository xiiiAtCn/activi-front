module.exports = {
    'purchase appeal':function(browser) {
        let host = browser.globals.devServerURL
        let path = '/layoutContent/03/page?url=%2Fapi%2Ffilter%2FgetPage%2F90000%2FBILL%3Fat%3D%2FlayoutContent%2F03%2Fpage%26title%3D采购申请%26subTitle%3D采购申请一览'
        browser
            .url(host + path)
            .maximizeWindow()
            .waitForElementVisible('body', 10000)
            .pause(10000)
            .assert.title('采购申请')
            .element('xpath', '//*[@id="03"]', function(res) {
                console.log('xpath selector works')
                console.log(res)
            })
            .end()
    }
}