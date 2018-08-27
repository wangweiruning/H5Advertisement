import { png2jpg, pngquant, files2js, html2js } from "./tools/preset";
import { flash2js } from "./tools/flash";
import path from "path";

var imageDir = path.join(__dirname, "res/img/");
var imagesConfig = {
    images: {
        filter: [/^(?!loading)/, /\.(?:jpg|png|svg|gif)$/],
        name: "imagesJson",
        dir: imageDir
    },
    loadImages: {
        filter: [/^(?:loading)/, /\.(?:jpg|png|svg|gif)$/],
        name: "loadImagesJson",
        dir: imageDir
    }
};

//索引文件
var myFiles2Js = files2js(
    imagesConfig
    , path.join(__dirname, "dist/assets/")
    , "var #name# = #json#;"
);

//处理psd导出的html
var myHtml2Js = html2js(imageDir
    , '<img ref="#id#" src={getImageUrl("#url#")} style={{left:"#left#rem",top:"#top#rem",width:"#width#rem",height:"#height#rem"}} className="abs" />');


var flashConfig = [{
    list: [{
        path: path.join(__dirname, "ani/loading/loading.js"),
        config: "loading"
    }],
    save: path.join(__dirname, "dist/assets/flash.js")
}];

//处理flash
var myFlash2Js = flash2js(flashConfig, imageDir);

//批处理结束后，重新索引文件
myFlash2Js.onend = myHtml2Js.onend = myFiles2Js.exec;

let output = {
    png2jpg,
    pngquant,
    files2js: myFiles2Js,
    html2js: myHtml2Js,
    flash2js: myFlash2Js
};

export default output;