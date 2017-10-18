const nodejieba = require('nodejieba');
const { readdirSync } = require('fs');
const { File } = require('./file');

function setLike (instance) {
    const pushMethodNames = [ 'add', 'append', 'put', 'push' ].filter(name => !!instance[ name ]);
    if (!pushMethodNames.length) throw new Error('Must support put/push/add operation !');
    instance.concat = instance.concat ? instance.concat : (items) => {
        items.forEach(item => instance[ pushMethodNames[ 0 ] ](item));
        return instance;
    };
    instance.push = instance[ pushMethodNames[ 0 ] ];
    instance.intersection = (targetSet) => {
        const lessSet = instance.length < targetSet.length ? instance : targetSet;
        const moreSet = instance.length > targetSet.length ? instance : targetSet;
        const existsMap = {};
        lessSet.forEach(val => existsMap[ val ] = true);
        return moreSet.reduce((res, val) => {
            if (existsMap[ val ]) {
                res.push(val);
            }
            return res;
        }, setLike(new Set()));
    };
    return instance;
}

function isAlpha (ch) {
    if (!ch) return false;
    const startCharCode = ch.toLocaleLowerCase().codePointAt(0);
    const isNumber = startCharCode > 47 && startCharCode < 58;
    const isAlpha = startCharCode > 76 && startCharCode < 122;
    return isNumber || isAlpha;
}

class ContentParser {
    static _lint (content) {
        const chars = content.split('');
        return chars.reduce((res, ch, idx) => {
            if (ContentParser.ignoredSymbols.indexOf(ch) > -1) {
                res += ' ';
            } else if (isAlpha(ch) && !isAlpha(chars[ idx - 1 ])) {
                res += ' ' + ch;
            } else {
                res += ch;
            }
            return res;
        }, '');
    }

    static parse (content) {
        const lintedContent = ContentParser._lint(content);
        return Array.from(lintedContent.split(' ').reduce((res, seg) => {
            if (isAlpha(seg)) {
                res.push(seg);
            } else {
                res.concat(this.jieba.cutForSearch(seg));
            }
            return res;
        }, setLike(new Set())));
    }
}

ContentParser.jieba = nodejieba;
ContentParser.ignoredSymbols = '|\\,.?!;:`\'"[](){}@#$%^&*~,，。：；”？!~￥（）{}、';

class IndexManager {
    constructor (indexFile) {
        this.wordToDocMap = {};
        if (indexFile) {
            this.load(indexFile);
        }
    }

    handle (doc, parsed) {
        parsed.forEach(word => {
            if (!this.wordToDocMap[ word ]) {
                this.wordToDocMap[ word ] = setLike(new Set())
            }
            this.wordToDocMap.push(doc);
        });
    }

    locate (key) {
        return setLike(this.wordToDocMap[ key ]);
    }

    dump (idxFileName) {
        console.log('not implemented !');
    }

    load (idFileName) {
        console.log('not implemented !');
    }
}

class Executor {
    constructor (indexFile) {
        if (!Executor.instance) {
            this.indexManager = new IndexManager(indexFile);
            this.parser = ContentParser;
            Executor.instance = this;
        }
        return Executor.instance;
    }

    constructIndex (docsPath) {
        const files = readdirSync(docsPath, 'utf8');
        files.forEach(file => {
            const docObj = (new File(file)).load();
            for (const key of Object.keys(docObj)) {
                this.indexManager.handle(file, this.parser.parse(docObj[ key ]));
            }
        });
        this.indexManager.dump();
    }

    loadIndex (indexFile) {
        this.indexManager = this.indexManager.load(indexFile);
    }

    query (content) {
        const parsedQueryWords = this.parser.parse(content);
        const docs = parsedQueryWords.reduce((res, word) => {
            res.intersection(this.indexManager.locate(word));
            return res;
        }, setLike([]));
        return docs.reduce((res, file) => {
            res.push(new File(file).load());
            return res;
        }, []);
    }
}

Executor.instance = null;

module.exports = { ContentParser, IndexManager, Executor };