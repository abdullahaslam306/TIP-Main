pragma solidity >=0.4.0 <0.8.0;

contract Exodus{

    address public owner;
    uint16 public transactionCounter = 0;

    struct Transaction{
        bytes32 id;
        bytes32 txtype;
        bytes32 date;
        bytes32 userid;
        uint amount;
    }

    struct User{
        bytes32 id;
        uint balance;
        bool subscription;
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
    modifier isSubscribed(bytes32 useraddress) {
        require(users[useraddress].subscription);
        _;
    }

    //Users data is accessible by their addresses
    mapping (bytes32 => User) users; 
    mapping (uint => Transaction ) transactions;

    //Users subscription is proesssed by the owners only
    function subscribe(bytes32 id,bytes32 userid,bytes32 date,bytes32 txtype,uint amount) public
    {
        require(users[userid].subscription == false);
        users[userid].subscription = true;
        transactionCounter++;
        transactions[transactionCounter] = Transaction( id,txtype, date, userid, amount);
        require(users[userid].subscription);
    }
    
    function unsubscribe(bytes32 useraddress) public onlyOwner() 
    {
        users[useraddress].subscription = false;
        require(users[useraddress].subscription == false);
    }

    function savePayment(bytes32 id,bytes32 userid,bytes32 date,bytes32 txtype,uint amount) public onlyOwner()
    {
        require(users[userid].subscription == true);
        users[userid].subscription = true;
        transactionCounter++;
        transactions[transactionCounter] = Transaction( id,txtype, date, userid, amount);
    }
    
    function saveWithdrawal(bytes32 id,bytes32 userid,bytes32 date,bytes32 txtype,uint amount) public onlyOwner()
    {
        require(users[userid].subscription == true);
        users[userid].subscription = true;
        transactionCounter++;
        uint temp = users[userid].balance;
        users[userid].balance -= amount;
        transactions[transactionCounter] = Transaction(id,txtype, date, userid, amount);
        require(users[userid].balance == (temp - amount));
    }
    
    function saveDisbursements(bytes32 id,bytes32 userid,bytes32 date,bytes32 txtype,uint amount) public onlyOwner()
    {
        require(users[userid].subscription == true);
        users[userid].subscription = true;
        transactionCounter++;
        uint temp = users[userid].balance;
        users[userid].balance += amount;
        transactions[transactionCounter] = Transaction(id,txtype, date, userid, amount);
        require(users[userid].balance == (temp + amount));
    }
   
    function getBalance(bytes32 userid) public  view returns(uint)
    {
        return(users[userid].balance);
    }

}