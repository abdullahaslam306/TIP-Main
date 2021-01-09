var Exodus = artifacts.require('./Exodus.sol');

contract("Election", function(accounts)
{
    var electionInstance;

    it("user subscribe with userid", function(){
        return Exodus.deployed()
        .then(function(instance){
            instance.subscribe(web3.utils.toHex("tx1"),web3.utils.toHex("user1"),web3.utils.toHex("date"),web3.utils.toHex("SUB"),25, {from: web3})
            .then((result) => {
                instance.transactionCounter().then(function(counter){
                    assert(counter,1);
                })
            })
        })
        
    })
})