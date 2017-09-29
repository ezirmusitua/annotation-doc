const { describe, it } = require('mocha');
const expect = require('chai').expect;
const indexOf = require('../lib').indexOf;

describe('Index', function () {
    describe('indexOf', function () {
        it('should return position if value exist', () => {
            expect(indexOf([1, 2, 3], 1)).to.equal(0);
        });
        it('should return -1 if value not exist', () => {
            expect(indexOf([1, 2, 3], -1)).to.equal(-1);
        });
    });
});
