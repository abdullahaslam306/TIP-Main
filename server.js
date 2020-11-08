const http  = require('http');
const fs = require('fs');
const _ =  require('lodash');
const app = require('express')

const server = http.createServer((req,res)=>{
    console.log("Incoming Request");
    
    let path = "./views";

})


server.listen(3900,'localhost',()=>{
    console.log("Server listening at port 3000")
})