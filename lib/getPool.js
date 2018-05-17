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
    // todo replace 56621 with data.lastblock on mainnet
    const timestamp = await rpc.getTimestamp(56621)

    const returnObject = {
        miners: data.workers,
        hashrate: data.hashrate,
        lastBlock: data.lastblock,
        lastBlockTimestamp: timestamp * 1000,
        dailyBlocks: data['24h_blocks'],
        timeToFind: difficulty * Math.pow(2,32) / data.hashrate,
        timestamp: Date.now(),
      }

    return returnObject
  }
  catch(e){
    // pool API is not responding, we'll try again later
  }

}

//////////////////

module.exports = getPool
