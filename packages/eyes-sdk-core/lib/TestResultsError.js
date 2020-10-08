const TestResults = require('./TestResults')

class TestResultsError extends TestResults {
  constructor({name, error}) {
    super({name})
    this.isError = true
    this.error = error
  }
}

module.exports = TestResultsError
