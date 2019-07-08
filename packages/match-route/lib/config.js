const config = require('@iteam/config')({
  file: `${__dirname}/../config.json`,
  defaults: {
    port: 3030,
  },
})

module.exports = {
  port: config.get('port'),
}
