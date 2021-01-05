const Group = require("../models/groups");

USER  = require("../models/logins")
GROUP = require("../models/groups")






class user{
    constructor(email,id) {
        this.email = emmail;
        this.id = id;
        this.level = 1;
        this.group = []; // Group will contains userids of the group
        this.refercode = makeid; //randomly generated string for refercode. Valid for level 1 only.
    }

    addmember(memberid){
        this.group.append(memberid);
    }

    updatelevel(){
        if(this.level == 4){
            this.level = 1;
        }
        else
        {
            this.level = this.level + 1;
        }
    }

}

class group{
    constructor() {
        this.id = 1;
    }
}

function checkrefercode(refercode) {
    //search user by refercode

    //if not exist then return invalid refercode

    //search for his group and check if the group has space.
    
    return 5;

}

function confirmPayment(transactionid, userkey){
    // This function will take 
    print('Transaction ID is confirmed');
}

const addNewUser = async (req, res) =>
{  
    //confirmPayment(transactionid, userid);

    //Select Group from database.
    refercode = req.body.refercode;
    amount = req.body.amount;
    userid = req.session.user;
    //Connect Flash to be inserted
    if(amount%100 != 0 )
    {
        console.log("Amount Error");
    }   
    else
    {
        loopcount = amount/100;
        for(i=0; i<loopcount; i++)
        {
            const result = await Group.find({status:"INCOMPLETE"}).sort({createdAt:1}).limit(1);
            if (result.length === 0)
            {   
                const g = new Group({
                    status: "INCOMPLETE",
                    members: [{email:userid}]
                });
                await g.save();  
            }
            else
            {  
                userPresent = false;
                members = result[0].members;
                for(member in members){
                    if(member.email === userid){
                        userPresent = true;
                    }
                }

                if(userPresent)
                {
                    const g = new Group({
                        status: "INCOMPLETE",
                        members: [{email:userid}]
                    });
                    await g.save(); 
                }
                else
                {   
                    members.push({email:userid});
                    if(members.length === 8)
                    {
                        await Group.findByIdandUpdate(result[0]._id,{members:members,status: "COMPLETE"});
                    }
                    await Group.findByIdandUpdate(result[0]._id,{members:members});
                }
            } 
        }

        res.redirect('/user/dash');

    }

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// const grouptest = async (req, res) => {
//     res.send("Testing Done");
//     domain = '@gmail.com'
//     req.body.refercode = '';
//     for( i = 2500; i <2750 ; i++) {
//         email = i.toString() + '@gmail.com'
//         console.log(email)
//         req.session.user = email;
//         await addNewUser(req,res);
//         await sleep(5000);
//     }

    
// }

module.exports = {
    addNewUser,
   // grouptest
}