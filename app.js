const config = require('./config/config.json')
const serviceAccountKey = require('./config/serviceAccountKey.json')

const admin = require('firebase-admin')

const blockNotify = require('./lib/blockNotify.js')
const getChain = require('./lib/getChain.js')
const getPool = require('./lib/getPool.js')
const getMarket = require('./lib/getMarket.js')


// initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: "https://pigeoncoin-api.firebaseio.com",
  databaseAuthVariableOverride: {
    uid: "api-worker-zyU2Rpf8G4"
  }
});

const db = admin.database()


//  wait for new blocks
//    get blockchain data
//    push it to latestData

blockNotify(async (blockHash) => {
  console.log(`blockNotify! ${blockHash}`)
  const resultChain = await getChain(blockHash)
  const ref = db.ref('latestData').child('chain')
  ref.set(resultChain)
})


//  every 15 seconds
//    get pool data
//    push it to latestData

//todo set interval to 15 seconds
setInterval(refreshPool, 5*1000)

var lastPool = ''

async function refreshPool(){
  const resultPool = await getPool()
  const ref = db.ref('latestData').child('pool')

  if(resultPool && objectsAreDifferent(resultPool,lastPool)){
    lastPool = resultPool
    await ref.set(resultPool)
    console.log(`saved new pool data`)
  }
}


//  every 60 seconds
//    get market data
//    push it to latestData

//todo set interval to 60 seconds
setInterval(refreshMarket, 7*1000)

var lastMarket = ''

async function refreshMarket(){
  const resultMarket = await getMarket()
  const ref = db.ref('latestData').child('Market')

  if(resultMarket && objectsAreDifferent(resultMarket,lastMarket)){
    lastMarket = resultMarket
    await ref.set(resultMarket)
    console.log(`saved new Market data`)
  }
}

//  listen for update to latestData.chain
//    add to rollingAverage
//    if height % 84 == 0
//      save rollingAverage to averageHistory



//////////////////


function objectsAreDifferent(object1, object2){
  return JSON.stringify(object1) != JSON.stringify(object2)
}
