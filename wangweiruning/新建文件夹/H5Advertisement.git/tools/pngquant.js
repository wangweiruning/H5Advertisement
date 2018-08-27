/**
 * 压缩png
 */
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { callFs, getFiles, callFsPass } from "./files";
import images from "images";

function asyncExec(cmd) {
    return new Promise(ps => exec(cmd, function(err, stdout, stderr) {
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        ps(err);
    }));
}

/**
 * 压缩png
 * @param file png图片路径
 */
export async function pngquant(file, copy) {
    //不是png就跳过
    if (path.extname(file) != ".png") {
        return;
    }
    
    var b = file.substr(0, file.length - 4);
    var b0 = file;
    if (copy) {
        b += "-pr8";
        b0 = b + ".png";
        images(file).save(b0);
        images.gc();
    }

    //将生成*-fs8.png
    await asyncExec(path.join(__dirname, "pngquant") + ' --force --verbose --quality=45-85 "' + b0 + '"');
    //将生成*-or8.png，可能会失败
    await asyncExec(path.join(__dirname, "pngquant") + ' --force --verbose --ordered --speed=1 --quality=55-95 "' + b0 + '"');

    if (copy) await callFs("unlink", b0);
    
    var b1 = b + "-fs8.png";
    var b2 = b + "-or8.png";

    //检查命令完成情况
    var e1 = await callFsPass("exists", b1);
    var e2 = await callFsPass("exists", b2);

    //如果两个命令都失败，就放弃吧
    if (!e1 && !e2) {
        return;
    }

    b = b2;
    //如果*-or8.png不存在，就直接用*-fs8.png
    if (!e2) {
        b = b1
    }
    else if (e1) {
        //比较文件大小
        var i1 = await callFs("stat", b1);
        var i2 = await callFs("stat", b2);

        //使用文件较小的图片，并删掉另一张
        if (i1.size < i2.size) {
            b = b1;
        }
    }

    //移动结果
    await callFs("unlink", file);
    await callFs("link", b, file);

    if (e1) await callFs("unlink", b1);
    if (e2) await callFs("unlink", b2);
}


/**
 * 压缩某一文件夹下的所有png
 * @param file png图片所在的文件夹路径
 * @param sub 是否处理子文件夹
 */
export async function pngquantDir(dir, sub) {
    for await (let file of getFiles(dir, /\.png$/, sub)) {
        await pngquant(file.path);
    }
}