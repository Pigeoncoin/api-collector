const rpcClient = require('bitcoind-rpc')
const config = require('../config/config.json')

rpc = new rpcClient(config.rpc)

async function getBlockchain(blockHash){
  const block = await getBlock(blockHash)
  const miningInfo = await getMiningInfo()

  miningInfo.timestamp = block.time
  miningInfo.hash = blockHash

  return(miningInfo)
}


///////////////////////////
///////////////////////////

function getBlock(blockHash){
  return new Promise((resolve, reject) => {
    rpc.getblock(blockHash, (error, response) => {
      if(error){
        reject(new Error(error))
      }

      const result = response.result

      resolve(result)
    })
  })
}


function getMiningInfo(){
  return new Promise((resolve, reject) => {
    rpc.getmininginfo((error, response) => {
      if(error){
        reject(new Error(error))
      }
      const result = response.result

      const resultBlockchain = {
        difficulty: +result.difficulty,
        supply: +result.blocks * 5000,
        hashrate: +result.networkhashps,
        height: +result.blocks,
      }

      resolve(resultBlockchain)
    })
  })
}

///////////////////////////
///////////////////////////

module.exports = getBlockchain
