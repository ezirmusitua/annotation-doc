class CustomSet {
    constructor (initValue) {
        if (initValue instanceof Set) {
            this.set = new Set(initValue);
        } else if (Array.isArray(initValue)) {
            this.set = new Set(initValue);
        } else if (initValue instanceof CustomSet) {
            this.set = new Set(initValue.set);
        } else {
            this.set = new Set();
        }
    }

    add (val) {
        return this.set.add(val);
    }

    concat (setLike) {
        setLike.forEach(item => this.add(item));
        return this;
    }

    size () {
        return this.set.size;
    }

    clear () {
        return this.set.clear();
    }

    has (val) {
        return this.set.has(val);
    }

    delete (val) {
        return this.set.delete(val);
    }

    keys () {
        return this.set.keys();
    }

    values () {
        return this.set.values();
    }

    entries () {
        return this.set.entries();
    }

    forEach (cb) {
        return this.set.forEach(cb);
    }

    map (cbOrEx) {
        let mapFunc = cbOrEx;
        if (typeof cbOrEx !== 'function') {
            mapFunc = (item) => !!item[ cbOrEx ];
        }
        const ret = new CustomSet();
        this.forEach(item => ret.add(mapFunc(item)));
        return ret;
    }

    filter (cbOrEx) {
        let isTrue = cbOrEx;
        if (typeof cbOrEx !== 'function') {
            isTrue = (item) => !!item[ cbOrEx ];
        }
        let ret = new CustomSet();
        this.forEach(item => {
            if (isTrue(item)) {
                ret.add(item);
            }
        });
        return ret;
    }

    reduce (cb, init) {
        let ret = init;
        this.forEach(item => ret = cb(ret, item));
        return ret;
    }

    intersection (set) {
        return CustomSet.intersection(this, set);
    }

    union (set) {
        return CustomSet.union(this, set);
    }

    difference (set) {
        return CustomSet.difference(this, set);
    }
    
    toArray() {
        return [...this.set];
    }

    [Symbol.iterator] () {
        return this.set[ Symbol.iterator ];
    }

    static fromArray (array) {
        if (!Array.isArray(array)) throw new Error('Input is not an array. ');
        return new CustomSet(new Set(array));
    }

    static union (set1, set2) {
        const union = new CustomSet(set1);
        set2.forEach(elem => union.add(elem));
        return union;
    }

    static intersection (set1, set2) {
        const intersection = new CustomSet([]);
        set2.forEach(elem => {
            if (set1.has(elem)) {
                intersection.add(elem);
            }
        });
        return intersection;
    }

    static difference (set1, set2) {
        const difference = new CustomSet(set1);
        set2.forEach(elem => difference.delete(elem));
        return difference;
    }
}

module.exports = { CustomSet };