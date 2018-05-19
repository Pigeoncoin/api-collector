
async function getAverage(latestRef, averageRef){
  let latestSnap = await latestRef.once('value')
  const latestData = latestSnap.val()

  let averageSnap = await averageRef.once('value')
  const averageData = averageSnap.val()

  if(!latestData.chain || !latestData.market || !latestData.pool){
    console.log(`[getAverage] we need to wait for latestData to populate`)
    return null
  }

  else if( !averageData || !averageData.count || !averageData.chain || !averageData.market || !averageData.pool){
    console.log(`[getAverage] averageData is incomplete, we need to start fresh`)
    return Object.assign({count:1},latestData)
  }

  else{
    console.log(`[getAverage] doing an average!`)
    return averageObjects(latestData, averageData)
  }
}


module.exports = getAverage


////////////////

function averageObjects(latestData, averageData){
  // average these items
  const averageTemplate = {
    chain: [
      'blockTime',
      'hashrate'
    ],
    market: [
      'marketCapBtc',
      'marketCapUsd',
      'priceBtc',
      'priceUsd',
      'volumeBtc',
      'volumeUsd',
    ],
    pool: [
      'dailyBlocks',
      'hashrate',
      'miners',
      'timeToFind',
    ]
  }

  // make sure everything else is up to date
  const updatedAverage = Object.assign({},latestData) // break object reference
  const count = updatedAverage.count = averageData.count + 1

  for([key, value] of Object.entries(averageTemplate)){
    for(child of value){
      let averageChild = averageData[key][child]
      let latestChild = latestData[key][child]
      if(!averageChild || !latestChild){
        return null
      }
      updatedAverage[key][child] = rollingAverage(averageChild, latestChild, count)
    }
  }

  return updatedAverage
}


function rollingAverage(average, newNumber, n){
  return average - (average / n) + (newNumber / n)
}
