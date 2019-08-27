var chai = require('chai');
var chaiHttp = require('chai-http');
var cheerio = require('cheerio');
var expect = chai.expect;
chai.use(chaiHttp);

var app = require('../app');
var EtsyAPI = require('../src/EtsyAPI');

var fakeEtsyAPI = {
  getTrendingListings: function(page) {
    return Promise.resolve(JSON.stringify(require('./mock_trending_response.json')));
  },

  getListing: function(listing_id) {
    listing = require('./mock_trending_response.json').results.find(function(listing) {
      return listing.listing_id === listing_id
    });

    return Promise.resolve(JSON.stringify(
      {
        "count": 1,
        "results": [ listing ]
      }
    ));
  }
}
EtsyAPI.setInstance(fakeEtsyAPI);

chai.use(chaiHttp);

describe('app', function() {

  describe('Trending listings page', function() {
    it('it should load the trending listings page', async function() {
      var res = await chai.request(app).get('/')

      // Check that the request succeeded 
      expect(res.status).to.equal(200);

      // parse the response into a jquery-like wrapper
      var $ = cheerio.load(res.text);

      // Check that there are listing cards on the page
      expect($('.listing-card').length).to.equal(15);
    });

    it('it should render a listing card correctly', async function() {
      var res = await chai.request(app).get('/')

      // Check that the request succeeded 
      expect(res.status).to.equal(200);

      // parse the response into a jquery-like wrapper
      var $ = cheerio.load(res.text);

      // Check that the listing card has a price
      expect($('.listing-card .listing-price').first().text().trim())
        .to.equal("€33.90 EUR");

      // Check that the listing card has an image
      expect($('.listing-card img').first().attr('src'))
        .to.equal("https://i.etsystatic.com/5260888/c/406/322/251/97/il/2a62b0/1149247637/il_170x135.1149247637_3i1h.jpg");

      // Check that the listing card has a title
      expect($('.listing-card .listing-title').first().text().trim())
        .to.equal("Watercolor Brush");

      // Check that the listing card has a title
      expect($('.listing-card .shop-name').first().text().trim())
        .to.equal("JeannieDickson");
      
      // Check that the listing card has a title
      expect($('.listing-card .listing-favorite-icon').first().data('listing-id'))
        .to.equal(484595996);

    });

    it('it should switch between pages of trending lisitngs', async function() {
      var res = await chai.request(app).get('/')

      // Check that the request succeeded 
      expect(res.status).to.equal(200);

      // parse the response into a jquery-like wrapper
      var $ = cheerio.load(res.text);

      // Check that the first page is the current page
      expect($('.pagination-link.is-current').data('page')).to.equal(1);

      // load the second page of listings
      var res = await chai.request(app).get('/?page=2')

      // Check that the request succeeded 
      expect(res.status).to.equal(200);

      // parse the response into a jquery-like wrapper
      var $ = cheerio.load(res.text);

      // Check that the second page is the current page
      expect($('.pagination-link.is-current').data('page')).to.equal(2);
    });
  });


  describe('Favoriting listings', async function() {
    it('it favorites a listing', async function() {
      var res = await chai.request(app)
        .post('/favorite-listing')
        .send({ listing_id: 539359874 })

      // Check that the request succeeded 
      expect(res.status).to.equal(200);

      var favorites = app.favoriteListings.getFavorites();
      expect(favorites.length).to.equal(1);
      expect(favorites[0].listing_id).to.equal(539359874);

      // parse the response into a jquery-like wrapper
      var $ = cheerio.load(res.text);
    });

    it('does not favorite a listing more than once', async function() {
      var res = await chai.request(app)
        .post('/favorite-listing')
        .send({ listing_id: 539359874 })

      // Check that the request succeeded 
      expect(res.status).to.equal(200);

      var favorites = app.favoriteListings.getFavorites();
      expect(favorites.length).to.equal(1);
      expect(favorites[0].listing_id).to.equal(539359874);
    });

    it('loads trending listings after favoriting and displays the listing as favorited', async function(){
      var res = await chai.request(app).get('/')

      // Check that the request succeeded 
      expect(res.status).to.equal(200);
    
      // parse the response into a jquery-like wrapper
      var $ = cheerio.load(res.text);

      expect($('.listing-card .listing-favorite-icon[data-listing-id=539359874]').first().hasClass('is-favorite')).to.be.true
    });
  });


  describe('Favorite listing page', async function() {
    it('it displays the favorite listing page', async function() {
      var res = await chai.request(app).get('/favorites')

      // Check that the request succeeded 
      expect(res.status).to.equal(200);

      // parse the response into a jquery-like wrapper
      var $ = cheerio.load(res.text);

      // Check that there are listing cards on the page
      expect($('.listing-card').length).to.equal(1);

      // Check that the correct listing was favorited
      expect($('.listing-card .listing-favorite-icon').first().data('listing-id'))
        .to.equal(539359874);
    });

    it('it shows all listings on the favorite listings page as favorited', async function() {
      var res = await chai.request(app)
        .post('/favorite-listing')
        .send({ listing_id: 484595996 })

        // Check that the request succeeded 
        expect(res.status).to.equal(200);

        var res = await chai.request(app).get('/favorites')

        // Check that the request succeeded 
        expect(res.status).to.equal(200);

        // parse the response into a jquery-like wrapper
        var $ = cheerio.load(res.text);

        // Check that there are listing cards on the page
        expect($('.listing-card').length).to.equal(2);

        // Check that they are all favorited
        expect($('.listing-card .listing-favorite-icon.is-favorite').length).to.equal(2);
    });

    it('orders listings by the number of favoriters', async function() {
      var res = await chai.request(app).get('/favorites')

        // Check that the request succeeded 
        expect(res.status).to.equal(200);

        // parse the response into a jquery-like wrapper
        var $ = cheerio.load(res.text);

        // Check that there are listing cards on the page
        expect($('.listing-card').length).to.equal(2);

        // Check that the cards are in the right order
        expect($('.listing-card .listing-favorite-icon').first().data('listing-id')).to.equal(484595996);
        expect($('.listing-card .listing-favorite-icon').last().data('listing-id')).to.equal(539359874);
    })
  });

  describe('Un-favoriting listings', async function() {
    it('it unfavorites a listing', async function() {
      var res = await chai.request(app)
        .delete('/favorite-listing')
        .send({ listing_id: 539359874 })

      // Check that the request succeeded 
      expect(res.status).to.equal(200);

      var favorites = app.favoriteListings.getFavorites();
      expect(favorites.length).to.equal(1);
    });
  });

});