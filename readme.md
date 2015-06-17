<h2>Steps to get going:</h2>

node import.js<br/>
// mongo console commands:<br/>
use restaurantgrade-dev<br/>
db.restaurants.createIndex( { geoloc \: "2dsphere\" } ) <br>
// verify geospacial query<br/>
db.restaurants.find({"geoloc":{$near:{$geometry:{type:"Point", coordinates:[-115.07877499999998, 36.097976]}, $maxDistance:1500}}})<br/>
