var Currency = require('./currency_module');
var canadianDollar = 0.91;
var currency = new Currency(canadianDollar);
console.log(currency.canadianToUS(50));