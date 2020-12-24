const Web3 = require('web3');
const fs = require('fs');
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
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
     
      var filename = (__dirname.replace("\\controllers","")) + '\\build\\contracts\\Exodus.json';
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
    });

    await App.contracts.Exodus.deployed().then(function(instance){
      instance.subscribe(userid,web3.utils.toHex(date),{from: App.account})
      .then(function(){success = true})
      .catch(function(err) {console.log(err); success = false}); 
    })
    .catch(function(err) {console.log(err); success = false});

    return success;
  },

  getSubscriptionsCount: async function()
  {
      
  },

  unsubscribe: async function(userid){
    await web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
      }
    });

    App.contracts.Exodus.deployed().then(function(instance){
      instance.unsubscribe(userid)
    })
    .catch(function(err) {console.log(err);});


  }

};


module.exports = {App}

