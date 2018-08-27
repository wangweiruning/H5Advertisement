const imageCaches = {};

/**
 * 获取缓存的图片
 * @param {*} key 图片索引key（路径）
 */
export function getImageCache(key) {
    return imageCaches[key];
}

//把dataurl转换为blob
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
}

/**
 * 加载图片并存储进入内存
 * @param {*} img 图片地址(url)或者图片配置([key,url])
 */
function loadImageItem(img) {
    if (typeof img === "string") img = [img, getVersionUrl("images/" + img)];
    return new Promise((ps, pe) => {
        var i = new Image();
        i.onload = () => ps(i);
        i.onerror = () => ps();
        i.onabort = i.onerror;
        if (img[1].substr(0, 5) == 'data:') {
            var blob = dataURLtoBlob(img[1]);
            i.src = URL.createObjectURL(blob);
        }
        else i.src = img[1];
        imageCaches[img[0]] = i;
    });
}

/**
 * 获得图片路径，如果没有缓存，就直接返回网络路径
 * @param {*} url 获得图片路径
 */
export function getImageUrl(url) {
    var src = getImageCache(url);
    if (src) return src.src;
    return getVersionUrl(url);
}

/**
 * 输入格式：[[key,url],[key,url]]，或者[url,url]
 */
export async function loadImages(arr) {
    for (var item of arr.map(o => loadImageItem(o))) await item;
}

/**
 * 输入格式：[[key,url],[key,url]]，或者[url,url]
 */
export function loadMusic(arr) {
    if (!window.createjs) throw new Error("需要createjs的支持，并且需要引入Sound模块");
    return new Promise((ps, pe) => {
        var preloader = new createjs.LoadQueue(true);
        preloader.installPlugin(createjs.Sound);
        for (var i = 0; i < arr.length; ++i) {
            var img = arr[i];
            if (typeof img === "string") img = [img, getVersionUrl("music/" + img)];
            if (img[1].substr(0, 5) == 'data:') {
                var blob = dataURLtoBlob(img[1]);
                img[1] = URL.createObjectURL(blob);
            }
            console.log([img[0].split(".")[0], img[1]]);
            preloader.loadFile({src: img[1], id: img[0].split(".")[0]});
        }
        preloader.addEventListener('complete', ps);
    });
}

