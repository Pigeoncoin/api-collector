const axios = require('axios')
const rpc = require('./rpc.js')


async function getPool(){
  // get difficulty
  const miningInfo = await rpc.getMiningInfo()
  const difficulty = miningInfo.difficulty

  try{
    const result = await axios.get('https://pool.pigeoncoin.org/api/currencies')
    const data = result.data.PGN

    // get lastBlockTime
    const lastBlockTime = await rpc.getTime(data.lastblock)

    const returnObject = {
        miners: data.workers,
        hashrate: data.hashrate,
        lastBlock: data.lastblock,
        lastBlockTime,
        dailyBlocks: data['24h_blocks'],
        timeToFind: difficulty * Math.pow(2,32) / data.hashrate,
        timestamp: Math.floor(Date.now() / 1000),
      }

    return returnObject
  }
  catch(e){
    // pool API is not responding, we'll try again later
  }
}


//////////////////

module.exports = getPool
