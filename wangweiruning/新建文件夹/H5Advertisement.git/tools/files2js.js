import path from "path";
import fs from "fs";
import { callFs, getFiles, Waiter, callFsPass } from "./files";
import iconv from "iconv-lite";
import ncp from "copy-paste";
import images from "images";
import { pngquant } from "./pngquant";

const mineMap = {
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".jpeg": "image/jpg",
    ".gif": "image/gif",
    ".mp3": "audio/mp3",
    ".ogg": "audio/ogg",
    ".svg": "image/svg",
    ".mp4": "video/mp4"
};

/**
 * 把文字内容保存到指定路径，编码使用utf8
 * @param {*} str 要保存的字符串
 * @param {*} savepath 要保存到的路径
 */
export async function saveObject(str, savepath) {
    var jsDir = path.dirname(savepath);
    if (!(await callFsPass("exists", jsDir)) || !(await callFs("stat", jsDir)).isDirectory()) await callFsPass("mkdir", jsDir);

    var arr = iconv.encode(str, 'utf8');
    await callFs("writeFile", savepath, arr);
}

/**
 * 把目录下所有的文件转换为打包数据
 * @param {*} absDir 要转换的目录
 * @param {*} filter 文件路径需要满足的正则表达式，用于筛选文件
 * @param {*} text 是否文本文件
 * @returns 打包数据
 */
export async function files2js(absDir, filter, text) {
    var result = [];
    for await (let ff of getFiles(absDir, null, true)) {
        let o = ff.path.substr(absDir.length);
        if (filter instanceof Array) {
            var b = false;
            for (let f of filter) {
                if (!f.test(o)) {
                    b = true;
                    break;
                }
            }
            if (b) continue;
        }
        else if (filter && !filter.test(o)) continue;
         
        let data = await callFs("readFile", path.join(absDir, o));
        result.push([o.replace(/\\/ig, "/"), text ? data.toString() : ("data:" + (mineMap[path.extname(o)] || "application/binary") + ";base64," + data.toString("base64"))]);
    }
    return result;
}


/**
 * 处理psd导出的html文件
 * @param filename 要处理的html文件路径
 * @param config 处理选项
 *      path: 工作目录*
 *      template: 输出模板*
 *      key: 文件目录。如果为空，就使用文件名称
 *      prefix: 文件命名前缀
 *      png: boolean，为true则关闭自动转换为jpg。（目前不支持）
 *      jpg: 0-100，jpeg压缩级别。（目前不支持）
 */
export async function html2js (filename, config) {
    if (!config) throw new Error("没有找到配置");
    if (!config.path) throw new Error("请提供工作路径");
    if (!config.key) config.key = path.basename(filename).split(".")[0].split("_").pop();
    if (!config.prefix) config.prefix = "";

    let waiter = new Waiter();
    //读取文件
    fs.readFile(filename, waiter.next());
    var data = await waiter.wait();

    var lines = data.toString().split("\n");

    var result = [];
    //处理每一行
    for (var i = 0; i < lines.length; ++i) {
        var match = /\ssrc=\"([^\"]+)\"/ig.exec(lines[i]);
        if (!match) continue;
        var url = match[1];

        //加载图片
        var imgUrl = path.normalize(path.join(path.dirname(filename), url));

        //确定保存格式
        var hasAlpha = true;
        var img = images(imgUrl);

        if (!config.png && img._handle.transparent != 1) hasAlpha = false;

        var width = img.width();
        var height = img.height();


        //保存图片
        var file = config.prefix + i + (hasAlpha ? ".png" : ".jpg");
        var dir = path.join(config.path, config.key);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        var to_file = path.join(dir, file);

        if (hasAlpha) img.save(to_file);
        else img.save(to_file, { quality: config.jpg || 80 });
        images.gc();

        //压缩png
        if (hasAlpha && !config.raw) {
            await pngquant(to_file, true);
        }

        //生成目标代码
        var left = /left:\s*(-?\d+)px\s*;/.exec(lines[i])[1];
        var top = /top:\s*(-?\d+)px\s*;/.exec(lines[i])[1];
        var ret = config.template.replace(/#id#/ig, config.key + config.prefix + i);
        ret = ret.replace(/#index#/ig, i);
        ret = ret.replace(/#url#/ig, config.key + "/" + file);
        ret = ret.replace(/#left#/ig, parseInt(left) / 100);
        ret = ret.replace(/#top#/ig, parseInt(top) / 100);
        ret = ret.replace(/#width#/ig, width / 100);
        ret = ret.replace(/#height#/ig, height / 100);

        result.push(ret);
    }

    var txt = result.join("\r\n");
    ncp.copy(txt, waiter.pass());
    await waiter.wait();

    //等待剪贴板完成
    setTimeout(waiter.pass(), 3000);
    await waiter.wait();

    return txt;
}

/**
 * 压缩png
 * @param file png图片路径
 * @param config
 *      quality: jpg图片质量
 *      color: 背景颜色{a,r,g,b}
 */
export function png2jpg(file, config) {
    //不是png就跳过
    if (path.extname(file) != ".png") {
        return;
    }
    config = config || {};
    if (!config.color) config.color = {
        a: 255,
        r: 255,
        g: 255,
        b: 255
    };
    var img = images(file);
    if (config.color) {
        var img2 = images(img.width(), img.height());
        img2.fill(config.color.r, config.color.g, config.color.b, config.color.a);
        img2.draw(img, 0, 0);
        img = img2;
    }
    //保存图片
    var to_file = file.substr(0, file.length - 4) + ".jpg";
    img.save(to_file, { quality: config.jpg || 80 });
}