var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var Listing = require('../src/Listing');

var mock_listing_json = require('./mock_listing_response.json').results[0];

describe('Listing', function () {

  describe('#fromJSON', function() {
    it('should create a listing object from JSON returned from the Etsy API', function() {
      var listing = Listing.fromJSON(mock_listing_json);
      expect(listing.listing_id).to.equal(539359874);
      expect(listing.title).to.equal("Birds Wall Clock");
      expect(listing.image).to.equal("https://i.etsystatic.com/6724764/c/647/513/0/19/il/038053/1278321312/il_170x135.1278321312_3v1z.jpg");
      expect(listing.price).to.equal(34.95);
      expect(listing.currency).to.equal("USD");
      expect(listing.shop_name).to.equal("BingArt");
      expect(listing.is_favorite).to.equal(false);
    });
  });


  describe('formatPrice', function() {
    it('should format USD price correctly', function() {
      var listing = new Listing(12345, "title", "shop_name", "image", 10.00, "USD");
      expect(listing.formatPrice()).to.equal("$10.00 USD")
    });

    it('should format GBP price correctly', function() {
      var listing = new Listing(12345, "title", "shop_name", "image", 30.00, "GBP");
      expect(listing.formatPrice()).to.equal("£30.00 GBP")
    });
  });

  describe('setIsFavorite', function() {

    it('should set the listing to be a favorite', function() {
      var listing = new Listing(12345, "title", "shop_name", "image", 10.00, "USD");
      expect(listing.is_favorite).to.be.false
      listing.setIsFavorite(true);
      expect(listing.is_favorite).to.be.true
      listing.setIsFavorite(false);
      expect(listing.is_favorite).to.be.false
    });

    
  });

});