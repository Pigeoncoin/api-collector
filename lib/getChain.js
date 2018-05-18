const rpc = require('./rpc.js')


async function getChain(blockHash){
  const result = await rpc.getMiningInfo()

  //  get blockTime over 72 block mediantime
  const thisMediantime = await rpc.getMediantime(result.blocks)
  const referencedMediantime = await rpc.getMediantime(result.blocks - 72 - 1)
  const blockTime = (thisMediantime - referencedMediantime) / 72


  const resultChain = {
    difficulty: result.difficulty,
    supply: result.blocks * 5000,
    hashrate: result.networkhashps,
    height: result.blocks,
    blockTime,
    timestamp: Math.floor(Date.now() / 1000),
  }

  return resultChain
}


///////////////////////////
///////////////////////////

module.exports = getChain
