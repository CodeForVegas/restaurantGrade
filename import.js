/**
 * Created by adame on 6/6/15.
 */

var request = require('request'),
    mongo = require('mongodb'),
    //init = require('./config/init')(),
    config = require('./server/config/environment/development'), // Static on dev DB
    MongoClient = require('mongodb').MongoClient;

MongoClient.connect(config.mongo.uri, function(err, db) {
    var collection = db.collection('restaurants'),
        skip = 0,
        limit = 100,
        removeRestaurants,
        processNextSet;

    removeRestaurants = function (callback) {
        console.log('Removing restaurant records');
        collection.remove({}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('Removed ' + result.result.n + ' records');
                callback();
            }
        });
    };

    processNextSet = function (done) {
        request.get(
            'http://southernnevadahealthdistrict.org/restaurants/stores/restaurants.php?start=' + skip + '&limit=' + limit,
            function (err, httpResponse, body) {
                var parts = body.match(/\{total:.*,restaurants:(.*)\}/),
                    restaurants = JSON.parse(parts[1]);

                restaurants.forEach(function (current, index, array) {
                    if (current['longitude'] && current['latitude']) {
                        current['geoloc'] = { type: 'Point', coordinates: [ parseFloat(current['longitude']), parseFloat(current['latitude']) ] };
                        array[index] = current;
                        }
                });
                console.log('Found ' + restaurants.length + ' records starting with ' + skip);
                if (restaurants.length > 0) {
                    collection.insert(restaurants, function (err, result) {
                        if (err) {
                            console.error(err);
                            done();
                        } else {
                            console.log('Added ' + result.result.n + ' records');
                            skip = skip + limit;
                            processNextSet(done);
                        }
                    });
                } else {
                    done()
                }
            });
    };

    if (err) {
        console.log(err);
    } else {
        removeRestaurants(function () {
            processNextSet(function () {
                db.close();
            });
        });

    }
});
