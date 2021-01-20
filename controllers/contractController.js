const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const TruffleContract  = require("truffle-contract")
const Transaction = require("../models/transactions");
const User = require("../models/logins");
const transactionController = require('./transactionsController');

App = {
 
  web3Provider: null,
 
  contracts: {},
 
  account: '0x0',

  init: function() {
 
    return App.initWeb3();
 
  },

  initWeb3: function() {
    
    if (typeof web3 !== 'undefined') {
      
      App.web3Provider = web3.currentProvider;
      
      web3 = new Web3(web3.currentProvider);
    } 
    
    else {
     
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');

      web3 = new Web3(App.web3Provider);
    
    }
    
    return App.initContract();
  
  },

  initContract: function() {
  
    var filename = path.join(__dirname, '../build/contracts/Exodus.json');
  
    console.log(filename);
     
    var exodus = fs.readFileSync(filename);
  
    exodus = JSON.parse(exodus);
    
    App.contracts.Exodus = TruffleContract(exodus);
    
    App.contracts.Exodus.setProvider(App.web3Provider);


  },




  saveSubscription: async function(userid)  {

    await web3.eth.getCoinbase(function(err, account) {

      if (err === null) {

        App.account = account;

      }

      else{

        console.log(err);

      }   

    });

    await App.contracts.Exodus.deployed().then(async function(instance)
    {
  
      instance.subscribe(web3.utils.toHex(userid),{from: App.account})

      .then( async function(result){

      console.log("Transaction Mined");

    })

      .catch(function(err) {console.log(err);  }); 

    })

    .catch(function(err) {console.log(err); });

  },

    

unsubscribe: async function(userid){

  await web3.eth.getCoinbase(function(err, account) {

      if (err === null) {

        App.account = account;

      }

    });

    App.contracts.Exodus.deployed().then(function(instance){

      instance.unsubscribe(web3.utils.toHex(userid),{from: App.account})

      .then(async function(result){

        await User.findByIdAndUpdate(userid,{isSubscribed: false}).then(()=>{

          console.log("Unsubscribed Successfully: "+userid);

        })

        .catch(function(err) {console.log(err);});

      })
    
    })

    .catch(function(err) {console.log(err);});

  }
,
getBalance : async function(userid){


    await web3.eth.getCoinbase(function(err, account) {

      if (err === null) {

        App.account = account;

      }

      else{

        console.log(err);

      }

    });

    await App.contracts.Exodus.deployed().then(function(instance){

      instance.getBalance(web3.utils.toHex(userid),{from: App.account})

    .then(function(result){
      
      number = result.toNumber();

      console.log("Current Balanace: ",number)

    })

      .catch(function(err) {console.log(err); success = false}); 

    })

    .catch(function(err) {console.log(err); success = false});


},

saveDisbursement:async function(txid,userid,date,amount)  {


  await web3.eth.getCoinbase(function(err, account) {

    if (err === null) {

      App.account = account;

    }

    else{

      console.log(err);

    }

  });

  await App.contracts.Exodus.deployed().then(function(instance){

    instance.increment_balance(web3.utils.toHex(userid),amount,{from: App.account})

    .then(async function(result){
      console.log("Transaction Mined")
  })

    .catch(function(err) {console.log(err); }); 

  })

  .catch(function(err) {console.log(err);})



},

saveWithdrawal: async function(txid,userid,date,amount)  {

  success = false;

  await web3.eth.getCoinbase(function(err, account) {
  
    if (err === null) {
  
      App.account = account;
  
    }
  
    else{
  
      console.log(err);
  
    }
  
    });

  await App.contracts.Exodus.deployed().then(function(instance){
    
    instance.decrement_balance(web3.utils.toHex(userid),amount,{from: App.account})

    .then(async function(receipt){
      
      console.log(receipt);

        
        
    })
  
    .catch(function(err) {console.log(err); success = false}); 
  
  })
  
  .catch(function(err) {console.log(err); success = false});

},



};



module.exports = {App}

