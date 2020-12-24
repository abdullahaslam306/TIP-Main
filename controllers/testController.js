

const {App} = require("./contractController");

const test = async (req, res) => {

    App.init();
    console.log(App);
    // console.log(App.subscribe(12,"2020/12/22"));
    // console.log(App.unsubscribe(12));
   // console.log(App.getSubscriptionsCountt())
//    console.log(App.getUserBalance(12))   
console.log(App.disbursements(100,12,"2020/12/22"))
}

module.exports = {test}