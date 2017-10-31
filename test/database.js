const { describe, it } = require('mocha');
const { CustomSet } = require('../lib/custom-set');
const expect = require('chai').expect;
const { ContentParser, IndexManager, Executor } = require('../lib/database');

describe('ContentParser', () => {
    const sentenceToParse = '我是拖拉机学院手扶拖拉机专业的. 不用多久, 我就会升职加薪, 当上CEO, 走上人生巅峰.';
    const parsedResult = [
        '我', '是', '拖拉', '拖拉机', '学院', '手扶', '手扶拖拉机', '专业', '的', '不用', '多久', '就', '会', '升职',
        '加薪', '当', '上', 'CEO', '走上', '人生', '巅峰',
    ];
    describe('lint', () => {
        it('should remove symbols and insert space correctly', () => {
            expect(ContentParser._lint(sentenceToParse)).to
              .equal('我是拖拉机学院手扶拖拉机专业的  不用多久  我就会升职加薪  当上 CEO  走上人生巅峰 ')
        });
    });
    describe('parse', () => {
        it('should parse correctly', () => {
            expect(ContentParser.parse(sentenceToParse)).to.deep.equal(CustomSet.fromArray(parsedResult))
        });
    });
});

describe('IndexManager', () => {
    const parsedResult = [
        '我', '是', '拖拉', '拖拉机', '学院', '手扶', '手扶拖拉机', '专业', '的', '不用', '多久', '就', '会', '升职',
        '加薪', '当', '上', 'CEO', '走上', '人生', '巅峰',
    ];
    const doc = 'demo.json';
    const manager = (new IndexManager()).handle(doc, parsedResult);
    describe('handle', () => {
        it('should generate map with doc name and doc parsed words', () => {
            parsedResult.forEach(word => expect(manager.wordToDocMap[ word ].has(doc)).to.equal(true));
        });
    });

    describe('get', () => {
        it('should get docs using word ', () => {
            manager.get('CEO').forEach(d => expect(d).to.equal(doc));
        });
    });

    describe('dump', () => {
        it('should throw error if no indexFile', () => {
            expect(() => manager.dump()).to.throw();
        });
    });
});

describe('Executor', () => {
    const executor = new Executor();
    describe('constructIndex', () => {
        it('should work correctly', () => {
            executor.constructIndex().then(() => {
                expect(executor.indexManager.get('getPokemon').has('getPokemon.json')).to.equal(true);
                expect(executor.indexManager.get('pokemonName').has('getPokemon.json')).to.equal(true);
                expect(executor.indexManager.get('PokemonNotFound').has('getPokemon.json')).to.equal(true);
            });
        });
    });

    describe('query', () => {
        it('should work correctly', (done) => {
            executor.query('getPokemon').then(res => {
                expect(res.length).to.equal(1);
                expect(res[ 0 ]).to.deep.equal([
                    { tag: 'name', name: 'getPokemon', isBlockTitle: true },
                    { tag: 'param', name: 'pokemonName', type: 'String' },
                    { tag: 'returns', type: '{pokemon}' },
                    { tag: 'throws', name: 'PokemonNotFound' },
                ]);
                done();
            }).catch(err => {
                console.error(err);
                done();
            }); 
        });
    });
});