/* export per function
var canadianDollar = 0.91;
function roundToDecimal(amount){
	return Math.round(amount * 100)/100;
}
exports.canadianToUS = function(canadian){
	return roundToDecimal(canadian * canadianDollar);
}
exports.UStocanadian = function(us){
	return roundToDecimal(us / canadianDollar);
}
*/
//exports in one step
var Currency = function(canadianDollar){
	this.canadianDollar = canadianDollar;
}
Currency.prototype.roundToDecimal = function(amount){
	return Math.round(amount * 100) / 100;
};
Currency.prototype.canadianToUS = function(canadian){
	return this.roundToDecimal(this.canadianDollar * canadian);
};
Currency.prototype.UStocanadian = function(us){
	return this.roundToDecimal(us / this.canadianDollar);
};
module.exports = Currency;