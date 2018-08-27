/***
* @ 通过导入psd文件，分析图层，将可见图层导出单独的png文件，并生成记录图层坐标和尺寸的json或者xml文件或者html文件
* @ author nickfu
* @ 2013-01-06
#target photoshop
**/


//基本配置
var originalRulerUnits = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;
var docRef = app.activeDocument;
var psdName = docRef.name;
var psdName = psdName.replace(/.psd/, '');
var docWidth = docRef.width.value;
var docHeight = docRef.height.value;


var config = {
	imgFolder: psdName,   //导出图片保存文件夹路径
	saveLocation: activeDocument.fullName.path + '/'+psdName+'/',  //导出图片保存目录，默认与psd同目录
	mySourceFilePath: activeDocument.fullName.path + '/',  //生成的xml/json/html文件保存目录，默认与psd同目录
	saveType: ['html'],//['html','json'], //生成的文件类型html/json/xml 支持同时生成多个类型
	exportIndex: 1//3   //脚本处理psd合并文件夹和导出的层级，1为第一层，2为第二层，，，，
}

var stackorder = 0;  //导出图层层级，默认最底层为 0
var exportData = {
	page: {
		width: docWidth,
		height: docHeight
	},
	div: {}
};  //记录将要导出的图层信息

var imgFolder = new Folder(config.saveLocation);//创建保存目录
imgFolder.create();

//判断是否有psd文件打开
function docCheck() {
    if (!documents.length) {
        alert('photoshop 没有psd文件打开');
        return;
    }
}


//保存png图片方法,docRef为当前的activeDocument, savePath 为保存文件夹, fileName 为保存的图片名称
function savePng(docRef, savePath, fileName){
	var saveFile = new File(savePath + fileName + '.png');
	pngSaveOptions = new PNGSaveOptions();
	pngSaveOptions.interlaced = false;
	docRef.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);
}


//  Code to get layer index / descriptor
var cTID = function(s) {
	return app.charIDToTypeID(s);
}
var sTID = function(s) {
	return app.stringIDToTypeID(s);
}
function getLayerDescriptor (doc, layer) {
	var ref = new ActionReference();
	ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
	return executeActionGet(ref)
}

function getLayerID(doc, layer) {
	var d = getLayerDescriptor(doc, layer);
	return d.getInteger(cTID('LyrI'));
}
function cLayer(doc, layer) {
	//this.layerID = Stdlib.getLayerID(doc, layer);
	this.layerID = getLayerID(doc, layer);
	//alert("layer ID: " + this.layerID);
	this.layerWidth = layer.bounds[2].value - layer.bounds[0].value;
	this.layerHeight = layer.bounds[3].value - layer.bounds[1].value;

	// these return object coordinates relative to canvas
	this.upperLeftX = layer.bounds[0].value;
	this.upperLeftY = layer.bounds[1].value;
	this.upperCenterX = this.layerWidth / 2 + layer.bounds[0].value;
	this.upperCenterY = layer.bounds[1].value;
	this.upperRightX = layer.bounds[2].value;
	this.upperRightY = layer.bounds[1].value;
	this.middleLeftX = layer.bounds[0].value;
	this.middleLeftY = this.layerHeight / 2 + layer.bounds[1].value;
	this.middleCenterX = this.layerWidth / 2 + layer.bounds[0].value;
	this.middleCenterY = this.layerHeight / 2 + layer.bounds[1].value;
	this.middleRightX = layer.bounds[2].value;
	this.middleRightY = this.layerHeight / 2 + layer.bounds[1].value;
	this.lowerLeftX = layer.bounds[0].value;
	this.lowerLeftY = layer.bounds[3].value;
	this.lowerCenterX = this.layerWidth / 2 + layer.bounds[0].value;
	this.lowerCenterY = layer.bounds[3].value;
	this.lowerRightX = layer.bounds[2].value;
	this.lowerRightY = layer.bounds[3].value;

	// I'm adding these for easier editing of flash symbol transformation point (outputs a 'x, y' format)
	// because I like to assign shortcut keys that use the numeric pad keyboard, like such:
	//		7	8	9
	//		4	5	6
	//		1	2	3
	//
	this.leftBottom = this.lowerLeftX + ", " + this.lowerLeftY;
	this.bottomCenter = this.lowerCenterX + ", " + this.lowerCenterY;
	this.rightBottom = this.lowerRightX + ", " + this.lowerRightY;

	this.leftCenter = this.middleLeftX + ", " + this.middleLeftY;
	this.center = this.middleCenterX + ", " + this.middleCenterY;
	this.rightCenter = this.middleRightX + ", " + this.middleRightY;

	this.leftTop = this.upperLeftX + ", " + this.upperLeftY;
	this.topCenter = this.upperCenterX + ", " + this.upperCenterY;
	this.rightTop = this.upperRightX + ", " + this.upperRightY;

	// these return object coordinates relative to layer bounds
	this.relUpperLeftX = layer.bounds[1].value - layer.bounds[1].value;
	this.relUpperLeftY =  layer.bounds[0].value - layer.bounds[0].value;
	this.relUpperCenterX = this.layerWidth / 2;
	this.relUpperCenterY = layer.bounds[0].value - layer.bounds[0].value;
	this.relUpperRightX = this.layerWidth;
	this.relUpperRightY = layer.bounds[0].value - layer.bounds[0].value;
	this.relMiddleLeftX = layer.bounds[1].value - layer.bounds[1].value;
	this.relMiddleLeftY = this.layerHeight / 2;
	this.relMiddleCenterX = this.layerWidth / 2;
	this.relMiddleCenterY = this.layerHeight / 2;
	this.relMiddleRightX = this.layerWidth;
	this.relMiddleRightY = this.layerHeight / 2;
	this.relLowerLeftX = layer.bounds[1].value - layer.bounds[1].value;
	this.relLowerLeftY = this.layerHeight;
	this.relLowerCenterX = this.layerWidth / 2;
	this.relLowerCenterY = this.layerHeight / 2;
	this.relLowerRightY = this.layerHeight;
	this.relLowerRightX = this.layerWidth;
	this.relLowerRightY = this.layerHeight;

	return this;
}


