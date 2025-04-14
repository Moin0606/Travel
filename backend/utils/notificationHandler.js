const io = require('../socket');

exports.emitNotification = (userId, type, data) => {
  io.to(userId.toString()).emit('notification', { type, ...data });
};