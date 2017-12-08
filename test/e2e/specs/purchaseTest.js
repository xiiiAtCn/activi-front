module.exports = {
    'purchase management': function(browser) {
        const devServer = browser.globals.devServerURL
        browser
            .url( devServer + '/layoutContent/04/workbench')
            .maximizeWindow()
            .pause(5000)
            .click('ul.themeLight>div>li:nth-child(4)')
            .pause(5000)
            .assert.urlContains('/layoutContent/03')
            .elements('css selector', '.out-use-menu-horizontal a span', res => {
                console.log('result from selectors')
                console.log(res)
            })
            .end()
    }
}  