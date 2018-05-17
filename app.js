const config = require('./config/config.json')
const serviceAccountKey = require('./config/serviceAccountKey.json')

const admin = require('firebase-admin')

const blockNotify = require('./lib/blockNotify.js')
const getChain = require('./lib/getChain.js')
const getPool = require('./lib/getPool.js')

// initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: "https://pigeoncoin-api.firebaseio.com",
  databaseAuthVariableOverride: {
    uid: "api-worker-zyU2Rpf8G4"
  }
});

const db = admin.database()


//  listen for new blocks
//    get blockchain data
//    push it to latestData

blockNotify(async (blockHash) => {
  console.log(`blockNotify! ${blockHash}`)
  const result = await getChain(blockHash)
  const ref = db.ref('latestData').child('chain')
  ref.set(result)
})


//  wait 15 seconds
//    get CoinGecko data
//    get Pool data
//    push it to latestData
setInterval(main, 15*1000)

async function main(){
  console.log(`lets getPool`)
  const result = await getPool()
  const ref = db.ref('latestData').child('pool')
  ref.set(result)
}

//  listen for update to latestData.chain
//    add to rollingAverage
//    if height % 84 == 0
//      save rollingAverage to averageHistory



console.log('it works!')
