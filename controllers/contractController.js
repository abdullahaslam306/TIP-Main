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


  subscribe: async function(userid,date)  {

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
      instance.subscribe(userid,web3.utils.toHex(date),{from: App.account})
      .then(function(){success = true
      console.log("Successfully isSubscribed")
      })
      .catch(function(err) {console.log(err); success = false}); 
    })
    .catch(function(err) {console.log(err); success = false});

    return success;
  },

  getSubscriptionsCountt: async function()
  {
    success = false;

    

    await App.contracts.Exodus.deployed().then(function(instance){
      instance.subscriptionCounter
      console.log(instance.subscriptionCounter.request);
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
      instance.unsubscribe(userid,{from: App.account})
      console.log("USER UNSUBSCRIBBED")
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

  ab=  await App.contracts.Exodus.deployed().then(function(instance){
     r= instance.getBalance(userid,{from: App.account})
      .then(function(result){success = true
      console.log("Current Balanace ",r)
      })
      .catch(function(err) {console.log(err); success = false}); 
    })
    .catch(function(err) {console.log(err); success = false});
console.log(ab)
    return success;
    

},
makePayments:async function(userid,date,amount){
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
      instance.recievePayments(userid,web3.utils.toHex(date),amount,{from: App.account})
      .then(function(){success = true
      console.log("Successfully Paid")
      })
      .catch(function(err) {console.log(err); success = false}); 
    })
    .catch(function(err) {console.log(err); success = false});

    return success;
  },
  disbursements:async function(amount,userid,date){
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
        instance.disbursePayments(amount,userid,web3.utils.toHex(date),{from: App.account})
        .then(function(){success = true
        console.log("Successfully Paid")
        })
        .catch(function(err) {console.log(err); success = false}); 
      })
      .catch(function(err) {console.log(err); success = false});
  
      return success;
    },
  
  
};



module.exports = {App}

