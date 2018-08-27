import path from "path";
import config from "../tools.config";
import minimist from "minimist";


function stdin(text) {
    return new Promise(ps => {
        process.stdin.resume();
        process.stdout.write((text || "") + " > ");
        process.stdin.once("data", data => ps(data.toString().trim()));
    });
}

async function exec() {
    var wait = 1000;
    try {
        var files = process.argv.slice(2);
        var extMap = {};
        files.forEach(function(o) {
            var ext = path.extname(o);
            if (!ext) return;
            extMap[ext.slice(1).toLowerCase()] = 1;
        });
        var usable = {}, usableCount = 0;
        for (var k in config) {
            var c = config[k];
            //过滤命令
            if (files.length == 0 && c.limit != 0) continue;
            if (files.length > 0 && c.limit == 0) continue;
            if (files.length > 1 && c.limit == 1) continue;
            if (c.filter && c.limit != 0) {
                var match = 0;
                c.filter.split(",").forEach(function(o){
                    if (extMap[o.trim().toLowerCase()]) match++;
                });
                if (!match) continue;
            }

            usable[k] = c;
            ++usableCount;
        }
        //显示筛选结果
        if (!usableCount) {
            console.log("没有找到可以执行的命令");
            return;
        }
        console.log("请选择如下命令：");
        var usableArr = [];
        for (var k in usable) {
            var c = usable[k];
            usableArr.push(c);
            console.log("  " + usableArr.length + ")" + k + ": " + c.title);
        }

        var command, argv;
        //等待用户输入
        while (true) {
            var line = await stdin();
            var argv = [];
            var regex = /(?:([^\s\"]+)\s|([^\s\"]+)$|\"([^\"]+)\")/ig;
            while(true) {
                var ret = regex.exec(line);
                if (!ret) break;
                for (var i = 1; i < ret.length; ++i) {
                    if (ret[i]) {
                        argv.push(ret[i]);
                        break;
                    }
                }
            }

            var cmd = argv.shift() || "";

            //只有一个命令时支持回车继续
            if (!cmd && usableCount == 1) for (var k in usable) cmd = k;
            if (cmd in usable) {
                command = usable[cmd];
                break;
            }
            if (/^\d+$/.test(cmd)) {
                var idx = parseInt(cmd) - 1;
                if (idx >= 0 && idx < usableArr.length) {
                    command = usableArr[idx];
                    break;
                }
            }
        }

        if (!command) return;
        if (argv) argv = minimist(argv);
        var data = await command.exec(files, argv);
        if (data) console.log(data);
        if (command.onend) {
            var ret = command.onend();
            if (ret instanceof Promise) await ret;
        }
    }
    catch(err) {
        if (err.stack) {
            console.error(err.message);
            console.error(err.stack);
        }
        else console.error(err);
        wait = 10000;
    }
    await new Promise(ps => setTimeout(ps, wait));
    process.exit(0);
}

exec();