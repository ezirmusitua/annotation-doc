class Config {
    constructor () {
        if (!Config.instance) {
            Config.instance = this;
        }
        return Config.instance;
    }

    get index () {
        return Config.base + Config.index;
    }

    get docs () {
        console.log(Config.base + Config.docsDir);
        return Config.base + Config.docsDir;
    }
}

Config.base = '/home/jferroal/projects/jsAPIdoc/test';
Config.indexFile = '/index.json';
Config.docsDir = '/docs';

module.exports = { Config: new Config() };