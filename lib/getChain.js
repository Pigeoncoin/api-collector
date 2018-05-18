const rpc = require('./rpc.js')


async function getChain(blockHash){
  const result = await rpc.getMiningInfo()

  //  todo get blockTime over 18 blocks
  const thisMediantime = await rpc.getMediantime(result.blocks)
  const eighteenthMediantime = await rpc.getMediantime(result.blocks - 18 - 1)
  const blockTime = (thisMediantime - eighteenthMediantime) / 18


  const resultChain = {
    difficulty: result.difficulty,
    supply: result.blocks * 5000,
    hashrate: result.networkhashps,
    height: result.blocks,
    blockTime,
    timestamp: Math.floor(Date.now() / 1000)
  }

  return resultChain
}


///////////////////////////
///////////////////////////

module.exports = getChain
