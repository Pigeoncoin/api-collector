const config = require('./config/config.json')
const firebaseConfig = require('./config/serviceAccountKey.json')

const axios = require('axios')
const admin = require('firebase-admin')

const blockNotify = require('./lib/blockNotify.js')
const getBlockchain = require('./lib/getBlockchain.js')


//  listen for new blocks
//    get blockchain data
//    push it to latestData

blockNotify(async (blockHash) => {
  console.log(`blockNotify! ${blockHash}`)
  const resultBlockchain = await getBlockchain(blockHash)
  console.log(`resultBlockchain`)
  console.log(resultBlockchain)
})


//  wait 15 seconds
//    get CoinGecko data
//    get Pool data
//    push it to latestData


//  listen for update to latestData.chain
//    add to rollingAverage
//    if height % 84 == 0
//      save rollingAverage to averageHistory



console.log('it works!')
