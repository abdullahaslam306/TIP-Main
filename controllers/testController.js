

const {App} = require("./contractController");

const test = async (req, res) => {

    App.init();
    console.log(App);
    console.log(App.subscribe(12,"2020/12/22"));

}

module.exports = {test}