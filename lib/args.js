const yargs = require('yargs');
const ArgDescriptions = [ {
    input: '需要扫描的文件',
    query: '需要查询的方法关键词',
    docs: '处理过的文档存储目录',
    base: '处理目标的根目录',
} ];
module.exports.args = yargs.argv;