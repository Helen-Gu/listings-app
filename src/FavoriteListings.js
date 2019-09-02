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
};

FavoriteListings.prototype.addListing = function(listing) {
	var alreadyFavorite = this.listings.some(function(favorite) {
		return favorite.listing_id === listing.listing_id;
	});
	if (!alreadyFavorite) {
		this.listings.push(listing);
	}
};

FavoriteListings.prototype.removeListing = function(listing) {
	var foundIndex = this.listings.findIndex(
		fave => fave.listing_id === listing.listing_id
	);

	if (foundIndex > -1) this.listings.splice(foundIndex, 1);

	// you could also do:
	/* 
    this.listings = this.listings.filter(
     	fave => fave.listing_id !== listing.listing_id
     );
  */
	// but it is less efficient because it will keep checking the array after
	// the element is found
};

FavoriteListings.prototype.getFavorites = function() {
	return this.listings;
};

FavoriteListings.prototype.getSortedFavorites = function() {
	return this.listings.sort((a, b) => b.num_favorers - a.num_favorers);
};

module.exports = FavoriteListings;
