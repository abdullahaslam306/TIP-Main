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

function addUser(email,level){
    Group.find({level:level,iscompleted: false}).sort({createdAt:1}).limit(1)
    .then(records => {
       
        if(records.length===0) //check if there is no group.
            {
                console.log("Insert");
                const g = new Group({
                    owneremail: email,
                    level:level,
                    members: [],
                    iscompleted: false
                });

                g.save()
                .then(result => {
                    return;
                })
                .catch(err => {console.log(err)})
            }
        else
        {
            const g = new Group({
                owneremail: email,
                level:level,
                members: [],
                iscompleted: false
            });
            g.save().then(() => {console.log("User group has been created");})
            .catch(err => {console.log(err)})

            members = records[0].members;
            members.push({email:email});
            if(members.length === 7)
            {
                if(level < 4)
               {
                addUser(records[0].owneremail,level+1); //upgrade to next Level
               }
                Group.findByIdAndUpdate(records[0]._id,{members:members,iscompleted:true})
            
            }
            Group.findByIdAndUpdate(records[0]._id,{members:members})
            .then(result => {
              return;
            })
         
        }
    })
    .catch(err => {console.log(err);})
}

const addNewUser = async (req, res) =>
{  
    //confirmPayment(transactionid, userid);  
    //Select Group from database.

    refercode = req.body.refercode;
    if (refercode === '')
    {    
            Group.find({level:1,iscompleted:false}).sort({createdAt:1}).limit(1)
            .then(records =>  {
            console.log(records);
                if(records.length===0) //check if there is no group.
                    {
                        const g = new Group({
                            owneremail: req.session.user,
                            level:1,
                            members: [],
                            iscompleted: false
                        });

                        g.save()
                        .then(result => {
                            res.redirect("/user/dash")
                        })
                        .catch(err => {console.log(err)})
                    }
                else
                {
                    const g = new Group({
                        owneremail: req.session.user,
                        level:1,
                        members: [],
                        iscompleted: false
                    });
                    g.save().then(() => {console.log("User group has been created");})
                    .catch(err => {console.log(err)})

                    members = records[0].members;
                    members.push({email:req.session.user});
                    if(members.length === 7)
                    {
                        //upgrade to Level 2
                        Group.findByIdAndUpdate(records[0]._id,{members:members,iscompleted:true})
                        .then(() =>{console.log("Group Completed")})
                        .catch(() =>{console.log("Group Failed")})
                        addUser(records[0].owneremail,2) 
                        
                    }
                    else
                    Group.findByIdAndUpdate(records[0]._id,{members:members})
                    .then(result => {
                    console.log("Member Added");
                    })
                    .catch(err => {console.log(err);});
                    res.redirect("/user/dash")
                }
            })
            .catch(err => {console.log(err);})
    }
    else
    {
        Group.find({owneremail:refercode,level:1,iscompleted:false}).sort({createdAt:1}).limit(1)
        .then(records =>  {
            if(records.length === 0)
            {
                //Flash Error No records found 
                console.log("No records found");
            }
            else
            {
                const g = new Group({
                    owneremail: req.session.user,
                    level:1,
                    members: [],
                    iscompleted: false
                });
                g.save().then(() => {console.log("User group has been created");})
                .catch(err => {console.log(err)})

                members = records[0].members;
                members.push({email:req.session.user});
                if(members.length === 7)
                {
                    //upgrade to Level 2
                    Group.findByIdAndUpdate(records[0]._id,{members:members,iscompleted:true})
                    .then(() =>{console.log("Group Completed")})
                    .catch(() =>{console.log("Group Failed")})
                    addUser(records[0].owneremail,2) 
                    
                }
                else
                Group.findByIdAndUpdate(records[0]._id,{members:members})
                .then(result => {
                console.log("Member Added");
                })
                .catch(err => {console.log(err);});
                res.redirect("/user/dash")
            }
        })
        .catch(err => {console.log(err);})
    }
}

module.exports = {
    addNewUser
}