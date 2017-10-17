const nodejieba = require('nodejieba');
console.log(nodejieba.cutForSearch);

function arrayLike (instance) {
    if (instance.concat) return instance;
    const pushMethodNames = [ 'add', 'append', 'put', 'push' ].filter(name => !!instance[ name ]);
    if (!pushMethodNames.length) throw new Error('Must support put/push/add operation !');
    instance.concat = (items) => {
        // if (!items[Symbol.iterator]) throw new Error('To concat, must implement iterator attribute !');
        items.forEach(item => instance[ pushMethodNames[ 0 ] ](item));
        return instance;
    };
    instance.push = instance[ pushMethodNames[ 0 ] ];
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
            } else if (isAlpha(ch) && !isAlpha(chars[idx - 1])) {
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
        }, arrayLike(new Set())));
    }
}

ContentParser.jieba = nodejieba;
ContentParser.ignoredSymbols = '|\\,.?!;:`\'"[](){}@#$%^&*~,，。：；”？!~￥（）{}、';

class IndexGenerator {
    constructor () {
        console.info('index generator');
    }
}

class Executor {
    constructor () {
        console.info('query executor');
    }
}

class Database {
    constructor () {
        console.log('database engine');
    }
}

module.exports = { ContentParser };