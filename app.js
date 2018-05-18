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
  databaseURL: config.firebase.databaseURL,
  databaseAuthVariableOverride: {
    uid: config.firebase.customUid
  }
});

const db = admin.database()


//  wait for new blocks
//    get blockchain data
//    push it to latestData

blockNotify(async (blockHash) => {
  console.log(`[blockNotify] new block!`)
  const resultChain = await getChain(blockHash)
  const ref = db.ref('latestData').child('chain')

  ref.set(resultChain)
  console.log(`[chain] saved new ${resultChain.height}`)

  updateAverages()
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
    console.log(`[pool] saved new data`)
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
  const ref = db.ref('latestData').child('market')

  if(resultMarket && objectsAreDifferent(resultMarket, lastMarket)){
    lastMarket = resultMarket
    await ref.set(resultMarket)
    console.log(`[market] saved new data`)
  }
}

//  listen for update to latestData.chain
//    add to rollingAverage
//    if height % 84 == 0
//      save rollingAverage to averageHistory

async function updateAverages(){
  let snap = await db.ref('latestData').once('value')
  const latestData = snap.val()

  const averageRef = db.ref('rollingAverage')
  let averageSnap = await averageRef.once('value')
  const currentAverage = averageSnap.val()

  if(currentAverage){
    // there is already one there
    console.log(`[updateAverages] we found an average`)

    // add one

    currentAverage.count++

    // sum both objects

    // update firebase

    await averageRef.set(currentAverage)
  }
  else{
    // create a new one
    console.log(`[updateAverages] make a new average!`)
    const createAverage = Object.assign({count:1}, latestData)
    await averageRef.set(createAverage)
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
