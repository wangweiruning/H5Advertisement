import { callFs, getFiles } from "./files";
import { saveObject } from "./files2js";
import path from "path";
import { pngquant } from "./pngquant";
import fs from "fs";

/**
 * 索引flash
 * @param {*} arr 配置列表：[{list:[{path:"js文件绝对路径",config:{key:"flash key",images:"res中的图片文件夹，不设置则默认与key相同"},skip:"boolean,跳过图片处理模块"}],save:"生成的文件保存地址"}]
 * @param {*} res res中的图片文件夹基础路径
 */
export function flash2js(arr, res) {
    return {
        title: "索引Flash" +
            "\r\n\tskip(s)：跳过图片处理" +
            "\r\n\texist(e)：跳过已存在的图片处理" +
            "\r\n\traw(r)：是否保留原始图片",
        async exec(files, options) {
            for (var config of arr) {
                var { list, save } = config;
                var flash = ["if(!window.flashObjects)window.flashObjects=[];var lib,images,ss;"];
                for (var url of list) {
                    if (typeof url.config === "string") url.config = { key: url.config };
                    flash.push("lib={};images={};ss={};");
                    let data = await callFs("readFile", url.path);
                    flash.push(data.toString());
                    flash.push("flashObjects.push([" + JSON.stringify(url.config) + ",lib,images,ss]);");

                    if (!url.skip && !(options.s || options.skip)) {
                        for await (var ff of getFiles(path.join(path.dirname(url.path), "images"), /\.(?:jpg|png|svg|gif)$/, false)) {
                            var td = path.join(res, (url.config.images || url.config.key));
                            if (!fs.existsSync(td)) fs.mkdirSync(td);
                            var tt = path.join(td, path.basename(ff.path));
                            if (options.exist || options.e) {
                                if (fs.existsSync(tt)) continue;
                            }
                            console.log("正在处理" + ff.path);
                            //images(ff.path).save(tt);
                            fs.copyFileSync(ff.path, tt);
                            if (!(options.r || options.raw)) await pngquant(tt);
                        }
                    }
                }
                var js = flash.join('\r\n');
                await saveObject(js, save);
            }

        },
        limit: 0
    }
}