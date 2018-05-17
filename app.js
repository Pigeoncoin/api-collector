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
  const resultChain = await getChain(blockHash)
  const ref = db.ref('latestData').child('chain')
  ref.set(resultChain)
})


//  wait 15 seconds
//    get CoinGecko data
//    get Pool data
//    push it to latestData

//todo set interval to 15 seconds
setInterval(main, 5*1000)

var lastPool = ''

async function main(){
  const resultPool = await getPool()
  const ref = db.ref('latestData').child('pool')

  if(resultPool && objectsAreDifferent(resultPool,lastPool)){
    lastPool = resultPool
    await ref.set(resultPool)
    console.log(`saved new pool data`)
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
