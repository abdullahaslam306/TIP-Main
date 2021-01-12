
const USER  = require("../models/logins");
const Transaction = require("../models/transactions");

const {App} = require("./contractController");

const unsubscribeUsers = async () => {

    USER.find().where({isSubscribed : true})
    
    .then((userList) => {
    
        userList.forEach((user) => {
    
            Transaction.find().where({userId : user.id,txType:"SUB",status:"COMPLETE"}).sort({ updatedAt: -1}).limit(1)
    
            .then((transaction) => {
    
                date = transaction[0].updatedAt;
    
                console.log(date);
            })
    
        })

    })
    
    .catch((err) => {
    
        console.log(err);
    
    });

}
