const puppeteer = require('puppeteer');
const answerObj  = require('./solution')


//login to hackerrank link
const loginLink = 'https://www.hackerrank.com/auth/login'
const email = 'lol123@yopmail.com'
const password = '123456789'

 let browser = puppeteer.launch({
    headless: false,
    args: ['--start-maximized'],
    defaultViewport: null,
})

let page;
browser.then(function (browserObject) {
 let BroserOpenPromise = browserObject.newPage();
 return BroserOpenPromise;
}).then(function(newTab){
    page = newTab
    let hackerrankOpenPromise = newTab.goto(loginLink)
    return hackerrankOpenPromise
}).then(function () {
    let emailIsEntered = page.type("input[id='input-1']", email, {delay: 50})
    return emailIsEntered
}).then(function (){
    let passwordIsEntered = page.type("input[id='input-2']", password, {delay: 50})
    return passwordIsEntered
}).then(function (){
    let loginBtnClick = page.click("button[data-analytics='LoginPassword']", {delay: 50})
    return loginBtnClick
}).then(function (){
    let clickOnAlgoPromise = waitClick('.topic-card a[data-attr1="algorithms"]', page)
    return clickOnAlgoPromise
}).then(function (){
    let warmUpPromise = waitClick('input[value="warmup"]' , page)
    return warmUpPromise
}).then(function(){  //get number of questions based on solve challenge button
    return page.waitForTimeout(5000)
}).then(function() { //doc.queryselector all
    let allChallengesPromise = page.$$('.ui-btn.ui-btn-normal.primary-cta.ui-btn-styled', {delay: 50})
    return allChallengesPromise
}).then(function (questionArr) {
console.log(questionArr.length, 'length');
let questionWillBeSolved = questionSolver(questionArr[1], page, answerObj.answers[0]);
return questionWillBeSolved
})

function waitClick(selector, cPage){ //wait for element to load time
    return new  Promise(function(resolve, reject){
        let waitForModelPromise = cPage.waitForSelector(selector)
        waitForModelPromise.then(function (){
            let clickModel = cPage.click(selector)
            return clickModel
        }).then(function() {
            resolve()
        }).catch(function (err){
            reject()
        })
    })
}    //until selector, page available

function questionSolver(question, page, answer){
    return new Promise(function(resolve, reject){
        let questionClicked = question.click()
        questionClicked.then(function() {
            let editorInFocusPromise = waitClick('.monaco-editor.no-user-select.vs', page)
            return editorInFocusPromise
        }).then(function(){
            return waitClick('.checkbox-input', page)
        }).then(function (){
            return page.waitForSelector('textarea.custominput', page)
        }).then(function() {
            return page.type('textarea.custominput', answer, {delay:10})
        }).then(function() { //cut ans
            let ctrlPress = page.keyboard.down('Control')
            return ctrlPress
        }).then(function (){
            let aPress = page.keyboard.press('A', {delay: 100});
            return aPress
        }).then(function (){
            let xPress = page.keyboard.press('X', {delay: 100});
            return xPress
        }).then(function (){
            let ctrlUnPress = page.keyboard.up('Control', {delay: 100});
            return ctrlUnPress
        }).then(function (){
            let editorFocusPromise = waitClick('.monaco-editor.no-user-select.vs', page)
            return editorFocusPromise
        }).then(function () {
            let ctrlPress = page.keyboard.press('Control', {delay: 100});
            return ctrlPress
        }).then(function () {
            let APress = page.keyboard.down('A', {delay: 100});
            return APress
        })
        .then(function () {
            let vPress = page.keyboard.down('V', {delay: 100});
            return vPress
        }).then(function (){
            let ctrlUnPress = page.keyboard.up('Control', {delay: 100});
            return ctrlUnPress
        }).then(function () {
            return page.click('.hr-monaco__run-code', {delay: 50})
        }).then(function(){
            resolve()
        }).catch(err => {
            reject()
        })
    })
}