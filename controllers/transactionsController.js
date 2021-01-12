const Group = require("../models/groups");

const USER  = require("../models/logins")
const GROUP = require("../models/groups")
const Transaction = require("../models/transactions");
const {App} = require("./contractController");




const addTransaction = async (req, res) => {
    const tx = Transaction(
        {
            txType: req.body.txType,
            userid: req.session.userid,
            amount: req.body.amount,
            status: "PENDING",
        }
    );
    var id = '';
    tx.save()
    .then( async  (result) =>  {
       
        console.log(result);
        id = result._id;
        var task = null;
        App.init();
        if(result.txType === "PAY")
        {
            await App.savePayment(id,result.userid,result.createdAt,result.amount);
            
        }
        else if(result.txType === "DIS")
        {
           await App.saveDisbursement(id,result.userid,result.createdAt,result.amount)
            
        
        }
        else if(result.txType === "SUB"){
          await  App.saveSubscription(id,result.userid,result.createdAt,result.amount)
           
        }
        else if(result.txType === "WIT")
        {
           await App.saveWithdrawal(id,result.userid,result.createdAt,result.amount)
           
        }
        
        res.redirect('/user/dash');
    })
    .catch((err) => {
        console.log(err);
        // Connect Flash Transaction Failed to Store
    })
}

const viewTransactionsAdmin = async (req,res) => {

    Transaction.find().sort({ createdAt: -1 })
    .then((transactions) => {
        res.render('adminViewTransactions',{results:transactions});
    })
    .catch((err) => {
        console.log(err);
        res.render('admin-dash');
    })


}


const viewTransactionsUser = async (req,res) => {

    const userid = req.session.id;
    
    if(userid !== undefined) {

        Transaction.find().where({userid: userid}).sort({ createdAt: -1 })
        .then((transactions) => {
            res.render('Usertransactionslist',{results:transactions});
        })
        .catch((err) => {
            console.log(err);
            res.render('admin-dash');
        })

    }

}


const addNewUser = async (userid,amount) =>
{  
    
  
    if(amount%100 != 0 )
    {
        console.log("Amount Error");
    }   
    else
    {
        loopcount = amount/100;
        for(i=0; i<loopcount; i++)
        {
            added = false;
            const result = await Group.find({status:"INCOMPLETE"}).sort({createdAt:1}).limit(loopcount);
            if (result.length === 0)
            {   
                const g = new Group({
                    status: "INCOMPLETE",
                    members: [{email:userid}]
                });
                console.log(await g.save()); 
                console.log(i+" "+"New Group Created for user" + userid);
            }
            else
            {  
                for(j = 0; j < result.length;j++)
                {
                    userPresent = false;
                    members = result[j].members;
                    for(k = 0; k < members.length;k++)
                    {
                        if(members[k].email === userid)
                        {
                            userPresent = true;
                            break;
                        }
                    }

                    console.log(
                        i+" "+j+" "+userPresent
                    );
                    if(!userPresent)
                    {   
                        if(!added){
                        members.push({email:userid});
                        if(members.length === 8)
                        {
                            console.log(await Group.findByIdAndUpdate(result[j]._id,{members:members,status: "COMPLETE"}));
                        }
                        console.log(await Group.findByIdAndUpdate(result[j]._id,{members:members})); 
                        console.log(i+" "+j+" "+"User added to group successfully");

                        added = true;
                        break;
                        }
                    }
                    if(added){break;}
                }
                if(!added) {
                    const g = new Group({
                        status: "INCOMPLETE",
                        members: [{email:userid}]
                    });
                    console.log(await g.save());
                    console.log(i+" "+j+" "+"New User Group created");
                }
            }
        }
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// const grouptest = async (req, res) => {
//     res.send("Testing Done");
//     domain = '@gmail.com'
//     req.body.refercode = '';
//     for( i = 1; i <30 ; i++) {
//         await sleep(5000);
//         email = i.toString() + '@gmail.com'
//         console.log(email)
//         req.body.user = email;
//         // num = Math.floor(Math.random() * 10);
//         // num += 1;
//         amount = 300;
//         console.log("Amount: " + amount)
//         req.body.amount = amount;
//         await addNewUser(req,res);
        
//     }
// }

const getTransaction = async (req, res) => {
    App.init();
    console.log(App.getTransaction(req.params.id));
    res.redirect('/user/dash');
}

module.exports = {
    addNewUser,
    viewTransactionsAdmin,
    viewTransactionsUser,
    addTransaction,
    getTransaction
}