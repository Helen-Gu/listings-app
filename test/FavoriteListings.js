var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(chaiHttp);

var mock_listing_json = require('./mock_listing_response.json').results[0];
var Listing = require('../src/Listing');
var FavoriteListings = require('../src/FavoriteListings');

describe('FavoriteListings', function () {

  beforeEach(function() {
    this.listing = new Listing(mock_listing_json);
    this.favoriteListings = new FavoriteListings();
  })

  describe('isListingFavorited', function() {
    it('returns false when the listing is not favorited', function() {
      expect(this.favoriteListings.isListingFavorited(this.listing)).to.be.false;
    });

    it('returns true when the listing is favorited', function() {
      this.favoriteListings.addListing(this.listing);
      expect(this.favoriteListings.isListingFavorited(this.listing)).to.be.true;
    });
  });

  describe('addListing', function() {
    it('adds a listing to favorites', function() {
      this.favoriteListings.addListing(this.listing);
      expect(this.favoriteListings.getFavorites().length).to.equal(1);
    });

    it('only adds a listing to favorites once', function() {
      this.favoriteListings.addListing(this.listing);
      this.favoriteListings.addListing(this.listing);
      expect(this.favoriteListings.getFavorites().length).to.equal(1);
    });
  });

  describe('removeListing', function() {
    it('removes a listing from favorites', function() {
      this.favoriteListings.addListing(this.listing);
      this.favoriteListings.removeListing(this.listing);
      expect(this.favoriteListings.getFavorites().length).to.equal(0);
    });
  });

  describe('getFavorites', function() {
    it('returns favorited listings', function() {
      this.favoriteListings.addListing(this.listing);
      expect(this.favoriteListings.getFavorites()).to.deep.equal([this.listing]);
    })
  });

});