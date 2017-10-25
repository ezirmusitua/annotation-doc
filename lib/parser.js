const File = require('./file').File;
const commentFileParser = require('comment-parser').file;

class Tag {
    constructor (_tag) {
        this.tag = _tag.tag;
        this.name = _tag.name;
        this.type = _tag.type;
        if (_tag.optional) {
            this.optional = _tag.optional;
        }
        if (_tag.description) {
            this.description = _tag.description;
        }
        if (_tag.line) {
            this.line = _tag.line;
        }
        if (_tag.source) {
            this.source = _tag.source;
        }
        if (this.tag === 'name') {
            this.isBlockTitle = true;
        }
    }
}

class ParsedResult {
    constructor (res, fieldsToIgnore) {
        this.counter = 0;
        this.fieldsToIgnore = fieldsToIgnore || ParsedResult._fieldsToIgnore;
        this._origin = this.cleanRes(res);
        this.blockTags = this.convertBlockTags();
    }

    convertBlockTags () {
        const blockTags = {};
        for (const _block in this._origin) {
            if (this._origin.hasOwnProperty(_block)) {
                const tmpTags = this._origin[ _block ].tags.reduce((tags, tag) => tags.concat(new Tag(tag)), []);
                const nameTags = tmpTags.find((tag) => tag.isBlockTitle);
                if (nameTags && nameTags[ 0 ]) {
                    blockTags[ nameTags[ 0 ].name ] = tmpTags;
                } else if (nameTags && !nameTags[ 0 ]) {
                    blockTags[ nameTags.name ] = tmpTags;
                } else {
                    blockTags[ `unknown - block - ${this.counter}` ] = tmpTags;
                    this.counter += 1;
                }
            }
        }
        return blockTags;
    }

    cleanRes (res) {
        return ParsedResult.dropField(res, this.fieldsToIgnore);
    }

    static dropField (obj, fields) {
        const droppedObj = {};
        for (const key of Object.keys(obj)) {
            if (fields.indexOf(key) > -1 || !obj[ key ]) continue;
            if (Array.isArray(obj[ key ])) {
                droppedObj[ key ] = obj[ key ]
                  .reduce((_r, item) => _r.concat(ParsedResult.dropField(item, fields)), []);
                continue;
            }
            if (typeof obj[ key ] !== 'object') {
                droppedObj[ key ] = obj[ key ];
                continue;
            }
            droppedObj[ key ] = ParsedResult.dropField(obj[ key ], fields);
        }
        return droppedObj;
    }

}

ParsedResult._fieldsToIgnore = [ 'line', 'source' ];

class FileParser {
    constructor (filePath) {
        File.validateReadFile(filePath);
        this.filePath = filePath;
    }

    async parse () {
        this.parsedContent = await FileParser.parse(this.filePath);
        return this;
    }

    async dump (dir) {
        await FileParser.dump(dir, this.parsedContent);
    }

    static parse (filePath) {
        File.validateReadFile(filePath);
        return new Promise((resolve, reject) => {
            commentFileParser(filePath, (err, res) => {
                if (err) reject(new Error(`Parse Failed: ${JSON.stringify(err)}`));
                resolve(new ParsedResult(res));
            });
        });
    }

    static async dump (dir, parsedContent) {
        // TODO: Handle file duplication
        const { blockTags: blocks } = parsedContent;
        Object.keys(blocks).reduce(async (name) => {
            const file = new File(`${dir}/${name}.json`, blocks[ name ]);
            await file.dump();
        });
    }

}

module.exports = { Tag, ParseResult: ParsedResult, FileParser };