const axios = require('axios')
const rpc = require('./rpc.js')


async function getPool(){
  const result = await axios.get('https://pool.pigeoncoin.org/api/currencies')
  const data = result.data.PGN

  // get difficulty
  const miningInfo = await rpc.getMiningInfo()
  const difficulty = miningInfo.difficulty

  // todo get block timestamp with block height

  const returnObject = {
      miners: data.workers,
      hashrate: data.hashrate,
      lastBlock: data.lastblock,
      lastBlockTimestamp: null,
      dailyBlocks: data['24h_blocks'],
      timeToFind: difficulty * Math.pow(2,32) / data.hashrate,
    }

  return returnObject
}

//////////////////

module.exports = getPool
