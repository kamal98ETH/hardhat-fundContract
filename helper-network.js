const axios = require('axios');

const feed_addresses = {
    11155111: {
        name: 'sepolia',
        feed_address: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    },
};

const DECIMALS = 8;

async function getEthPrice() {
    const api_url =
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH';
    const headers = { 'X-CMC_PRO_API_KEY': process.env.CMC_API };
    const response = await axios.get(api_url, { headers });
    const price = await response.data.data.ETH.quote.USD.price;
    return price;
}

module.exports = { feed_addresses, DECIMALS, getEthPrice };
