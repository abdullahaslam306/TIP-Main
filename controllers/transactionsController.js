
USER  = require("../models/logins")
GROUP = require("../models/groups")


//Starting Variables
currentLevel4 = 1;
currentLevel3 = 1;
currentLevel2 = 1;
currentLevel1 = 1;



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

function addNewUser(transactionid, userid,refercode = '')
{
    //confirmPayment(transactionid, userid);
    var currentGroup = currentLevel1;
    if(refercode != ''){
           //Check if refercode is valid
           groupnumber = checkrefercode(refercode);
           if( groupnumber > 0)
           {
                //getusergroup by refercode
                   
            }   
    }   
    else 
    {
            currentGroup.append(userid);
    } 
    
}

module.exports = {
    addNewUser
}