const axios = require('axios')
const rpc = require('./rpc.js')


async function getPool(){
  const result = await axios.get('https://pool.pigeoncoin.org/api/currencies')
  const data = result.data.PGN

  // get difficulty
  const miningInfo = await rpc.getMiningInfo()
  const difficulty = miningInfo.difficulty

  // get block timestamp with block height

  try{
    const returnObject = {
        miners: data.workers,
        hashrate: data.hashrate,
        lastBlock: data.lastblock,
        lastBlockTime: Math.floor(Date.now() / 1000) - data.timesincelast,
        dailyBlocks: data['24h_blocks'],
        timeToFind: difficulty * Math.pow(2,32) / data.hashrate,
        timestamp: null, // set when we save
      }

    return returnObject
  }
  catch(e){
    // pool API is not responding, we'll try again later
  }

}

//////////////////

module.exports = getPool