// function from Xbytor to traverse all layers
var traverseLayers = function(doc, ftn, reverse) {
	function _traverse(doc, layers, ftn, reverse) {
		var ok = true;
		var len = layers.length;
		for (var i=1; i<=len && ok!=false; i++) {
			var index = (reverse == true) ? layers.length-i : i - 1;
			var layer = layers[index];
			if (layer.typename == "LayerSet") {
				ok = _traverse(doc, layer.layers, ftn, reverse);
			}else{
				stackorder = stackorder + 1;
				ok = ftn(doc, layer, stackorder);
			}
		}
		return ok;
	}
	return _traverse(doc, doc.layers, ftn, reverse);
}

// 设置导出格式
function exportBounds(doc, layer, zIndex) {
	var isVisible = layer.visible;
	var layerData = cLayer(doc, layer);
	if(!isVisible){
		return ;
	}
	var position = leftTop.replace(/\s/ig, "").split(',');   //leftTop数据格式为(236 ,123)
	exportData.div[layer.name] = {
		zIndex: zIndex -1 ,
		width: layerData.layerWidth,
		height: layerData.layerHeight,
		left: parseFloat(position[0]),
		top: parseFloat(position[1]),
		img: layer.name+'.png'
	}
	if(layerData.layerWidth<1){   //判断该图层，若宽度为0，则为空图层，避免复制导出的时候出错
		return;
	}
	var bLayer = layer.copy(false); //copy 两个参数 true/false，是否把所有可见图层内容都复制
	var newDocRef = app.documents.add(layerData.layerWidth, layerData.layerHeight, 72, "Merged Samples", NewDocumentMode.RGB, DocumentFill.TRANSPARENT, 1);
	app.activeDocument.paste();

	savePng(newDocRef, config.saveLocation, layer.name); //存储图片
	app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

}

