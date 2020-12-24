pragma solidity >=0.4.0 <0.8.0;

contract Exodus{

    address public owner;
    uint16 public paymentCounter = 0;
    uint public disbursementCounter = 0;
    uint public subscriptionCounter = 0;
    
    struct User{
        bool subscription;
        uint balance;
    }

    struct Payment{
        uint id;
        bytes16 date;
        uint userid;
        uint amount;
    }

    struct Subscription{
        uint id;
        bytes16 date;
        uint userid;
       
    }

    struct Disbursement{
        uint id;
        uint userid;
        uint16 amount;
        bytes16 date;
    }

    constructor() public{
        owner = msg.sender;
    }
    //Only Owners can access this fucntion.
    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }
    //Check the subscription of the user.
    modifier isSubscribed(uint useraddress) {
        require(users[useraddress].subscription);
        _;
    }

    //Users data is accessible by their addresses
    mapping (uint => User) users;
    mapping (uint => Payment ) payments;
    mapping (uint => Disbursement) disbursements;
    mapping (uint => Subscription) subscriptions;

    //Users subscription is proesssed by the owners only
    function subscribe(uint userid,bytes16 date) public
    {
        require(users[userid].subscription == false);
        users[userid].subscription = true;
        subscriptionCounter++;
        subscriptions[subscriptionCounter] = Subscription( subscriptionCounter,date, userid);
        require(users[userid].subscription);
    }
    
    function unsubscribe(uint useraddress) public onlyOwner() 
    {
        users[useraddress].subscription = false;
        require(users[useraddress].subscription == false);
    }
    function getSubscriptionsCount() public view returns(uint) {
       
        return users.length;
    }

    function recievePayments(uint userid,bytes16 date,uint amount) public isSubscribed(userid)
    {
        paymentCounter++;
        payments[paymentCounter] = Payment( paymentCounter,date,userid,amount);
       
    }
 
    function disbursePayments(uint16 amount,uint userid,bytes16 date) public  onlyOwner() isSubscribed(userid)
    {
        disbursementCounter++;
        users[userid].balance -= amount;
        disbursements[disbursementCounter] = Disbursement( disbursementCounter, userid ,amount, date);
        require(users[userid].balance == (users[userid].balance - amount));
    }
    
    function getBalance(uint userid) public  view returns(uint)
    {
        return(users[userid].balance);
    }

}