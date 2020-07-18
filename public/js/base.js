$(function() {

	$('.listing-favorite-icon').click(function() {
		$favorite_icon = $(this);
		var listing_id = $favorite_icon.data('listing-id');
		var is_favorite = $favorite_icon.hasClass('is-favorite');
  
		addFavorite(listing_id).done(function(result) {
		  $favorite_icon.addClass('is-favorite')
		});
	});
  
	function addFavorite(listing_id) {
	  return $.ajax("/favorite-listing", {
		method: "POST",
		data: {
		  listing_id: listing_id
		}
	  })
	}
  
	function removeFavorite(listing_id) {
	  return $.ajax("/favorite-listing", {
		method: "DELETE",
		data: {
		  listing_id: listing_id
		}
	  })
	}
  
  });