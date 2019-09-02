function RecommendedListings() {}

RecommendedListings.getRecommendations = function(allListings, favorites) {
	// If the user hasn't favorited anything, the algorithm can't rank listings
	if (!favorites.length) return [];

	// Don't recommend listings the user has already favorited
	var notAlreadyFavorite = allListings.filter(listing => !listing.is_favorite);

	// Create an object that stores traits of the user's favorite listings
	// and how often those traits appeaer
	var favoriteTraits = favorites.reduce(RecommendedListings.traitReducer, {
		tags: [],
		categories: [],
		taxonomies: [],
	});

	// Get the top four listings using the ranker and the user's preferences
	var topFour = RecommendedListings.rankListings(
		notAlreadyFavorite,
		favoriteTraits
	).slice(0, 4);

	return topFour;
};

RecommendedListings.traitReducer = function(acc, fave) {
	// Tick up the category in the accumulator
	var foundCategory = acc.categories.find(cat => cat.id === fave.category_id);
	if (!foundCategory) {
		acc.categories.push({ id: fave.category_id, count: 1 });
	} else {
		foundCategory.count += 1;
	}

	// Tick up the taxonomy in the accumulator
	var foundTaxonomy = acc.taxonomies.find(
		taxonomy => taxonomy.taxonomy === fave.taxonomy
	);
	if (!foundTaxonomy) {
		acc.taxonomies.push({ taxonomy: fave.taxonomy, count: 1 });
	} else {
		foundTaxonomy.count += 1;
	}

	// Tick up each tag in the accumulator
	fave.tags.forEach(tag => {
		var foundTag = acc.tags.find(accTag => accTag.tag === tag);
		if (!foundTag) {
			acc.tags.push({ tag, count: 1 });
		} else {
			foundTag.count += 1;
		}
	});
	return acc;
};

RecommendedListings.rankListings = function(allListings, favoriteTraits) {
	// Sort each trait by the number of times it appeared in the user's favorites
	// then select the top 5
	var topCategories = favoriteTraits.categories
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);
	var topTags = favoriteTraits.tags
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);
	var topTaxonomies = favoriteTraits.taxonomies
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);

	var topTraits = {
		topCategories: topCategories,
		topTags: topTags,
		topTaxonomies: topTaxonomies,
	};
	// Now give the listings a relevance score based on the top traits
	return allListings.sort((a, b) => {
		var aRelevance = RecommendedListings.scoreListing(a, topTraits);
		var bRelevance = RecommendedListings.scoreListing(b, topTraits);
		return bRelevance - aRelevance;
	});
};

RecommendedListings.scoreListing = function(listing, traits) {
	var catCount =
		(traits.topCategories.find(cat => cat.id === listing.category_id) || {})
			.count || 0;

	var taxCount =
		(traits.topTaxonomies.find(tax => tax.taxonomy === listing.taxonomy) || {})
			.count || 0;

	var tagCount = (
		traits.topTags.filter(tag => listing.tags.includes(tag)) || []
	).reduce((acc, tag) => acc + tag.count, 0);

	return catCount + taxCount + tagCount;
};

module.exports = RecommendedListings;
