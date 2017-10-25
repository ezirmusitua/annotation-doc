const nodejieba = require('nodejieba');
const { CustomSet } = require('./custom-set');
const { readdirSync } = require('fs');
const { File } = require('./file');

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
    constructor (indexFile) {
        this.wordToDocMap = {};
        this.indexFile = indexFile;
        if (indexFile) {
            this.load(indexFile);
        }
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

    dump (indexFile) {
        let filename = this.indexFile;
        if (!indexFile) {
            filename = indexFile;
        }
        if (!filename) throw new Error('Must given file to dump index. ');
        return new File(indexFile, this.wordToDocMap).dump();
    }

    async load (indexFile) {
        const idxContent = await (new File(indexFile).load());
        this.indexFile = indexFile;
        this.wordToDocMap = idxContent;
    }
}

class Executor {
    constructor (filename, base='') {
        if (!Executor.instance) {
            this.indexManager = new IndexManager(filename);
            this.parser = ContentParser;
            this.base = base;
            Executor.instance = this;
        }
        return Executor.instance;
    }

    async constructIndex (docsPath) {
        const fileNames = readdirSync(docsPath, 'utf8');
        const fileLoadPromises = fileNames.map(async (file) => {
            const content = await (new File(docsPath + '/' + file)).load();
            return Promise.resolve({ content, name: file });
        });
        const files = await Promise.all(fileLoadPromises);
        files.forEach(file => {
            const tags = file.content;
            const contentToParse = tags.map(t => t.name || '').join(' ');
            this.indexManager.handle(file.name, this.parser.parse(contentToParse));
        });
    }

    loadIndex (indexFile) {
        this.indexManager = this.indexManager.load(indexFile);
    }

    saveIndex (indexFile) {
        this.indexManager.dump(indexFile);
    }

    query (content) {
        const parsedQueryWords = this.parser.parse(content);
        console.log(parsedQueryWords);
        const docs = parsedQueryWords.reduce((res, word) => {
            if (!res.size()) {
                console.log(1);
                res = new CustomSet(this.indexManager.get(word));
            } else {
                res.intersection(this.indexManager.get(word));
            }
            console.log('res, ', res);
            return res;
        }, new CustomSet());
        console.log(docs);
        return docs.reduce((res, file) => {
            // FIXME: use to config to set path
            res.push(new File(file).load());
            return res;
        }, []);
    }
}

Executor.instance = null;

module.exports = { ContentParser, IndexManager, Executor };