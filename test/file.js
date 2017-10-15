const { describe, it, xit } = require('mocha');
const { existsSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } = require('fs');
const expect = require('chai').expect;
const { File, JsonFile, DixFile, NormalFile } = require('../lib/file');

describe('File', () => {
    describe('construct by extension', () => {
        it('should create JsonFile while file extension is json', () => {
            const filePath = __dirname + '/tmp.json';
            writeFileSync(filePath, '{"name": "demoJsonFile"}');
            expect(new File(filePath)).to.be.an.instanceOf(JsonFile);
            unlinkSync(filePath);
        });
        it('should create DixFile while file extension is dix', () => {
            const filePath = __dirname + '/tmp.dix';
            writeFileSync(filePath, '{"name": "demoJsonFile"}');
            expect(new File(filePath)).to.be.an.instanceOf(DixFile);
            unlinkSync(filePath);
        });
        it('should create NormalFile while file extension is not above', () => {
            const filePath = __dirname + '/tmp.txt';
            writeFileSync(filePath, '{"name": "demoJsonFile"}');
            expect(new File(filePath)).to.be.an.instanceOf(NormalFile);
            unlinkSync(filePath);
        });
    });
    describe('validateFilePath', () => {
        it('should throw error while read file path not exists', () => {
            const notExistsPath = 'not-exists-path';
            const eFn = () => File.validateFilePath(notExistsPath);
            expect(eFn).to.throw();
        });
        it('should make directory while write file path not exists', () => {
            const notExistsPath = __dirname + '/demo/test.txt';
            File.validateFilePath(notExistsPath, '{a: 1}');
            expect(existsSync(__dirname + '/demo')).to.equal(true);
            rmdirSync(__dirname + '/demo');
        });
    });
    describe('write', () => {
        it('should write file correctly', async () => {
            const filePath = __dirname + '/test.txt';
            await File.write(filePath, 'abc');
            expect(readFileSync(filePath, 'utf-8')).to.equal('abc');
            unlinkSync(filePath);
        });
    })
});

describe('JsonFile', () => {
    describe('load', () => {
        xit('should throw error while read file is not valid json', () => {
            const filePath = __dirname + '/bad-format-sample.json';
            const eFn = () => (new File(filePath)).load(filePath);
            expect(eFn).to.throw();
        });
    });
    describe('write', () => {
        it('should throw error while content to dump is can not be json parse', () => {
            const filePath = __dirname + '/tmp.json';
            const eFn = () => (new File(filePath, '{abc}')).dump(filePath);
            expect(eFn).to.throw();
        });
    })
});

xdescribe('DixFile', () => {
    describe('', () => {
        it('should work like JsonFile', () => {
            // Do nothing
        });
    });
});

xdescribe('NormalFile', () => {
    describe('', () => {
        it('should work like File', () => {
            // Do nothing
        });
    });
});
