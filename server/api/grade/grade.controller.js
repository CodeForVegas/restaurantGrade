'use strict';

var _ = require('lodash');
var Grade = require('./grade.model');

// Get list of grades
exports.index = function(req, res) {
  Grade.find(function (err, grades) {
    if(err) { return handleError(res, err); }
    return res.json(200, grades);
  });
};

// Query for geolocation
exports.near = function(req, res) {
  Grade.find({
    geoloc:{
      $near:{
        $geometry:{
          type: "Point",
          coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
        },
        $maxDistance: parseInt(req.body.rad)
      }
    }
  },
  function(err, grades){
    if(err) { return handleError(res, err); }
    return res.json(200, grades);
  });
};

// db.restaurants.find({"geoloc":{$near:{$geometry:{type:"Point", coordinates:[-115.07877499999998, 36.097976]}, $maxDistance:1500}}})

// Get a single grade
exports.show = function(req, res) {
  Grade.findById(req.params.id, function (err, grade) {
    if(err) { return handleError(res, err); }
    if(!grade) { return res.send(404); }
    return res.json(grade);
  });
};

// Creates a new grade in the DB.
exports.create = function(req, res) {
  Grade.create(req.body, function(err, grade) {
    if(err) { return handleError(res, err); }
    return res.json(201, grade);
  });
};

// Updates an existing grade in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Grade.findById(req.params.id, function (err, grade) {
    if (err) { return handleError(res, err); }
    if(!grade) { return res.send(404); }
    var updated = _.merge(grade, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, grade);
    });
  });
};

// Deletes a grade from the DB.
exports.destroy = function(req, res) {
  Grade.findById(req.params.id, function (err, grade) {
    if(err) { return handleError(res, err); }
    if(!grade) { return res.send(404); }
    grade.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
