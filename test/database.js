const { describe, it, xit } = require('mocha');
const expect = require('chai').expect;
const { ContentParser } = require('../lib/database');

describe('ContentParser', () => {
    describe('lint', () => {
        it('should remove symbols and insert space correctly', () => {
            const sentence = '我是拖拉机学院手扶拖拉机专业的. 不用多久, 我就会升职加薪, 当上CEO, 走上人生巅峰.';
            expect(ContentParser._lint(sentence)).to
              .equal('我是拖拉机学院手扶拖拉机专业的  不用多久  我就会升职加薪  当上 CEO  走上人生巅峰 ')
        });
    });
    describe('parse', () => {
        it('should parse correctly', () => {
            const sentence = '我是拖拉机学院手扶拖拉机专业的. 不用多久, 我就会升职加薪, 当上 CEO, 走上人生巅峰.';
            expect(ContentParser.parse(sentence)).to.deep.equal([
                '我', '是', '拖拉', '拖拉机', '学院', '手扶', '手扶拖拉机', '专业', '的', '不用', '多久', '就', '会', '升职',
                '加薪', '当', '上', 'CEO', '走上', '人生', '巅峰',
            ])
        });
    });
});

describe('IndexGenerator', () => {
    describe('generate', () => {
        it('should generate index file as i want', () => {
            expect(false).to.equal(true);
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