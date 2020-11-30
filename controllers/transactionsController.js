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

const addUser =  async (email,level) => {
    Group.find({level:level,iscompleted: false}).sort({createdAt:1}).limit(1)
    .then(records => {
       
        if(records.length===0) //check if there is no group.
            {
               
                const g = new Group({
                    owneremail: email,
                    level:level,
                    members: [],
                    iscompleted: false
                });

                g.save()
                .then(result => {
                    console.log("First Group");
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
            g.save().then(() => {console.log("User group has been created");
            members = records[0].members;
            members.push({email:email});
            if(members.length === 7)
            {
                Group.findByIdAndUpdate(records[0]._id,{members:members,iscompleted:true})
               .then(() =>{console.log(`${level} Group completed`);
               if(level < 4)
               {
                addUser(records[0].owneremail,level+1)
                .then(() =>{return;})
                //upgrade to next Level
               }
            
            })
               .catch(err => console.log(err))
                console.log('\n\nLevel 2 Limit\n\n')
              
               
            
            }
            Group.findByIdAndUpdate(records[0]._id,{members:members})
            .then(result => {
              return;
            })
            .catch(err => {console.log(err);
            return;
            })
        
        
        })
            .catch(err => {console.log(err)})

            
         
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
                        console.log("First Group Created");
                        res.redirect("/user/dash");
                        
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
                        .then(() =>{console.log("Group Completed");
                        addUser(records[0].owneremail,2).then(() =>{
                            res.redirect("/user/dash");    
                        })
                    
                    })
                        .catch(() =>{console.log("Group Failed")})        
                    }
                    else
                    Group.findByIdAndUpdate(records[0]._id,{members:members})
                    .then(result => {
                    console.log("Member Added");
                      res.redirect("/user/dash")
                
                    })
                    .catch(err => {console.log(err);});
                  
                  
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
                g.save().then(() =>  {
                
                console.log("User group has been created");
                members = records[0].members;
                members.push({email:req.session.user});
                if(members.length === 7)
                {
                    //upgrade to Level 2
                    Group.findByIdAndUpdate(records[0]._id,{members:members,iscompleted:true})
                    .then(() =>{console.log("Group Completed");
                     addUser(records[0].owneremail,2).then(() =>{
                         return
                     })
                }
                    
                    )
                    .catch(() =>{console.log("Group Failed")})
                    
                    
                }
                else
                Group.findByIdAndUpdate(records[0]._id,{members:members})
                .then(result => {
                console.log("Member Added");
                return;
                })
                .catch(err => {console.log(err);
                      res.redirect("/user/dash");});
              
               
            
            
            })
                .catch(err => {console.log(err)})

            }
        })
        .catch(err => {console.log(err);})
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

const grouptest = async (req, res) => {
    res.send("Testing Done");
    domain = '@gmail.com'
    req.body.refercode = '';
    for( i = 2500; i <2750 ; i++) {
        email = i.toString() + '@gmail.com'
        console.log(email)
        req.session.user = email;
        await addNewUser(req,res);
        await sleep(5000);
    }

    
}

module.exports = {
    addNewUser,
    grouptest
}