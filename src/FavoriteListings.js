function FavoriteListings() {
	this.listings = [];
  }
  
  FavoriteListings.prototype.isListingFavorited = function(listing) {
	for (var i = 0; i < this.listings.length; i++) {
	  if (this.listings[i].listing_id == listing.listing_id) {
		return true;
	  }
	}
	return false;
  }
  
  FavoriteListings.prototype.addListing = function(listing) {
	this.listings.push(listing);
  };
  
  FavoriteListings.prototype.removeListing = function(listing) {
  
  };
  
  FavoriteListings.prototype.getFavorites = function() {
	return this.listings;
  }
  
  module.exports = FavoriteListings; 