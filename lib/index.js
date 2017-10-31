#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const args = require('./args').args;
const Config = require('./config').Config;
const { Executor } = require('./database');
const { DirectoryParser, FileParser } = require('./parser');

function relativeToAbs (dir) {
    let res = '';
    if (!path.isAbsolute(dir)) {
        if (args.input.startsWith('.')) {
            res = __dirname + dir.slice(1);
        } else {
            res = __dirname + dir;
        }
    } else {
        res = dir;
    }
    return res;
}

/**
 * @name Main
 * @desc This is the entry point of this program
 * @return {Promise.<void>}
 */
function main () {
    let [ input, docs, query ] = [ '', '', '' ];
    input = relativeToAbs(args.input);
    docs = relativeToAbs(args.docs);
    query = args.query;
    Config.docs = docs;
    // convert input to docs
    const iFsStat = fs.statSync(input);
    if (iFsStat.isDirectory()) {
        const dParser = new DirectoryParser(input);
        dParser.parse().then(() => dParser.dump(docs)).catch(e => console.error(e));
    } else {
        const fParser = new FileParser(input);
        fParser.parse().then(() => fParser.dump(docs)).catch(e => console.error(e));
    }
    const db = new Executor();
    db.constructIndex()
      .then(() => console.log(db.indexManager.wordToDocMap))
      .then(() => db.query(query))
      .then((res) => console.log(res))
      .catch(e => console.error(e));
}

main();