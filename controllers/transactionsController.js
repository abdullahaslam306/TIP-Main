

const USER  = require("../models/logins")
const GROUP = require("../models/groups")
const Group = require("../models/groups")
const Transaction = require("../models/transactions");
const {App} = require("./contractController");
const WithRequest=require("../models/withdrawRequest");
const { add } = require("lodash");



const addTransaction = async (txType, userid,amount) => {

    const tx = Transaction(
        {
            txType: txType,
            userid: userid,
            amount: amount,
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
        
        
    })
    .catch((err) => {
        console.log(err);
        // Connect Flash Transaction Failed to Store
    })
}

const userSubscribe  = async (req, res) => {
    amount = req.body.amount;
    userid = req.session.userid;
    txType = 'SUB';
    console.log('here')
    await addTransaction(txType,userid,amount);
    res.redirect('/user/dash');
}

const userPayment = async (req, res, next) => {
    
    txType = "PAY";
    amount = req.body.amount;
    userid = req.session.userid;
    await addTransaction(txType, userid,amount);
    addNewUser(req.session.user, amount);
    
    res.render('user-pay',{success:"Payment Initiated Successfully",failure:""});
    
}

const payUser= async (req, res) => {
    email=req.body.receiver;
    amount=req.body.amount;
    groupId=req.body.groupID;

    user = await USER.findOne({email:email});

    console.log(user);

    userid = user._id;

    await addTransaction("DIS",userid,amount);
   
    const payGroup= await GROUP.find().where({_id:groupId})
   
    memberss = payGroup[0].members;

    var k=0;

    for(k = 0; k < memberss.length;k++)
    {
        if(memberss[k].email == email)
        { console.log("present")
          memberss[k].payStatus=true
          break;
        }
    }
 
    GROUP.findByIdAndUpdate(groupId,{members:memberss})
    .then((result) =>{
       
        res.redirect('/admin/groups/details/'+groupId)
    })
    .catch((error) =>{
        res.redirect('/admin/groups/details/'+groupId)
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

    const userid = req.session.userid;
    
    if(userid !== undefined) {
        console.log(userid)
        Transaction.find({userid: userid})
        .then((transactions) => {
            console.log(transactions)
            res.render('Usertransactionslist',{results:transactions});
        })
        .catch((err) => {
            console.log(err);
            res.render('user-dash');
        })

    }

}


const addNewUser = async (userid, amount) =>
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

const approveRequest=async(req, res)=>{

    request = await WithRequest.findById(req.params.id);
    
    console.log(request);

    await addTransaction("WIT",request.userid,request.amount);

    await WithRequest.findByIdAndUpdate(req.params.id,{status:"APPROVED"})
    .then((response)=>{console.log(response)})
    .catch((err)=>{console.log(err)});


    await WithRequest.find().sort({createdAt: 1 })
    .then((result)=>{
    res.render('requestlist',{requests:result,success:"Request Approved",failure:""})
    
    })
    .catch((err)=>{console.log(err);})

    

}

const rejectRequest=async(req, res)=>{
    WithRequest.findByIdAndUpdate(req.params.id,{status:"FAILED"})
    .then((response)=>{console.log(response)})
    .catch((err)=>{console.log(err)})


    WithRequest.find().sort({createdAt: 1 })
    .then((result)=>{
    res.render('requestlist',{requests:result,success:"Request Rejected",failure:""})
    
    })
    .catch((err)=>{console.log(err);})


}
module.exports = {
    addNewUser,
    viewTransactionsAdmin,
    viewTransactionsUser,
    addTransaction,
    getTransaction,
    payUser,
    approveRequest,
    rejectRequest,
    userPayment,
    userSubscribe
}