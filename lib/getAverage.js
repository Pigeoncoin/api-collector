async function getAverage(latestRef, averageRef){
  let latestSnap = await latestRef.once('value')
  const latestData = latestSnap.val()

  let averageSnap = await averageRef.once('value')
  const averageData = averageSnap.val()

  if(!latestData.chain || !latestData.market || !latestData.pool){
    // we need to wait for latestData to populate
    console.log(`[getAverage] we need to wait for latestData to populate`)
    return null
  }

  else if(!averageData || !averageData.count || !averageData.chain || !averageData.market || !averageData.pool){
    // averageData is incomplete, we need to start fresh
    console.log(`[getAverage] averageData is incomplete, we need to start fresh`)
    return Object.assign({count:1},latestData)
  }

  else{
    // lets do the average and return it below
    console.log(`[getAverage] lets do the average and return it below`)
    return averageObjects(latestData, averageData)
  }


}


module.exports = getAverage


////////////////


function averageObjects(latestData, averageData){

  const count = averageData.count + 1

  // sever the object reference
  // using latestData updates things like timestamp
  const updatedAverage = Object.assign({}, latestData)
  updatedAverage.count = count


  // chain
  updatedAverage.chain.blockTime = rollingAverage(averageData.chain.blockTime,
    latestData.chain.blockTime, count)

  updatedAverage.chain.hashrate = rollingAverage(averageData.chain.hashrate,
    latestData.chain.hashrate, count)

  // market
  updatedAverage.market.marketCapBtc = rollingAverage(averageData.market.marketCapBtc,
    latestData.market.marketCapBtc, count)

  updatedAverage.market.marketCapUsd = rollingAverage(averageData.market.marketCapUsd,
    latestData.market.marketCapUsd, count)

  updatedAverage.market.priceBtc = rollingAverage(averageData.market.priceBtc,
    latestData.market.priceBtc, count)

  updatedAverage.market.priceUsd = rollingAverage(averageData.market.priceUsd,
    latestData.market.priceUsd, count)

  updatedAverage.market.volumeBtc = rollingAverage(averageData.market.volumeBtc,
    latestData.market.volumeBtc, count)

  updatedAverage.market.volumeUsd = rollingAverage(averageData.market.volumeUsd,
    latestData.market.volumeUsd, count)

  // pool
  updatedAverage.pool.dailyBlocks = rollingAverage(averageData.pool.dailyBlocks,
    latestData.pool.dailyBlocks, count)

  updatedAverage.pool.hashrate = rollingAverage(averageData.pool.hashrate,
    latestData.pool.hashrate, count)

  updatedAverage.pool.miners = Math.round(rollingAverage(averageData.pool.miners,
    latestData.pool.miners, count)) // integer

  updatedAverage.pool.timeToFind = rollingAverage(averageData.pool.timeToFind,
    latestData.pool.timeToFind, count)

  return updatedAverage
}


/////////////////
function rollingAverage(average, newNumber, n){
  return average - (average / n) + (newNumber / n)
}
