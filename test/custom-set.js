const { describe, it } = require('mocha');
const expect = require('chai').expect;
const { CustomSet } = require('../lib/custom-set');

describe('CustomSet', () => {
    describe('fromArray', () => {
        it('should create a custom set from array', () => {
            const mockArray = [ 1, 2, 3, 4, 5, 6 ];
            const cs = CustomSet.fromArray(mockArray);
            expect(cs instanceof CustomSet).to.equal(true);
            mockArray.forEach(val => expect(cs.has(val)).to.equal(true));
        });
    });

    describe('constructor', () => {
        it('should able to create from Set', () => {
            const mockSet = new Set([ 1, 2, 3 ]);
            const cs = new CustomSet(mockSet);
            expect(cs instanceof CustomSet).to.equal(true);
            mockSet.forEach(val => expect(cs.has(val)).to.equal(true));
        });
        it('should able to create from CustomSet', () => {
            const mockCs = new CustomSet([ 1, 2, 3 ]);
            const cs = new CustomSet(mockCs);
            expect(cs instanceof CustomSet).to.equal(true);
            mockCs.forEach(val => expect(cs.has(val)).to.equal(true));
        });
        it('should create empty set if type not support', () => {
            const mockObj = { demo: 'demo' };
            const cs = new CustomSet(mockObj);
            expect(cs instanceof CustomSet).to.equal(true);
            expect(cs.size()).to.equal(0);
        });
    });

    describe('concat', () => {
        it('should able to concat from object with forEach', () => {
            const cs1 = new CustomSet([ 1, 2, 3 ]);
            const cs2 = new CustomSet([ 4, 5 ]);
            expect(cs1.concat(cs2).size()).to.equal(5);
            const arr = [ 6, 7 ];
            expect(cs1.concat(arr).size()).to.equal(7);
            const set = new Set([ 8, 9, 0 ]);
            expect(cs1.concat(set).size()).to.equal(10);
        });
        it('should able to filter duplicated', () => {
            const cs1 = new CustomSet([ 1, 2, 3 ]);
            const arr = [ 2, 3 ];
            expect(cs1.concat(arr).size()).to.equal(3);
        });
    });

    describe('map', () => {
        it('should work like Array', () => {
            const arr = [ 1, 2 ];
            const cs = new CustomSet(arr);
            const newCs = cs.map(val => val * 2);
            arr.forEach(val => expect(newCs.has(val * 2)).to.equal(true));
        });
    });

    describe('filter', () => {
        it('should work like Array', () => {
            const arr = [ 1, 2, 3, 4 ];
            const cs = new CustomSet(arr);
            const newCs = cs.filter(val => Number.isInteger(val / 2));
            expect(newCs.size()).to.equal(2);
        });
    });

    describe('reduce', () => {
        it('should work like Array', () => {
            const arr = [ 1, 2, 3, 4 ];
            const cs = new CustomSet(arr);
            expect(cs.reduce((ret, init) => {
                ret += init;
                return ret;
            }, 0)).to.equal(10);
        })
    });

    describe('union', () => {
        it('should union 2 set', () => {
            const cs1 = new CustomSet([ 1, 2, 3 ]);
            const cs2 = new CustomSet([ 4, 5 ]);
            const cs3 = cs1.union(cs2);
            expect(cs3 instanceof CustomSet).to.equal(true);
            [ 1, 2, 3, 4, 5 ].forEach(val => expect(cs3.has(val)).to.equal(true));
        });
    });

    describe('intersection', () => {
        it('should intersection 2 set', () => {
            const cs1 = new CustomSet([ 1, 2 ]);
            const cs2 = new CustomSet([ 2, 3 ]);
            const cs3 = cs1.intersection(cs2);
            expect(cs3 instanceof CustomSet).to.equal(true);
            expect(cs3.has(1)).to.equal(false);
            expect(cs3.has(2)).to.equal(true);
            expect(cs3.has(3)).to.equal(false);
        });
    });

    describe('difference', () => {
        it('should difference 2 set', () => {
            const cs1 = new CustomSet([ 1, 2 ]);
            const cs2 = new CustomSet([ 2, 3 ]);
            const cs3 = cs1.difference(cs2);
            console.log(cs3);
            expect(cs3 instanceof CustomSet).to.equal(true);
            expect(cs3.has(1)).to.equal(true);
            expect(cs3.has(2)).to.equal(false);
            expect(cs3.has(3)).to.equal(false);
        })
    });
});
