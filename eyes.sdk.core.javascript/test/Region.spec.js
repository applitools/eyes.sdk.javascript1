const assert = require("assert");

const RectangleSize = require("../src/geometry/RectangleSize");
const Location = require("../src/geometry/Location");
const Region = require("../src/geometry/Region");

describe('Region', () => {
    const top = 1;
    const left = 2;
    const width = 3;
    const height = 4;

    // noinspection FunctionTooLongJS
    it('simple constructor', () => {
        let region = new Region(left, top, width, height);
        assert.equal(region.getLeft(), left, "left");
        assert.equal(region.getTop(), top, "top");
        assert.equal(region.getWidth(), width, "width");
        assert.equal(region.getHeight(), height, "height");

        // This should still be ok
        // noinspection JSUnusedAssignment
        region = new Region(1, 2, 0, 0);

        // Making sure negative positions are valid.
        try {
            // noinspection JSUnusedAssignment
            region = new Region(-1, 2, 3, 4);
        } catch (ignore) {
            assert.fail("Left can be <= 0");
        }

        try {
            // noinspection JSUnusedAssignment
            region = new Region(1, -2, 3, 4);
        } catch (ignore) {
            assert.fail("Top can be <= 0");
        }

        // noinspection EmptyCatchBlockJS
        try {
            // noinspection JSUnusedAssignment
            region = new Region(1, 2, -1, 0);
            assert.fail("Width must be >=0");
        } catch (ignore) {}

        // noinspection EmptyCatchBlockJS
        try {
            // noinspection JSUnusedAssignment
            region = new Region(1, 2, 3, -1);
            assert.fail("Height must be >=0");
        } catch (ignore) {}

        // noinspection EmptyCatchBlockJS
        try {
            // noinspection JSUnusedAssignment
            region = new Region(null, new RectangleSize(3, 4));
            assert.fail("Location must not be null!");
        } catch (ignore) {}

        // noinspection EmptyCatchBlockJS
        try {
            // noinspection JSUnusedAssignment
            region = new Region(new Location(1, 2), null);
            assert.fail("Size must not be null!");
        } catch (ignore) {}

        // noinspection EmptyCatchBlockJS
        try {
            // noinspection JSUnusedAssignment
            region = new Region(null, null);
            assert.fail("Location and size must not be null!");
        } catch (ignore) {}
    });

    it('copy constructor', () => {
        const original = new Region(left, top, width, height);
        const other = new Region(original);

        assert.equal(original.getLeft(), other.getLeft(), "left");
        assert.equal(original.getTop(), other.getTop(), "top");
        assert.equal(original.getWidth(), other.getWidth(), "width");
        assert.equal(original.getHeight(), other.getHeight(), "height");

        assert.deepEqual(original, other, "Region objects should be equal!");
        assert.notStrictEqual(original, other, "original and other should not be the same object");
    });

    it('object constructor', () => {
        const object = { left: left, top: top, width: width, height: height };
        const other = new Region(object);

        assert.equal(object.left, other.getLeft(), "left");
        assert.equal(object.top, other.getTop(), "top");
        assert.equal(object.width, other.getWidth(), "width");
        assert.equal(object.height, other.getHeight(), "height");
    });

    it('location and size constructor', () => {
        const original = new Region(left, top, width, height);
        const other = new Region(new Location(left, top), new RectangleSize(width, height));

        assert.equal(original.getLeft(), other.getLeft(), "left");
        assert.equal(original.getTop(), other.getTop(), "top");
        assert.equal(original.getWidth(), other.getWidth(), "width");
        assert.equal(original.getHeight(), other.getHeight(), "height");

        assert.deepEqual(original, other, "Region objects should be equal!");
        assert.notStrictEqual(original, other, "original and other should not be the same object");
    });

    it('getLocation()', () => {
        const region = new Region(left, top, width, height);
        assert.deepEqual(region.getLocation(), new Location(left, top), "invalid location");

        region.setLocation(new Location(5, 6));
        assert.deepEqual(region.getLocation(), new Location(5, 6), "invalid location");
    });

    it('getSize()', () => {
        const region = new Region(left, top, width, height);
        assert.deepEqual(region.getSize(), new RectangleSize(width, height), "invalid location");

        region.setSize(new RectangleSize(5, 6));
        assert.deepEqual(region.getSize(), new RectangleSize(5, 6), "invalid location");
    });

    it('equals()', () => {
        const r1 = new Region(1, 2, 3, 4);
        const r2 = new Region(r1);
        assert.equal(r1.equals(r2), true, "Regions should be equal!");

        // noinspection JSAccessibilityCheck
        r2.makeEmpty();
        assert.equal(r1.equals(r2), false, "Regions should be differ!");
    });

    it('getMiddleOffset()', () => {
        const region = new Region(1, 1, 10, 20);
        const middleOffset = region.getMiddleOffset();
        assert.equal(5, middleOffset.getX(), "X middle is not correct!");
        assert.equal(10, middleOffset.getY(), "Y middle is not correct!");
    });

    it('getSubRegions()', () => {
        const region = new Region(1, 1, 10, 10);
        const expectedSubRegions = [
            new Region(1, 1, 7, 5),
            new Region(8, 1, 3, 5),
            new Region(1, 6, 7, 5),
            new Region(8, 6, 3, 5)
        ];

        assert.deepEqual(region.getSubRegions(new RectangleSize(7, 5)), expectedSubRegions);
    });

    it('contains()', () => {
        const region = new Region(1, 1, 10, 10);
        const containedRegion = new Region(2, 2, 5, 5);
        const outsideRegion = new Region(8, 5, 5, 5);
        const containedLocation = new Location(2, 5);
        const outsideLocation = new Location(20, 5);

        assert.equal(region.contains(containedRegion), true, "region contains containedRegion");
        assert.equal(region.contains(outsideRegion), false, "region doesn't contain region");
        assert.equal(region.contains(containedLocation), true, "region contains containedLocation");
        assert.equal(region.contains(outsideLocation), false, "region doesn't contain location");
    });

    it('intersect()', () => {
        const l1 = new Location(10, 10);
        const l2 = new Location(20, 30);
        const s1 = new RectangleSize(50, 100);
        const s2 = new RectangleSize(100, 50);

        const region1 = new Region(l1, s1);
        const region2 = new Region(l2, s2);

        region1.intersect(region2);
        assert.equal(20, region1.getLeft(), "intersected x");
        assert.equal(30, region1.getTop(), "intersected y");
        assert.equal(40, region1.getWidth(), "intersected width");
        assert.equal(50, region1.getHeight(), "intersected height");

        // Regions which don't intersect should return an empty region.
        region2.intersect(new Region(5, 5, 10, 10));
        assert.deepEqual(region2, Region.EMPTY, "no overlap");
    });

    it('toJSON()', () => {
        const expectedSerialization = `{"left":${left},"top":${top},"width":${width},"height":${height}}`;

        const region = new Region(left, top, width, height);
        const actualSerialization = JSON.stringify(region);

        assert.strictEqual(expectedSerialization, actualSerialization, "Region serialization does not match!");
    });
});
