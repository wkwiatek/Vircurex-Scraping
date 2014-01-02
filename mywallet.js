var request = require('request');
var cheerio = require('cheerio');

var url = 'https://vircurex.com';
var mywallet = {
	'BTC': 0.00000197,
	'IXC': 23.70000001,
	'LTC': 4.99,
	'NMC': 5.0,
	'PPC': 5.0
}
var startingValueInBTC = 0.2;
var startingValueInUSD = 170;

console.log('Scraping ' + url +' in progress...');
makeRequest();
setInterval(makeRequest, 300000);

function makeRequest(){
	var valueInBTC = 0;	

	console.log('\nData from ' + new Date() + ':');

	request(url, function(err, resp, body) {
		if (err)
			throw err;
		$ = cheerio.load(body);
		for(currency in mywallet){
			if(currency === 'BTC'){
				valueInBTC += mywallet[currency];
			}
			else {
				var currentCurrencyInBTC = parseFloat($('#balance_box').find('#' + currency + '_BTC_bid').text())*mywallet[currency];
				valueInBTC += currentCurrencyInBTC;
				console.log('Your ' + currency + ' is now worth: ' + currentCurrencyInBTC + ' BTC');
			}
		}

		valueInUSD = parseFloat($('#balance_box').find('#BTC_USD_bid').text())*valueInBTC;
		console.log('\nSummary of your wallet:\t' + valueInBTC + ' BTC');
		console.log('which is exactly:\t' + valueInUSD + ' USD\n');

		var percent = (startingValueInUSD - valueInUSD)/startingValueInUSD * 100;
		var percentageGain = valueInUSD - startingValueInUSD;
		console.log('It is currently: ' + percentageGain + '%\n');
	});
}