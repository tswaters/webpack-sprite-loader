
'use strict'

const loaderUtils = require('loader-utils')

module.exports = function () {
  const result = loaderUtils.parseQuery(this.query)
  return `module.exports = ${JSON.stringify(result)}`
}
