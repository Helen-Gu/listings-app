var EtsyAPI = require("./EtsyAPI");

function RecommendedListings() {}

RecommendedListings.getRecommendations = function(allListings, favorites) {
	if (!favorites.length) return [];

	var notAlreadyFavorite = allListings.filter(listing => !listing.is_favorite);

	var favoriteTraits = favorites.reduce(RecommendedListings.traitReducer, {
		tags: [],
		categories: [],
		taxonomies: [],
	});

	var topFour = RecommendedListings.rankListings(
		notAlreadyFavorite,
		favoriteTraits
	).slice(0, 4);

	return topFour;
};

RecommendedListings.traitReducer = function(acc, fave) {
	var foundCategory = acc.categories.find(cat => cat.id === fave.category_id);
	if (!foundCategory) {
		acc.categories.push({ id: fave.category_id, count: 1 });
	} else {
		foundCategory.count += 1;
	}

	var foundTaxonomy = acc.taxonomies.find(
		taxonomy => taxonomy.taxonomy === fave.taxonomy
	);
	if (!foundTaxonomy) {
		acc.taxonomies.push({ taxonomy: fave.taxonomy, count: 1 });
	} else {
		foundTaxonomy.count += 1;
	}

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
	var topCategories = favoriteTraits.categories
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);
	var topTags = favoriteTraits.tags
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);
	var topTaxonomies = favoriteTraits.taxonomies
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);

	return allListings.sort((a, b) => {
		var catCountA =
			(topCategories.find(cat => cat.id === a.category_id) || {}).count || 0;
		var catCountB =
			(topCategories.find(cat => cat.id === b.category_id) || {}).count || 0;
		var taxCountA =
			(topTaxonomies.find(tax => tax.taxonomy === a.taxonomy) || {}).count || 0;
		var taxCountB =
			(topTaxonomies.find(tax => tax.taxonomy === b.taxonomy) || {}).count || 0;

		var tagCountA = (topTags.filter(tag => a.tags.includes(tag)) || []).reduce(
			(acc, tag) => acc + tag.count,
			0
		);

		var tagCountB = (topTags.filter(tag => b.tags.includes(tag)) || []).reduce(
			(acc, tag) => acc + tag.count,
			0
		);

		var bRelevance = catCountB + taxCountB + tagCountB;
		var aRelevance = catCountA + taxCountA + tagCountA;

		a.relevance = aRelevance;
		b.relevance = bRelevance;
		return bRelevance - aRelevance;
	});
};

module.exports = RecommendedListings;
