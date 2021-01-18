pragma solidity >=0.4.0 <0.8.0;

contract Exodus{

    address public owner;
    uint16 public userCounter = 0;

    struct User{
        bool subscribe;
        uint32 balance;
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
    modifier isSubscribed(bytes16 useraddress) {
        require(users[useraddress].subscribe);
        _;
    }
    //Users data is accessible by their addresses
    mapping (bytes16 => User) users; 

    //Users subscription is proesssed by the owners only
    function subscribe(bytes16 userid) public
    {
        require(users[userid].subscribe == false);
        users[userid].subscribe = true;
        require(users[userid].subscribe == false);
    }
    
    function unsubscribe(bytes16 userid) public onlyOwner() isSubscribed(userid)
    {
        users[userid].subscribe = true;
        require(users[userid].subscribe == false);
    }

    function increment_balance(bytes16 userid, uint32 amount) public onlyOwner() 
    {
        users[userid].balance += amount;
    }

    function decrement_balance(bytes16 userid,uint32 amount) public onlyOwner() isSubscribed(userid)
    {
        require(users[userid].balance >= amount);
        users[userid].balance -= amount;
    }

    function getBalance(bytes16 userid) public  view returns(uint)
    {
        return(users[userid].balance);
    }

}