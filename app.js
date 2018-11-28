const config = require('./config/config.json')
const serviceAccountKey = require('./config/serviceAccountKey.json')

const admin = require('firebase-admin')

const blockNotify = require('./lib/blockNotify.js')
const getChain = require('./lib/getChain.js')
const getPool = require('./lib/getPool.js')
const getMarket = require('./lib/getMarket.js')
const getAverage = require('./lib/getAverage.js')


// initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: config.firebase.databaseURL,
  databaseAuthVariableOverride: {
    uid: config.firebase.customUid
  }
});

const db = admin.database()


//  wait for new blocks
//    get blockchain data
//    push it to latestData

blockNotify( async (blockHash) => {
  console.log(`[blockNotify] new block!`)
  const resultChain = await getChain(blockHash)
  const ref = db.ref('latestData').child('chain')

  await ref.update(resultChain)
  console.log(`[chain] saved new ${resultChain.height}`)

  rollingAverage()
})


//  every 15 seconds
//    get pool data
//    push it to latestData

setInterval(refreshPool, 15*1000)

var lastPool = ''

async function refreshPool(){
  const resultPool = await getPool()
  const ref = db.ref('latestData').child('pool')

  if(resultPool && objectsAreDifferent(resultPool,lastPool)){
    lastPool = resultPool
    await ref.update(resultPool)
    console.log(`[pool] saved new data`)
  }
}


//  every 60 seconds
//    get market data
//    push it to latestData

setInterval(refreshMarket, 60*1000)

var lastMarket = ''

async function refreshMarket(){
  const resultMarket = await getMarket()
  const ref = db.ref('latestData').child('market')

  if(resultMarket && objectsAreDifferent(resultMarket, lastMarket)){
    lastMarket = resultMarket
    await ref.update(resultMarket)
    console.log(`[market] saved new data`)
  }
}


//  call from blockNotify
//    add to rollingAverage
//    if height % 72 == 0
//      save rollingAverage to averageHistory

async function rollingAverage(){
  const latestRef = db.ref('latestData')
  const averageRef = db.ref('averageData')

  const newAverage = await getAverage(latestRef, averageRef)

  if(newAverage){
    const historyRef = db.ref('historyData')
    const height = newAverage.chain.height

    if(height % 72 == 72-1){
      // push it to history
      historyRef.child(height).update(newAverage)
      averageRef.remove()
    } else {
      // update the average
      await averageRef.update(newAverage)
    }
  }
}


//////////////////

function objectsAreDifferent(object1, object2){
  // copy object but sever reference
  const testObject1 = Object.assign({}, object1)
  const testObject2 = Object.assign({}, object2)

  // delete timestamps
  delete testObject1.timestamp
  delete testObject2.timestamp

  return JSON.stringify(testObject1) != JSON.stringify(testObject2)
}
