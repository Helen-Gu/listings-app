var request = require('request-promise-native');

var instance;

function EtsyAPI() {

}

EtsyAPI.getInstance = function() {
  if (!instance) {
    instance = new EtsyAPI();
  }
  return instance;
}

// For mocking http requests
EtsyAPI.setInstance = function(etsyAPI) {
  instance = etsyAPI
}

EtsyAPI.prototype.getTrendingListings = function(page) {
  return request("https://www.etsy.com/api/v2/ajax/listings/trending?includes=Images,Shop&page=" + page);
};

EtsyAPI.prototype.getListing = function(listing_id) {
  return request("https://www.etsy.com/api/v2/ajax/listings/" + listing_id + "?includes=Images,Shop");
}

module.exports = EtsyAPI;