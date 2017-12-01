module.exports = {
    'login page test': function(browser) {
        const devServer = browser.globals.devServerURL
        browser
            .url(devServer)
            .timeoutsAsyncScript(10000)
            .waitForElementVisible('body', 1000)
            .assert.title('昱石')
            .click('#app main button.tab')
            .waitForElementVisible('.comp-full-calendar', 1000)
            .assert.title('昱石')
            .assert.urlContains('/layoutContent/04/workbench')
            .end()
    }
}