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

const grouptest = async (req, res) => {
    res.send("Testing Done");
    domain = '@gmail.com'
    req.body.refercode = '';
    for( i = 1; i <30 ; i++) {
        await sleep(5000);
        email = i.toString() + '@gmail.com'
        console.log(email)
        req.body.user = email;
        // num = Math.floor(Math.random() * 10);
        // num += 1;
        amount = 300;
        console.log("Amount: " + amount)
        req.body.amount = amount;
        await addNewUser(req,res);
        
    }

    
}

module.exports = {
    addNewUser,
    grouptest
}