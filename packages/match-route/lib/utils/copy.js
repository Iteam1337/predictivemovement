const { deserialize, serialize } = require('v8')

module.exports = object => deserialize(serialize(object))
