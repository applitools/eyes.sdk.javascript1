import * as utils from '@applitools/utils'
import {TestResultsStatusEnum} from '../enums/TestResultsStatus'
import {TestFailedError} from '../errors/TestFailedError'
import {TestResults} from './TestResults'
import {TestResultContainer, TestResultContainerData} from './TestResultContainer'

export type TestResultsSummary = Iterable<TestResultContainer>

export class TestResultsSummaryData implements TestResultsSummary {
  private _results: TestResultContainerData[] = []
  private _passed = 0
  private _unresolved = 0
  private _failed = 0
  private _exceptions = 0
  private _mismatches = 0
  private _missing = 0
  private _matches = 0

  /** @internal */
  constructor(results: (TestResults | TestResultContainer | Error)[]) {
    for (const result of results) {
      let container
      if (utils.types.has(result, ['testResults', 'exception'])) {
        container = new TestResultContainerData(result)
      } else if (result instanceof TestFailedError) {
        container = new TestResultContainerData({testResults: result.testResults, exception: result})
      } else if (result instanceof Error) {
        container = new TestResultContainerData({testResults: null, exception: result})
      } else {
        container = new TestResultContainerData({testResults: result, exception: null})
      }

      this._results.push(container)

      if (container.exception) this._exceptions += 1

      if (container.testResults) {
        if (container.testResults.status) {
          if (container.testResults.status === TestResultsStatusEnum.Failed) this._failed += 1
          else if (container.testResults.status === TestResultsStatusEnum.Passed) this._passed += 1
          else if (container.testResults.status === TestResultsStatusEnum.Unresolved) this._unresolved += 1
        }

        this._matches += container.testResults.matches
        this._missing += container.testResults.missing
        this._mismatches += container.testResults.mismatches
      }
    }
  }

  getAllResults(): TestResultContainerData[] {
    return this._results
  }

  [Symbol.iterator](): Iterator<TestResultContainerData> {
    return this._results[Symbol.iterator]()
  }

  /** @internal */
  toObject(): TestResultsSummary {
    return this._results
  }

  /** @internal */
  toJSON(): Array<TestResultContainer> {
    return this._results.map(container => utils.general.toJSON(container))
  }

  /** @internal */
  toString() {
    return (
      'result summary {' +
      '\n\tpassed=' +
      this._passed +
      '\n\tunresolved=' +
      this._unresolved +
      '\n\tfailed=' +
      this._failed +
      '\n\texceptions=' +
      this._exceptions +
      '\n\tmismatches=' +
      this._mismatches +
      '\n\tmissing=' +
      this._missing +
      '\n\tmatches=' +
      this._matches +
      '\n}'
    )
  }
}
