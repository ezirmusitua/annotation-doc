const nodejieba = require('nodejieba');
const { CustomSet } = require('./custom-set');
const { readdirSync } = require('fs');
const { File } = require('./file');
const { Config } = require('./config');
console.log(Config.docs);

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
        return lintedContent.split(' ').reduce((res, seg) => {
            if (isAlpha(seg)) {
                res.add(seg);
            } else {
                res.concat(this.jieba.cutForSearch(seg));
            }
            return res;
        }, new CustomSet());
    }
}

ContentParser.jieba = nodejieba;
ContentParser.ignoredSymbols = '|\\,.?!;:`\'"[](){}@#$%^&*~,，。：；”？!~￥（）{}、';

class IndexManager {
    constructor () {
        this.wordToDocMap = {};
    }

    handle (doc, parsed) {
        parsed.forEach(word => {
            if (!this.wordToDocMap[ word ]) {
                this.wordToDocMap[ word ] = new CustomSet()
            }
            this.wordToDocMap[ word ].add(doc);
        });
        return this;
    }

    get (key) {
        return new CustomSet(this.wordToDocMap[ key ]);
    }

    dump () {
        return new File(Config.index, this.wordToDocMap).dump();
    }

    load () {
        this.wordToDocMap = new File.load(Config.index);
    }
}

class Executor {
    constructor () {
        if (!Executor.instance) {
            this.indexManager = new IndexManager();
            this.parser = ContentParser;
            Executor.instance = this;
        }
        return Executor.instance;
    }

    constructIndex () {
        const fileNames = readdirSync(Config.docs, 'utf8');
        return Promise.all(fileNames.map((file) => {
            const rf = new File(Config.docs + '/' + file);
            return rf.load().then((content) => {
                return { content, name: file };
            });
        })).then((files) => {
            files.forEach(file => {
                const tags = file.content;
                const contentToParse = tags.map(t => t.name || '').join(' ');
                this.indexManager.handle(file.name, this.parser.parse(contentToParse));
            });
            return null;
        });
    }

    loadIndex (index) {
        this.indexManager = this.indexManager.load(index);
    }

    saveIndex (index) {
        this.indexManager.dump(index);
    }

    query (content) {
        const parsedQueryWords = this.parser.parse(content);
        return Promise.all(parsedQueryWords.reduce((res, word) => {
            if (!res.size()) {
                res = new CustomSet(this.indexManager.get(word));
            } else {
                res.intersection(this.indexManager.get(word));
            }
            return res;
        }, new CustomSet()).toArray().map((file) => {
            const filePath = Config.docs + '/' + file;
            const rf = new File(filePath);
            return rf.load();
        }));
    }
}

Executor.instance = null;

module.exports = { ContentParser, IndexManager, Executor };