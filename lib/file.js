const { existsSync, mkdirSync, writeFile, readFile } = require('fs');
const { extname } = require('path');

function getParentDir (filePath) {
    if (filePath[ filePath.length - 1 ] === '/') throw new Error('Must assign the filename');
    const tmpArr = filePath.split('/');
    return tmpArr.slice(0, tmpArr.length - 1).join('/');
}

class File {
    constructor (filePath, content) {
        const fileExt = extname(filePath);
        switch (fileExt) {
            case 'json':
                return new JsonFile(filePath, content);
            case 'dix':
                return new DixFile(filePath, content);
            default:
                return new NormalFile(filePath, content);
        }
    }

    static validateFilePath (filePath, content) {
        if (!content) {
            File.validateReadFile(filePath);
        }
        // dir to write does not exists
        if (content) {
            File.validateWriteDir(filePath);
        }
    }

    static validateReadFile (filePath) {
        if (!existsSync(filePath)) throw new Error(`File not found at ${filePath}`)
    }

    static validateWriteDir (filePath) {
        const parentDir = getParentDir(filePath);
        if (!existsSync(parentDir)) {
            mkdirSync(parentDir);
        }
    }

    static write (filePath, content) {
        return new Promise((resolve, reject) => {
            writeFile(filePath, content, 'utf-8', (err) => {
                if (err) reject(err);
                resolve();
            })
        });
    }
}

class JsonFile {
    constructor (filePath, content) {
        File.validateFilePath(filePath, content);
        this.filePath = filePath;
        this.content = content;
    }

    load () {
        return JsonFile.load(this.filePath)
    }

    dump () {
        JsonFile.dump(this.filePath, this.content);
    }

    static load (filePath) {
        File.validateReadFile(filePath);
        return new Promise((resolve, reject) => {
            readFile(filePath, (err, data) => {
                if (err) reject(err);
                let result = {};
                try {
                    result = JSON.parse(data);
                } catch (err) {
                    reject(err);
                }
                resolve(result);
            })
        })
    }

    static dump (filePath, content) {
        File.validateWriteDir(filePath);
        let contentToDump = content;
        const contentType = typeof content;
        if (contentType === 'string') {
            try {
                JSON.parse(content);
            } catch (err) {
                throw new Error('Content to dump is invalid');
            }
        } else {
            contentToDump = JSON.stringify(content);
        }
        return File.write(filePath, contentToDump);
    }
}

class DixFile extends JsonFile {
    constructor(filePath, content) {
        super(filePath, content);
    }
}

class NormalFile {
    constructor (filePath, content) {
        File.validateFilePath(filePath, content);
        this.filePath = filePath;
        this.content = content;
    }

    read () {
        return File.read(this.filePath, this.content);
    }

    write () {
        return File.write(this.filePath, this.content);
    }
}

module.exports = {
    File
};