//合并图层方法,depth为需要导出的当前层深
function mergeLayerSet(doc, depth, index){
	var index = (typeof index!='undefined') ? index : 0;
	if(index < depth){
		var len = doc.layers.length;
		for(var i=0;i<len;i++){
			var curLayer = doc.layers[i];
			if(curLayer.typename=='LayerSet'){
				mergeLayerSet(curLayer,depth,index+1);  //每次递归，层级-1，达到0，则合并
			}
		}
	}else if(index == depth){
		var len = doc.layerSets.length;
		for(var j=0;j<len;j++){
			var curLayerSet = doc.layerSets[0];
			curLayerSet.merge();
		}
	}
	

}
//图层改名，改成有规则名称 1-1-1，1-2-1  数字为当前图层所在层的index值，数字个数表示所在层深
function changeName(doc){
	var layerNum = doc.layers.length;
	for(var i=0;i<layerNum;i++){
		var curLayer = doc.layers[i];
		var parLayer = curLayer.parent;
		if(parLayer.typename=='Document'){
			var parName = psdName;
		}else{
			var parName = parLayer.name;
		}

		curLayer.name = parName+'_'+i;

		if(curLayer.typename=='LayerSet'){
			changeName(curLayer);
		}else if(curLayer.typename=='ArtLayer'){
			var curLayer = createSmartObject(curLayer); //转换智能对象,防止导出滤镜和蒙版出错
			//curLayer.rasterize(RasterizeType.ENTIRELAYER);   //顺便栅格化图层，防止一些滤镜和蒙版在导出单独图像时出错
		}
	}
}
// 转换成智能对象
function createSmartObject(layer){
	var layer = layer != undefined ? layer : docRef.activeLayer;
   
	if(docRef.activeLayer != layer){
		docRef.activeLayer = layer;
	}
    var idnewPlacedLayer = stringIDToTypeID( "newPlacedLayer" );
    executeAction(idnewPlacedLayer, undefined, DialogModes.NO );
    return docRef.activeLayer;
}
//输出文档格式
function outputFile(fileName){
	//输出html格式
	function _html(){  
		var output = '';
		var data = exportData.div;
		for(var k in data){
            output = output + "\r\n\t" + '<img style="position:absolute;display:block;top:'
                + data[k]['top'] + 'px;left:'
                + data[k]['left'] + 'px;width:'
                + data[k]['width'] + 'px;height:'
                + data[k]['height'] + 'px" src="' + config.imgFolder + '/' + data[k]['img'] + '" />';
		}
		var fileStr = '<html><head></head><body>'+output+'\r\n</body></html>';

		//创建文件，并写入内容
		var csvFile = new File(config.mySourceFilePath.toString().match(/([^\.]+)/)[1] + fileName+ ".html");
		csvFile.open('w');
		csvFile.writeln(fileStr);
		csvFile.close();
	}

	 //输出json格式
	function _json(){  
		function _obj2str(o){ //object 转换字符串
			var r = [];
			if(typeof o =="string"){
				return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
			}
			if(typeof o == "object"){
				if(!o.sort){
					for(var i in o){
						r.push('"'+i+'":'+_obj2str(o[i]));
					}
					if(!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
						r.push("toString:"+o.toString.toString());
					}
					r="{"+r.join()+"}";
				}else{
					for(var i =0;i<o.length;i++){
						r.push(_obj2str(o[i]))
					}
					r="["+r.join()+"]"
				}
				return r;
			}
			return o.toString();
		}

		var fileStr = _obj2str(exportData);

		//创建文件，并写入内容
		var csvFile = new File(config.mySourceFilePath.toString().match(/([^\.]+)/)[1] + fileName + ".html.json");
		csvFile.open('w');
		csvFile.writeln(fileStr);
		csvFile.close();
	}

	for(var k in config.saveType){
		switch(config.saveType[k]){
			case 'html':
				_html();
			break;
			case 'json':
				_json();
			break;
		}
	}
}

//step1.  检查是否有psd文件打开 
docCheck();

//step2.  图层改名
changeName(docRef);

//step3.  循环执行导出操作
for(var i=config.exportIndex-1;i>=0;i--){  //要递减处理，先合并导出最底层
	// 合并图层
	mergeLayerSet(docRef,i);

	// 执行图层导出操作
	traverseLayers(docRef, exportBounds, true); 

	//生成文档
	outputFile(i+'_'+psdName);
	
	//清空上一次动作保存的数据，一定要清空，，不然会增量添加
	exportData.div = {};
}

//step4.  执行完成，进行提示
preferences.rulerUnits = originalRulerUnits;
alert('恭喜你，成功了！');