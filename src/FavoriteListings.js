function FavoriteListings() {
	this.listings = [];
}

FavoriteListings.prototype.isListingFavorited = function (listing) {
	for (var i = 0; i < this.listings.length; i++) {
		if (this.listings[i].listing_id == listing.listing_id) {
			return true;
		}
	}
	return false;
};

FavoriteListings.prototype.addListing = function (listing) {
	const alreadyFavorited = this.listings.some((fav) => {
		return fav.listing_id === listing.listing_id;
	});
	if (!alreadyFavorited) {
		this.listings.push(listing);
	}
};

FavoriteListings.prototype.removeListing = function (listing) {
	const foundIndex = this.listings.findIndex((fav) => {
		return fav.listing_id === listing.listing_id;
	});
	if (foundIndex > -1) {
		this.listings.splice(foundIndex, 1);
	}
};

FavoriteListings.prototype.getFavorites = function () {
	return this.listings;
};

module.exports = FavoriteListings;
