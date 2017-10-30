const { describe, it, beforeEach, afterEach } = require('mocha');
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
    const defaultFieldsToIgnore = [ 'line', 'source' ];

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
        let sampleRes = [];
        beforeEach(() => {
            sampleRes = sampleRes.concat(sampleParsedRes);
        });
        afterEach(() => {
            sampleRes = [];
        });
        it('should use given files to drop or the default one', () => {
            const pr1 = new ParseResult(sampleRes);
            expect(pr1.fieldsToIgnore).to.deep.equal(defaultFieldsToIgnore);
            const fieldsToIgnore = [ 'type', 'line', 'source' ];
            const pr2 = new ParseResult(sampleRes, fieldsToIgnore);
            expect(pr2.fieldsToIgnore).to.deep.equal(fieldsToIgnore);
        });
        it('should drop the fields in fieldsToDrop for res', () => {
            const pr = new ParseResult(sampleRes);
            Object.keys(pr.blockTags).forEach((k) => {
                const invalidTag = pr.blockTags[ k ].find((tag) => defaultFieldsToIgnore.indexOf(tag.tag) > -1);
                expect(invalidTag).to.be.undefined;
            });
        });
        it('should classify tags with block use the @name tag', () => {
            const pr = new ParseResult(sampleRes);
            expect(Object.keys(pr.blockTags)).to.deep.equal([ 'getPokemonByName', 'getPokemonById' ])
        })
    });

    describe('FileParser', () => {
        const filePath = __dirname + '/jsdoc-sample-rich.txt';
        it('should parse and return a ParsedResult instance', async () => {
            expect(await FileParser.parse(filePath)).to.be.an.instanceOf(ParseResult);
        });
        it('should able to dump content to docs/api-name.json', async () => {
            const outDir = __dirname + '/docs';
            expect(await (await (new FileParser(filePath)).parse()).dump(outDir)).to.be.undefined;
        })
    })
});
