/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Grade = require('./grade.model');

exports.register = function(socket) {
  Grade.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Grade.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('grade:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('grade:remove', doc);
}