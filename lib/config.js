class Config {
    constructor () {
        if (!Config.instance) {
            Config.instance = this;
        }
        return Config.instance;
    }

    get index () {
        return Config.index;
    }

    get docs () {
        return Config.docsDir;
    }
    
    set docs(docs) {
        return Config.docsDir = docs;
    }
}

Config.indexFile = '/home/jferroal/projects/jsAPIdoc/test/index.json';
Config.docsDir = '/home/jferroal/projects/jsAPIdoc/test/docs';
const config = new Config();
console.log('inside config', config.docs);

module.exports = { Config: config };