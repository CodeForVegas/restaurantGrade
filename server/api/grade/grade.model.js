'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GradeSchema = new Schema({
  "permit_id" : Number,
  "permit_number" : String,
  "restaurant_name" : String,
  "address" : String,
  "latitude" : Number,
  "longitude" : Number,
  "city_name" : String,
  "state" : String,
  "zip_code" : Number,
  "current_grade" : String,
  "date_current" : Date,
  "demerits" : Number,
  "category_name" : String,
  "prev_insp" : Array,
  "violations" : String,
  insp_type : String,
  geoloc : {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  }
});

// Schema.index({ geoloc : '2dsphere' });
module.exports = mongoose.model('Grade', GradeSchema, 'restaurants');

/* SAMPLE DATA
{
  "permit_id" : "0015317",
  "permit_number" : "PR0015317",
  "restaurant_name" : "LA PALMA MARKET - SNACK BAR",
  "address" : "6700 W Charleston Blvd F",
  "latitude" : "36.15952700",
  "longitude" : "-115.24271400",
  "city_name" : "Las Vegas",
  "state" : "NV",
  "zip_code" : "89146-9008",
  "current_grade" : "A",
  "date_current" : "2015-06-09 00:00:00",
  "demerits" : "8",
  "category_name" : "Snack Bar",
  "prev_insp" : [
    { "inspection_id" : "DA1504041",
      "permit_id" : "PR0015317",
      "inspection_date" : "2015-05-05 00:00:00",
      "fixed_date" : "5/5/2015",
      "inspection_time" : "2015-05-05 11:10:00",
      "inspection_demerits" : "28",
      "inspection_grade" : "C",
      "violations" : "202,209,211,215,217,218,2912,2928,2930,2955,2956",
      "permit_status" : null,
      "inspection_type" : "Routine Inspection" }
  ],
  "violations" : "209,217",
  "insp_type" : "Re-inspection",
  "geoloc" : {
    "type" : "Point",
    "coordinates" : [  -115.242714,  36.159527 ]
  },
  "_id" : ObjectId("557bb7d6b07ce74f49580689")
}
*/
