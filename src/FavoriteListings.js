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
	var found = false;
	var i = 0;

	while (!found && i < this.listings.length) {
		if (this.listings[i].listing_id === listing.listing_id) {
			found = true;
			this.listings.splice(i, 1);
		}
		i++;
	}
};

FavoriteListings.prototype.getFavorites = function() {
	return this.listings;
};

module.exports = FavoriteListings;
