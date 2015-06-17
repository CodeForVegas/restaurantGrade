Steps to get going:

node import.js
// mongo console commands:
use restaurantgrade-dev
db.restaurants.createIndex( { geoloc : "2dsphere" } )
// verify geospacial query
db.restaurants.find({"geoloc":{$near:{$geometry:{type:"Point", coordinates:[-115.07877499999998, 36.097976]}, $maxDistance:1500}}})
