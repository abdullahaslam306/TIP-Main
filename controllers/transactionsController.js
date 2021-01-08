const Group = require("../models/groups");

const USER  = require("../models/logins")
const GROUP = require("../models/groups")
const Transaction = require("../models/transactions");
const {App} = require("./contractController");


const addTransaction = async (req, res) => {
    const tx = Transaction(
        {
            txType: req.body.txType,
            userid: req.session.user,
            amount: req.body.amount,
        }
    );
    var id = '';
    tx.save()
    .then( async (result) =>  {
        id = result._id;
        var task = null;
        App.init();
        if(txType === "PAY")
        task = await App.savePayment(id,userid,result.createdAt,txType,amount);
        else if(txType === "DIS")
        task = await App.savePayment(id,userid,result.createdAt,txType,amount);
        else if(txType === "SUB")
        task = await App.saveSubscription(id,userid,result.createdAt,txType,amount);
        else if(txType === "WIT")
        task = await App.saveWithdraw(id,userid,result.createdAt,txType,amount);

        if(!task)
        {
            Transaction.findByIdAndDelete(id)
            .then(() =>{

                res.redirect('/user/dash');
                //Contract could not save the transaction

            })
            .catch((err) => {console.log(err);
                
                res.redirect('/user/dash');
                //Connect Flash for erro
            })
            
        }

        else
        {
            res.redirect('/user/dash');
            // Connect Flash SuccessFull
        }


    })
    .catch((err) => {
        console.log(err);
        // Connect Flash Transaction Failed to Store
    })
}

const viewTransactionsAdmin = async (req,res) => {

    Transaction.find().sort({ createdAt: -1 })
    .then((transactions) => {
        res.render('adminViewTransactions',{transactions});
    })
    .catch((err) => {
        console.log(err);
        res.render('admin-dash');
    })


}

const viewTransactionsUser = async (req,res) => {

    const userid = req.body.userid;
    
    if(userid !== undefined) {

        Transaction.find().where({userid: userid}).sort({ createdAt: -1 })
        .then((transactions) => {
            res.render('adminViewTransactions',{transactions});
        })
        .catch((err) => {
            console.log(err);
            res.render('admin-dash');
        })

    }

}



function confirmPayment(transactionid, userkey){
    // This function will take 
    print('Transaction ID is confirmed');
}

const addNewUser = async (req, res) =>
{  
    //confirmPayment(transactionid, userid);
    amount = req.body.amount;
    userid = req.session.id;
    if(amount%100 != 0 )
    {
        console.log("Amount Error");
        //Connect Flash
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
    res.redirect('/user/dash');
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

module.exports = {
    addNewUser,
<<<<<<< HEAD
   
=======
    
>>>>>>> bf28b07be63cc6cd057e7a409178e19f575c1f5e
}