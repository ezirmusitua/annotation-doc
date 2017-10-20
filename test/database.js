const { describe, it, xit } = require('mocha');
const expect = require('chai').expect;
const { ContentParser, IndexManager, setLike } = require('../lib/database');

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
            expect(ContentParser.parse(sentenceToParse)).to.deep.equal(parsedResult)
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
            parsedResult.forEach(word => expect(manager.wordToDocMap[word].has(doc)).to.equal(true));
        });
    });
    
    describe('get', () => {
        it('should get docs using word ', () => {
            manager.get('CEO').forEach(d => expect(d).to.equal(doc)); 
        });
    });
});

describe('Executor', () => {
    describe('construct', () => {
        it('should work correctly', () => {
            expect(false).to.equal(true);
        });
    });
});