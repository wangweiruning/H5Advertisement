console.log("loading load.js");

var babel = require("babel-core");
var path = require("path");
require("babel-polyfill");

var stack = [__dirname];
var cache = {};

global.jRequire = function(file) {
    if (file.charAt(0) != ".") {
        return require(file);
    }

    file = path.join(stack[stack.length - 1], file + ".js");
    if (cache[file]) {
        return cache[file];
    }

    console.log("loading " + path.basename(file));

    var fileDir = path.dirname(file);
    stack.push(fileDir);
    
    var result = babel.transformFileSync(file, {
        passPerPreset: true,
        babelrc: false,
        presets: [
            "es2015",
            "stage-0"
        ],
        plugins: [
            "transform-runtime"
        ]
      });
    
    var val = new Function('var exports= {};var require = global.jRequire;var __dirname = ' + JSON.stringify(fileDir) + ';var __filename=' + JSON.stringify(file) + ';' +result.code+';return exports.default || exports;')();
    cache[file] = val;
    stack.pop();

    return val;
}

global.jRequire("./exec");
