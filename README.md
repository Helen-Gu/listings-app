
### Your Challenge
Imagine that Etsy is building a new tool to let our users view and favorite trending listings. We plan on leveraging the Etsy developer API to fetch data for real listings on the site and tracks which listings are favorited.  


### Starting the app and running tests
Go to "Run" > "Install" in the IDE below to install Node and Express
Go to "Run" > "Run Server" to run the application. You will need to do this whenever you want to view changes you’ve made to your app. You can click "Preview App" to view the application.
Go to "Run" > "Test" to run the tests


### Tasks
There are a few problems with the existing app that we'll need to fix before we can launch the site.


#### 1. Correctly format prices and currencies.
Etsy supports sellers in many countries so it's important to show buyers what the currency of the item they're purchasing is. Currencies should be formatted as such:

`{currency symbol}{monetary value} {currency code}`

Consider Canadian dollars, which use the same currency symbol as USD but a different currency code. 10 Canadian dollars would be represented as:

`$10.00 CAD`

Open the tests for Listing.js to see more examples of how currencies should be formatted.


#### 2. Fix the double favoriting bug.
If you favorite the same listing twice on the "Trending listings" page it shows up twice on the "Favorite listings" page. This isn't right, we only want listings to show up once on the favorite listings page. There are some tests for FavoriteListings.js that check that listings can only be favorited once.


#### 3. Fix the bug where only the first listing on the favorites page appears favorited.
Add a few items to your favorites and then go to the "Favorite listings" page. You'll see only one listing is favorited. Every listing on the favorite listings page should appear favorited.


#### 4. When reloading the page, make sure favorited listings are displayed correctly.
If you favorite a listing and reload the page, it appears unfavorited. Make sure the favorite button appears active (the heart is red) when you reload the page.


#### 5. Make it possible to un-favorite listings.
Once a listing is added to favorites it should be possible to be unfavorited. Make sure a DELETE request is sent to /favorite-listing when the favorite button is clicked and the tests for FavoriteListings.js pass.


#### 6. Sort favorited listings from most to least favorited
Sort the listings on the favorite listings page such that the listings that were favorited by the most other viewers come first. For example a listing that said “Favorited by 99 viewers” should come before a listing that says “Favorited by 5 viewers”.

### Docs


This application is written in Node and Express, but we don't expect you to have experience writing Javascript. We're assessing you on your ability to solve problems and make changes to a codebase that's not your own!

If you're stuck, we recommend looking at the documentation:

Node JS, the language the app is written in
https://nodejs.org/api/

Express, the web framework
https://expressjs.com/en/api.html

Chai, the assertion library used in tests
https://www.chaijs.com/api/bdd/

You can also use online resources (Stack Overflow, Google, etc) as you'd like.