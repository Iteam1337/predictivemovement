const WizardScene = require('telegraf/scenes/wizard')
const handlers = require('./handlers')

const freightslip = new WizardScene('freightslip', ...handlers)

module.exports = freightslip
