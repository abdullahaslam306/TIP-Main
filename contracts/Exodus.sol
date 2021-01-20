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
    modifier isSubscribed(bytes32 useraddress) {
        require(users[useraddress].subscribe);
        _;
    }
    //Users data is accessible by their addresses
    mapping (bytes32 => User) users; 

    //Users subscription is proesssed by the owners only
    function subscribe(bytes32 userid) public
    {
        require(users[userid].subscribe == false);
        User storage u  = users[userid];
        u.subscribe = true;
        require(users[userid].subscribe == true);
    }
    
    function unsubscribe(bytes32 userid) public onlyOwner() isSubscribed(userid)
    {
        users[userid].subscribe = true;
        require(users[userid].subscribe == false);
    }

    function increment_balance(bytes32 userid, uint32 amount) public onlyOwner() 
    {
        users[userid].balance += amount;
    }

    function decrement_balance(bytes32 userid,uint32 amount) public onlyOwner() isSubscribed(userid)
    {
        require(users[userid].balance >= amount);
        users[userid].balance -= amount;
    }

    function getBalance(bytes32 userid) public  view returns(uint)
    {
        return(users[userid].balance);
    }

}