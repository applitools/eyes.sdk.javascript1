'use strict';

const { GeneralUtils } = require('@applitools/eyes.sdk.core');

/**
 * Collection of utility methods.
 */
class TestUtils {
  /**
   * Generates the cartesian product of the sets.
   *
   * @param {...(Array|Object)} sets - variable number of sets of n elements.
   * @return {Generator} yields each product as an array
   */
  static* cartesianProduct(...sets) {
    const data = [];

    function* cartesianUtil(index) {
      if (index === sets.length) {
        return yield data.slice();
      }

      if (!GeneralUtils.isArray(sets[index])) {
        data[index] = sets[index];
        yield* cartesianUtil(index + 1);
      } else {
        for (let i = 0; i < sets[index].length; i += 1) {
          data[index] = sets[index][i];
          yield* cartesianUtil(index + 1);
        }
      }
    }

    yield* cartesianUtil(0);
  }
}

exports.TestUtils = TestUtils;
