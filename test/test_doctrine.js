const { describe, it } = require('mocha');
const expect = require('chai').expect;
const parse = require('../lib/doctrine').docParse;

describe('Doctrine', function () {
    describe('parse', function () {
        it('should parse sample into json format', () => {
            const sample = [
                "/**",
                " * This function comment is parsed by doctrine",
                " * @param {{ok:String}} userName",
                "*/",
            ].join('\n');
            const sampleParsed = {
                "description": "This function comment is parsed by doctrine",
                "tags": [
                    {
                        "title": "param",
                        "description": null,
                        "type": {
                            "type": "RecordType",
                            "fields": [
                                {
                                    "type": "FieldType",
                                    "key": "ok",
                                    "value": {
                                        "type": "NameExpression",
                                        "name": "String",
                                    },
                                },
                            ],
                        },
                        "name": "userName",
                    },
                ],
            };
            expect(parse(sample, { unwrap: true })).to.deep.equal(sampleParsed);
        });
    });
});
