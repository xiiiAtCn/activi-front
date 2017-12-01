module.exports = {
    'purchase management': function(browser) {
        const devServer = browser.globals.devServerURL
        browser
            .maximizeWindow()
            .url( devServer + '/layoutContent/04/workbench')
            .pause(5000)
            .click('ul.themeLight>div>li:nth-child(4)')
            .pause(5000)
            .saveScreenshot()
            .assert.urlContains('/layoutContent/03')
            .saveScreenshot(browser.globals.screenshot + '')
            .elements('css selector', '.out-use-menu-horizontal a span', res => {
                console.log('result from selectors')
                console.log(res)
            })
            .end()
    }
}  