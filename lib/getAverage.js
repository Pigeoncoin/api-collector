
function getAverage(latestData, currentAverage){

  const count = currentAverage.count + 1
  const updatedAverage = latestData // update things like timestamp
  updatedAverage.count = count


  // chain
  updatedAverage.chain.blockTime = rollingAverage(currentAverage.chain.blockTime,
    latestData.chain.blockTime, count)

  updatedAverage.chain.hashrate = rollingAverage(currentAverage.chain.hashrate,
    latestData.chain.hashrate, count)

  // market
  updatedAverage.market.marketCapBtc = rollingAverage(currentAverage.market.marketCapBtc,
    latestData.market.marketCapBtc, count)

  updatedAverage.market.marketCapUsd = rollingAverage(currentAverage.market.marketCapUsd,
    latestData.market.marketCapUsd, count)

  updatedAverage.market.priceBtc = rollingAverage(currentAverage.market.priceBtc,
    latestData.market.priceBtc, count)

  updatedAverage.market.priceUsd = rollingAverage(currentAverage.market.priceUsd,
    latestData.market.priceUsd, count)

  updatedAverage.market.volumeBtc = rollingAverage(currentAverage.market.volumeBtc,
    latestData.market.volumeBtc, count)

  updatedAverage.market.volumeUsd = rollingAverage(currentAverage.market.volumeUsd,
    latestData.market.volumeUsd, count)

  // pool
  updatedAverage.pool.dailyBlocks = rollingAverage(currentAverage.pool.dailyBlocks,
    latestData.pool.dailyBlocks, count)

  updatedAverage.pool.hashrate = rollingAverage(currentAverage.pool.hashrate,
    latestData.pool.hashrate, count)

  updatedAverage.pool.miners = Math.round(rollingAverage(currentAverage.pool.miners,
    latestData.pool.miners, count)) // integer

  updatedAverage.pool.timeToFind = rollingAverage(currentAverage.pool.timeToFind,
    latestData.pool.timeToFind, count)

  return updatedAverage
}


module.exports = getAverage


/////////////////
function rollingAverage(average, newNumber, n){
  return average - (average / n) + (newNumber / n)
}
