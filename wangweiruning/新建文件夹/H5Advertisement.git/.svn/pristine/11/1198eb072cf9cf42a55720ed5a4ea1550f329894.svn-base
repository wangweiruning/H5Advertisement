import { png2jpg as pngToJpg, files2js as files2jsItem, saveObject, html2js as html2jsItem } from "./files2js";
import { pngquant as pngquantItem } from "./pngquant";
import path from "path";

export let png2jpg = {
    title: "把png转换成jpg" +
            "\r\n\tquality(q)：压缩级别（0-100），默认为80" +
            "\r\n\tcolor(c)：背景颜色，默认为白色" +
            "\r\n\t示例：2 -q 85 -c pink" +
            "\r\n\t示例：2 --quality 85 --color #000" +
            "\r\n\t示例：2 85 #872813",
    filter: "png",
    async exec(files, option) {
        var config = {
            quality: option.q || option.quality || option._[0],
            color: option.c || option.color || option._[1]
        };
        config.quality = Math.max(20, Math.min(100, parseInt(config.quality) || 80));
        
        for (var i = 0; i < files.length; ++i) {
            console.log(files[i]);
            pngToJpg(files[i], config);
        }
    }
};

export let pngquant = {
    title: "压缩png",
    filter: "png",
    async exec(files) {
        for (var i = 0; i < files.length; ++i) {
            await pngquantItem(files[i]);
        }
    }
};

/**
 * 索引文件内容
 * @param {*} fileConfig 筛选规则：[{filter:[/regex/],text:"boolean，是否直接输出文字内容",name:"使用时索引变量",dir:"要索引的文件夹路径"}]
 * @param {*} fileOutput 要输出的文件夹路径
 * @param {*} template 输出模板，#name#和#json#会被替换成名称和内容
 */
export function files2js(fileConfig, fileOutput, template) {
    return {
        title: "索引文件",
        async exec() {
            for (var k in fileConfig) {
                var kv = fileConfig[k];
                var data = await files2jsItem(kv.dir, kv.filter, kv.text);
                var str = JSON.stringify(data);
                if (template) str = template.replace(/#name#/g, kv.name).replace(/#json#/g, str);
                await saveObject(str, path.join(fileOutput, k + ".js"));
                console.log("已完成" + k + ".js");
            }
        },
        limit: 0
    }
}

/**
 * 处理psd导出的html文件
 * @param {*} fileOutput 图片输出路径
 * @param {*} template 生成的代码模板
 */
export function html2js(fileOutput, template) {
    return {
        title: "导入psd2html。" +
            "\r\n\tkey(k)：文件保存目录" +
            "\r\n\tprefix(f)：文件命名前缀" +
            "\r\n\tpng(p)：强制转换为png" +
            "\r\n\tjpg(j)：jpg的压缩级别" +
            "\r\n\traw(r)：是否保留原始图片" +
            "\r\n\t示例：html2js -k dir -f pre -p -j 80" +
            "\r\n\t示例：html2js --key dir --prefix pre --png --jpg 80" +
            "\r\n\t示例：html2js dir pre 80 -p",
        /**
         * 导入psd2html
         * @param files 文件列表
         * @param option 参数：参考命令行提示
         * @returns {*}
         */
        async exec(files, option){
            var jpg = option.j || option.jpg || option.jpeg || option._[2];
            await html2jsItem(files[0], {
                path: fileOutput,
                template: option.t || option.template || option._[3] || template,
                key: option.k || option.key || option._[0],
                prefix: option.f || option.prefix || option._[1],
                png: option.p || option.png,
                raw: option.r || option.raw,
                jpg: jpg && Math.max(20, Math.min(100, parseInt(jpg)))
            });
        },
        filter: "html"
    };
}