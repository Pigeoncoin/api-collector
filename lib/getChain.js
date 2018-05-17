const rpc = require('./rpc.js')


async function getChain(blockHash){
  const result = await rpc.getMiningInfo()

  const resultChain = {
    difficulty: result.difficulty,
    supply: result.blocks * 5000,
    hashrate: result.networkhashps,
    height: result.blocks,
    timestamp: Date.now(),
  }

  return resultChain
}


///////////////////////////
///////////////////////////

module.exports = getChain
