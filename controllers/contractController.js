const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
const TruffleContract  = require("truffle-contract")
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');

      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    var filename = path.join(__dirname, '../build/contracts/Exodus.json');
    console.log(filename);
      // var filename = (__dirname.replace("/controllers","")) + '/build/contracts/Exodus.json';
      var exodus = fs.readFileSync(filename);
      exodus = JSON.parse(exodus);
      // Instantiate a new truffle contract from the artifact
      App.contracts.Exodus = TruffleContract(exodus);
      // Connect provider to interact with contract
      App.contracts.Exodus.setProvider(App.web3Provider);

      App.listenForEvents();

  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    //Events in our smart contract
  },


  saveSubscription: async function(txid,userid,date,amount)  {

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
      instance.subscribe(web3.utils.toHex(txid),web3.utils.toHex(userid),web3.utils.toHex(date),web3.utils.toHex("SUB"),amount,{from: App.account})
      .then(function(){success = true
      console.log("Successfully isSubscribed")
      })
      .catch(function(err) {console.log(err); success = false}); 
    })
    .catch(function(err) {console.log(err); success = false});

    return success;
  },

  

  unsubscribe: async function(userid){
    await web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
      }
    });

    App.contracts.Exodus.deployed().then(function(instance){
      instance.unsubscribe(web3.utils.toHex(userid),{from: App.account})
      console.log("Unsubscribed Successfully");
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
      .then(function(result){success = true
      console.log("Current Balanace ",result)
      })
      .catch(function(err) {console.log(err); success = false}); 
    })
    .catch(function(err) {console.log(err); success = false});
    return success;
    

},
makePayments:async function(userid,date,amount)  {

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
    instance.subscribe(web3.utils.toHex(userid),web3.utils.toHex(date),web3.utils.toHex("PAY"),amount,{from: App.account})
    .then(function(){success = true
    console.log("Payment Successful")
    })
    .catch(function(err) {console.log(err); success = false}); 
  })
  .catch(function(err) {console.log(err); success = false});

  return success;
},
makeDisbursements:async function(userid,date,amount)  {

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
    instance.subscribe(web3.utils.toHex(userid),web3.utils.toHex(date),web3.utils.toHex("DIS"),amount,{from: App.account})
    .then(function(){success = true
    console.log("Disbursement Successful");
    })
    .catch(function(err) {console.log(err); success = false}); 
  })
  .catch(function(err) {console.log(err); success = false});

  return success;
},

makeWithdrawals: async function(userid,date,amount)  {

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
    instance.subscribe(web3.utils.toHex(userid),web3.utils.toHex(date),web3.utils.toHex("WIT"),amount,{from: App.account})
    .then(function(){success = true
    console.log("Withdraw Successful");
    })
    .catch(function(err) {console.log(err); success = false}); 
  })
  .catch(function(err) {console.log(err); success = false});

  return success;
}

};



module.exports = {App}

