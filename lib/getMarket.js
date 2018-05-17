const axios = require('axios')


async function getMarket(){
  const result = await axios.get('https://api.coingecko.com/api/v3/coins/pigeoncoin/')
  const data = result.data.market_data


  try{

    const returnObject = {
      priceBtc: data.current_price.btc,
      priceUsd: data.current_price.usd,
      volumeBtc:  data.total_volume.btc,
      volumeUsd:  data.total_volume.usd,
      marketCapBtc: data.market_cap.btc,
      marketCapUsd: data.market_cap.usd,
    }

    return returnObject
  }
  catch(e){
    // market API is not responding, we'll try again later
  }

}

//////////////////

module.exports = getMarket