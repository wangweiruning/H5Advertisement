import React from "react";
import { getImageCache } from "./loading";

var flashCache = {};
function flushFlashCache() {
    for (var config of flashObjects) {
        if (flashCache[config[0].key]) continue;
        flashCache[config[0].key] = {
            key: config[0].key,
            dir: config[0].images || config[0].key,
            root: config[0].root || config[0].key,
            lib: config[1],
            images: config[2],
            ss: config[3]
        };
    }
}

export function loadFlashImages() {
    var first = true;
    flushFlashCache();
    for (var config of flashObjects) {
        var item = flashCache[config[0].key];
        var lib = item.lib;
        var images = item.images;


        var list = lib.properties.manifest;
        for (var ii of list) {
            var url = ii.src.split('?')[0];
            url = item.dir + url.substr(6);
            var img = getImageCache(url);
            if (img) images[ii.id] = img;
        }

        var ss = item.ss;
        var ssMetadata = lib.ssMetadata;
        for(var i=0; i<ssMetadata.length; i++) {
            var img = images[ssMetadata[i].name];
            if (img) ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [img], "frames": ssMetadata[i].frames} )
        }
        if (first) {
            createjs.Ticker.setFPS(lib.properties.fps);
            first = false;
        }
    }
}

/**
 * flash显示控件
 *      <Flash flash="flash key" />
 *      请配合flash2js工具使用（/tools/flash.js）
 */
export class Flash extends React.Component {
    stage = null;
    root = null;
    componentDidMount() {
        var config = flashCache[this.props.flash];
        if (!config) return;
        var lib = config.lib;
        this.root = new lib[config.root]();
        this.stage = new createjs.Stage(this.refs.root);
        this.stage.addChild(this.root);
		createjs.Ticker.addEventListener("tick", this.stage);
    }
    componentWillUnmount() {
		createjs.Ticker.removeEventListener("tick", this.stage);
    }
    render() {
        var config = flashCache[this.props.flash];
        if (!config) return null;
        var lib = config.lib.properties;
        var width = this.props.width || lib.width;
        var height = this.props.height || lib.height;
        return <canvas ref="root" width={width} height={height} className={this.props.className} style={{width:width/100+"rem",height:height/100+"rem",...this.props.style}} />;
    }
}