const rpcClient = require('bitcoind-rpc')
const config = require('../config/config.json')

const rpc = new rpcClient(config.rpc)



function getMediantime(blockHeight){
  return new Promise((resolve, reject) => {

    rpc.getblockhash(blockHeight, (error, response) => {
      if(error){
        reject(new Error(JSON.stringify(error)))
      }

      const blockHash = response.result

      rpc.getblock(blockHash, (error, response) => {
        if(error){
          reject(new Error(JSON.stringify(error)))
        }
        resolve(response.result.mediantime)
      })
    })

  })
}


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

module.exports = { getMiningInfo, getMediantime }
