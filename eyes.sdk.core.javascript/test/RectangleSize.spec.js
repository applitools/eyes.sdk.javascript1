const assert = require("assert");

const RectangleSize = require("../src/geometry/RectangleSize");

describe('RectangleSize', () => {
    const width = 4;
    const height = 5;

    // noinspection FunctionTooLongJS
    it('simple constructor', () => {
        let size = new RectangleSize(width, height);
        assert.equal(size.getWidth(), width, "width");
        assert.equal(size.getHeight(), height, "height");
    });

    it('copy constructor', () => {
        const original = new RectangleSize(width, height);
        const other = new RectangleSize(original);

        assert.equal(other.getWidth(), width, "width");
        assert.equal(other.getHeight(), height, "height");

        assert.deepEqual(original, other, "RectangleSize objects should be equal!");
        assert.notStrictEqual(original, other, "original and other should not be the same object");
    });

    it('object constructor', () => {
        const object = { width: width, height: height };
        const other = new RectangleSize(object);

        assert.equal(other.getWidth(), width, "width");
        assert.equal(other.getHeight(), height, "height");
    });

    it('parse()', () => {
        const string = `${width}x${height}`;
        const other = RectangleSize.parse(string);

        assert.equal(other.getWidth(), width, "width");
        assert.equal(other.getHeight(), height, "height");
    });

    it('equals()', () => {
        const l1 = new RectangleSize(1, 2);
        let l2 = new RectangleSize(l1);
        assert.equal(l1.equals(l2), true, "RectangleSizes should be equal!");

        // noinspection JSAccessibilityCheck
        l2 = l2.scale(2);
        assert.equal(l1.equals(l2), false, "RectangleSizes should be differ!");
    });

    it('scale()', () => {
        let size = new RectangleSize(width, height);
        size = size.scale(2);
        assert.equal(size.getWidth(), width * 2, "width");
        assert.equal(size.getHeight(), height * 2, "height");
    });

    it('toJSON()', () => {
        const expectedSerialization = `{"width":${width},"height":${height}}`;

        let size = new RectangleSize(width, height);
        const actualSerialization = JSON.stringify(size);

        assert.strictEqual(expectedSerialization, actualSerialization, "RectangleSize serialization does not match!");
    });
});
