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

    App.listenForEvents();

  },

  
  listenForEvents: async function() {
   
    App.contracts.Exodus.deployed().then(async function(instance)
    {
      instance.transactionCompleted({fromBlock: 0
      })
      .on('data', async function(event){
        console.log("Event"+event);
      }
      )
      .on('changed',async function(event){
        console.log("Event"+event);
      })

    })
      
  },


  saveSubscription: async function(txid,userid,date,amount)  {

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
      success = false;

      instance.subscribe(web3.utils.toHex(txid),web3.utils.toHex(userid),web3.utils.toHex(date),web3.utils.toHex("SUB"),amount,{from: App.account})

      .then( async function(result){

        success = true;

      console.log("Transaction Mined");

      console.log(web3.utils.hexToAscii(result.logs[0].args.txid));

      await Transaction.findByIdAndUpdate(txid,{status:"COMPLETE"}).then(()=>{

        console.log("Transaction is completed");

      })

      .catch(function(err) {console.log(err);});

      await User.findByIdAndUpdate(userid,{isSubscribed: true}).then(()=>{

        console.log("User subsciption is mined successfully");

      })

      .catch(function(err) {console.log(err);});

      return success;

    })

      .catch(function(err) {console.log(err);  return success;}); 

    })

    .catch(function(err) {console.log(err);  return success;});

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
getUserBalance : async function(userid){

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

      instance.getBalance(web3.utils.toHex(userid),{from: App.account})

    .then(function(result){

      success = true

      console.log("Current Balanace ",result)

    })

      .catch(function(err) {console.log(err); success = false}); 

    })

    .catch(function(err) {console.log(err); success = false});

    return success;    

},

savePayment:async function(txid,userid,date,amount)  {

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

    instance.savePayment(web3.utils.toHex(txid),web3.utils.toHex(userid),web3.utils.toHex(date),web3.utils.toHex("PAY"),amount,{from: App.account})

    .then(async function(result){success = true;

      await Transaction.findByIdAndUpdate(txid,{status:"COMPLETE"}).then(()=>{

      console.log("Transaction is completed");

      })

    .catch(function(err) {console.log(err);});
    console.log("Payment Successful")
   

  })

    .catch(function(err) {console.log(err); success = false});
   

  })

  .catch(function(err) {console.log(err); success = false});


  return success;

},
saveDisbursement:async function(txid,userid,date,amount)  {

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

    instance.saveDisbursement(web3.utils.toHex(txid),web3.utils.toHex(userid),web3.utils.toHex(date),web3.utils.toHex("DIS"),amount,{from: App.account})

    .then(async function(result){success = true;

      await Transaction.findByIdAndUpdate(txid,{status:"COMPLETE"}).then(()=>{

      console.log("Transaction is completed");

    })

    .catch(function(err) {console.log(err);});

    await User.findByIdAndUpdate(userid,{$inc:{balance:amount}}).then((result)=>{
      
      console.log(result);

      console.log("User balance is updated successfully");

    })

    console.log("Disbursement Successful");

  })

    .catch(function(err) {console.log(err); success = false}); 

  })

  .catch(function(err) {console.log(err); success = false});

  return success;

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
    
    instance.saveWithdrawal(web3.utils.toHex(txid),web3.utils.toHex(userid),web3.utils.toHex(date),web3.utils.toHex("WIT"),amount,{from: App.account})

    .then(async function(){success = true;

        await Transaction.findByIdAndUpdate(txid,{status:"COMPLETE"}).then(async ()=>{
  
          console.log("Transaction is completed");
          
          console.log("Amount before neg:"+amount);
          
          amount = amount*(-1);
          
          console.log("Amount after neg:"+amount);
          
          result = await User.findByIdAndUpdate(userid,{$inc: {balance : amount}})
          
          console.log(result);
          
          console.log("Withdraw Successful");
    
  
        })
        .catch(function(err) {console.log(err);});
        
        
    })
  
    .catch(function(err) {console.log(err); success = false}); 
  
  })
  
  .catch(function(err) {console.log(err); success = false});

  return success;
},

getTransaction: async function(id){
  await web3.eth.getCoinbase(function(err, account) {

    if (err === null) {
  
      App.account = account;
  
    }
  
    else{
  
      console.log(err);
  
    }
  
    });

  return await App.contracts.Exodus.deployed().then(async function(instance){

    return await instance.getTransaction(web3.utils.toHex(id),{from: App.account}).then( function(result)
    {
    
      return result;
    
    })

  })

  
}

};



module.exports = {App}

