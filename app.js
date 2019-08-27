var express = require('express');
var engine = require('ejs-locals');
var bodyParser = require('body-parser');

var EtsyAPI = require('./src/EtsyAPI');
var Listing = require('./src/Listing');
var FavoriteListings = require('./src/FavoriteListings');

var app = express();

// use the ejs template engine
app.set('view engine', 'html');
app.engine('html', engine);

// serve static assets from the public directory
app.use(express.static(__dirname + '/public/'))

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Set up a single set of favorite listings
app.favoriteListings = new FavoriteListings();

/* GET the trending listings page. */
app.get('/', function(req, res, next) {
  var page = req.query.page ? req.query.page : 1;

  EtsyAPI
    .getInstance()
    .getTrendingListings(page)
    .then(function(response) {
      // if the request succedes parse the response
      var results = JSON.parse(response);

      // filter to only active listings as inactive have no images and cannot be displayed
      var listings = results.results.filter(listing => listing.state === "active");

      // Create listing objects from the raw json
      listings = listings.map(Listing.fromJSON);

      // render the trending listings page with pagination
      res.render('index', {
        is_trending_listings_page: true,
        listings: listings,
        pages: Math.ceil(results.count/results.params.limit),
        current_page: page
      });
    })
    .catch(function(err) {
      // render an error page if the request fails
      console.log(err);
      res.render({status: "error", error: err});
    });

});

/* GET the trending listings page. */
app.get('/favorites', function(req, res, next) {
  var listings = app.favoriteListings.getFavorites();

  for (var i = 0; i < listings.length; i++) {
    listings[0].setIsFavorite(true);
  }

  res.render('favorites', {
    is_favorite_listings_page: true,
    listings: listings
  });
});

/* POST a new listing into favorites */
app.post('/favorite-listing', function(req, res, next) {
  var listing_id = req.body.listing_id

  EtsyAPI
    .getInstance()
    .getListing(listing_id)
    .then(function(response) {
      var results = JSON.parse(response);
      var listing = Listing.fromJSON(results.results[0])
      app.favoriteListings.addListing(listing)
      res.json({status: "success"});
    })
    .catch(function(err) {
      // render an error page if the request fails
      console.log(err);
      res.json({status: "error", error: err});
    });
});

/* DELETE a listing from favorites */
app.delete('/favorite-listing', function(req, res, next) {
  var listing_id = req.body.listing_id

  EtsyAPI
    .getInstance()
    .getListing(listing_id)
    .then(function(response) {
      // TODO: remove the listing
      res.json({status: "success"});
    })
    .catch(function(err) {
      // render an error page if the request fails
      console.log(err);
      res.json({status: "error", error: err});
    });
});

module.exports = app;
