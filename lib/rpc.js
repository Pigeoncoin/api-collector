const rpcClient = require('bitcoind-rpc')
const config = require('../config/config.json')

const rpc = new rpcClient(config.rpc)


function getMiningInfo(){
  return new Promise((resolve, reject) => {
    rpc.getmininginfo((error, response) => {
      if(error){
        reject(new Error(error))
      }
      resolve(response.result)
    })
  })
}


///////////////////////////
///////////////////////////

module.exports = { getMiningInfo }
