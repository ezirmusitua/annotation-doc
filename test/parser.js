const { describe, it } = require('mocha');
const expect = require('chai').expect;
const { Tag, ParseResult, FileParser } = require('../lib/parser');

describe('Parser', () => {
    const sampleParsedRes = [
        {
            "tags": [ {
                "tag": "name",
                "type": "",
                "name": "getPokemonByName",
                "optional": false,
                "description": "",
                "line": 2,
                "source": "@name getPokemonByName",
            }, {
                "tag": "param",
                "type": "string",
                "name": "pokemonName",
                "optional": false,
                "description": "Pokemon's name",
                "line": 3,
                "source": "@param {String} name Pokemon's name",
            }, {
                "tag": "returns",
                "name": "",
                "optional": false,
                "type": "{pokemon}",
                "description": "",
                "line": 4,
                "source": "@returns {{pokemon}}",
            } ],
            "line": 1,
            "description": "",
            "source": "",
        },
        {
            "tags": [ {
                "tag": "name",
                "type": "",
                "name": "getPokemonById",
                "optional": false,
                "description": "",
                "line": 6,
                "source": "@name getPokemonById",
            }, {
                "tag": "param",
                "type": "string",
                "name": "pokemonId",
                "optional": false,
                "description": "Pokemon's id",
                "line": 7,
                "source": "@param {String} name Pokemon's id",
            }, {
                "tag": "returns",
                "name": "",
                "optional": false,
                "type": "{pokemon}",
                "description": "",
                "line": 8,
                "source": "@returns {{pokemon}}",
            } ],
            "line": 5,
            "description": "",
            "source": "",
        },
    ];
    const defaultParseResultConfig = {
        onlyTags: true,
        fieldsToIgnore: [ 'line', 'source' ],
    };
    describe('Tag', () => {
        it('should set isBlockTitle to true if tag is name', () => {
            const _tag = {
                tag: 'name',
                name: 'demo',
                type: 'string',
            };
            const tag = new Tag(_tag);
            expect(tag.isBlockTitle).to.equal(true);
            expect(tag.tag).to.equal('name');
            expect(tag.name).to.equal('demo');
            expect(tag.type).to.equal('string');
            expect(tag.description).to.equal(undefined);
        });
    });

    describe('ParsedResult', () => {
        it('should use given config or default config', () => {
            const res = [].concat(sampleParsedRes);
            const pr1 = new ParseResult(res);
            expect(pr1._config).to.deep.equal(defaultParseResultConfig);
            const newConfig = { onlyTags: false, fieldsToIgnore: [ 'type', 'line', 'source' ] };
            const pr2 = new ParseResult(res, newConfig);
            expect(pr2._config).to.deep.equal(newConfig);
        });
        it('should classify tags with block use the @name tag', () => {
            const res = [].concat(sampleParsedRes);
            const pr = new ParseResult(res);
            expect(Object.keys(pr.blockTags)).to.deep.equal([ 'getPokemonByName', 'getPokemonById' ])
        })
    });

    describe('FileParser', () => {
        it('should throw error if file does not exists', () => {
            const eFn1 = () => new FileParser('does-not-exists-path');
            expect(eFn1).to.throw();
            const eFn2 = () => FileParser.parse('does-not-exists-path');
            expect(eFn2).to.throw();
        });
        it('should parse and return a ParsedResult instance', async () => {
            const filePath = __dirname + '/jsdoc-sample-rich.txt';
            expect(await FileParser.parse(filePath)).to.be.an.instanceOf(ParseResult);
        });
        it('should able to dump content to docs/api-name.json', async () => {
            const filePath = __dirname + '/jsdoc-sample-rich.txt';
            const outDir = __dirname + '/docs';
            expect(await (await (new FileParser(filePath)).parse()).dump(outDir)).to.equal(undefined);
        })
    })
});
