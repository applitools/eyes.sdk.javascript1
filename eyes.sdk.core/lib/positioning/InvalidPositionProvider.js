'use strict';

const { PositionProvider } = require('./PositionProvider');

/**
 * An implementation of {@link PositionProvider} which throws an exception for every method. Can be used as a
 * placeholder until an actual implementation is set.
 */
class InvalidPositionProvider extends PositionProvider {}

exports.InvalidPositionProvider = InvalidPositionProvider;
