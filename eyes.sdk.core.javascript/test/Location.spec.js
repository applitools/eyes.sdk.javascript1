const assert = require("assert");

const Location = require("../src/geometry/Location");

describe('Location', () => {
    const top = 1;
    const left = 2;

    // noinspection FunctionTooLongJS
    it('simple constructor', () => {
        let location = new Location(left, top);
        assert.equal(location.getX(), left, "x");
        assert.equal(location.getY(), top, "y");
    });

    it('copy constructor', () => {
        const original = new Location(left, top);
        const other = new Location(original);

        assert.equal(other.getX(), left, "x");
        assert.equal(other.getY(), top, "y");

        assert.deepEqual(original, other, "Location objects should be equal!");
        assert.notStrictEqual(original, other, "original and other should not be the same object");
    });

    it('object constructor', () => {
        const object = { x: left, y: top };
        const other = new Location(object);

        assert.equal(other.getX(), left, "x");
        assert.equal(other.getY(), top, "y");
    });

    it('equals()', () => {
        const l1 = new Location(1, 2);
        let l2 = new Location(l1);
        assert.equal(l1.equals(l2), true, "Locations should be equal!");

        // noinspection JSAccessibilityCheck
        l2 = l2.scale(2);
        assert.equal(l1.equals(l2), false, "Locations should be differ!");
    });

    it('offset()', () => {
        let location = new Location(left, top);
        location = location.offset(5, 5);
        assert.equal(location.getX(), left + 5, "x");
        assert.equal(location.getY(), top + 5, "y");
    });

    it('scale()', () => {
        let location = new Location(left, top);
        location = location.scale(2);
        assert.equal(location.getX(), left * 2, "x");
        assert.equal(location.getY(), top * 2, "y");
    });

    it('toJSON()', () => {
        const expectedSerialization = `{"x":${left},"y":${top}}`;

        let location = new Location(left, top);
        const actualSerialization = JSON.stringify(location);

        assert.strictEqual(expectedSerialization, actualSerialization, "Location serialization does not match!");
    });
});
