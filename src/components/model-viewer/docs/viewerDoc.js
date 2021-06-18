/* eslint-disable*/

// Viewer简要使用文档
// Todo: jsDoc直接生成

/**
 * 初始化Viewer
 *
 * @class Viewer
 * @param {Object} [param]
 * @param {HTMLCanvasElement} [param.canvas]
 * @param {Number} [param.width]
 * @param {Number} [param.height]
 * @param {Number} [param.dpr=1]
 * @param {Object} [param.envSetting] - 环境配置数据 之前ideation此处的接口：http://sit.4dshoetech.local/backend/show/renderTask/envsetting/v2?shoeId=xxxxx&relateType=0
 * @param {Boolean} [param.isMobile=false] - 通过UA判断是否为移动端的结果
 *
 */
let param = {
	canvas: canvasDom,
	width: canvasDom.clientWidth,
	height: canvasDom.clientHeight,
	resolution: window.devicePixelRatio,
	envSetting: envSettingData,
	isMobile: false
};
let viewer = new Viewer(param);

/********************************************** 事件监听 **********************************************/

/**
 * 窗口大小Resize
 * @function resizeRenderer
 * @param {Number} width
 * @param {Number} height
 * @param {Number} devicePixelRatio
 */

window.addEventListener('resize', resizeWindow);
function resizeWindow() {
	viewer.resizeRenderer(window.innerWidth, window.innerHeight, window.devicePixelRatio);
}

// 控制器事件(可参考Ideation调用D4)
canvasDom.addEventListener('mousedown', controlsMouseDown);
function controlsMouseDown(event) {
	const isStart = viewer.controlsMouseDown(event);
	if (isStart) {
		document.addEventListener('mousemove', controlsMouseMove);
		document.addEventListener('mouseup', controlsMouseUp);
	}
}
function controlsMouseMove(event) {
	viewer.controlsMouseMove(event);
}
function controlsMouseUp() {
	viewer.controlsMouseUp();
	document.removeEventListener('mousemove', controlsMouseMove);
	document.removeEventListener('mouseup', controlsMouseUp);
}

canvasDom.addEventListener('wheel', controlsMouseWheel);
function controlsMouseWheel(event) {
	event.preventDefault();
	event.stopPropagation();

	viewer.controlsMouseWheel(event);
}

// 渲染更新事件
canvasDom.addEventListener('wheel', viewer.render.bind(viewer));
canvasDom.addEventListener('mousemove', viewer.controlsMoveRender.bind(viewer));
canvasDom.addEventListener('mouseup', viewer.render.bind(viewer));

// 移动端事件监听
canvasDom.addEventListener('touchstart', controlsTouchStart, false);
canvasDom.addEventListener('touchmove', controlsTouchMove, false);
canvasDom.addEventListener('touchend', controlsTouchEnd, false);
function controlsTouchStart(event) {
	event.preventDefault();
	viewer.controlsTouchStart(event);
}
function controlsTouchMove(event) {
	event.preventDefault();
	viewer.controlsTouchMove(event);
}
function controlsTouchEnd(event) {
	viewer.controlsTouchEnd(event);
}

canvasDom.addEventListener('touchstart', viewer.render.bind(viewer), false);
canvasDom.addEventListener('touchend', viewer.render.bind(viewer), false);
canvasDom.addEventListener('touchmove', viewer.controlsMoveRender.bind(viewer), false);

/********************************************** 模型加载 **********************************************/

// Tips: dpm接入前这里用4ddat跑通测试，可参考Ideation调用D4.loadModel
/**
* @function loadModel 
* @param {Array} model
* @param {String} model[].componentID - 部件id
* @param {String} model[].componentName - 部件名称
* @param {String} model[].url - ctm路径
* @param {Object} model[].material
* @param {String} model[].material.materialID - 材质id
* @param {String} model[].material.name - 材质名称
* @param {String} model[].material.renderArgument - 材质渲染参数
* @param {Function} notify 进度,{function notify(loaded, total, process) {}
* @return {Object} - promise对象，已包括所有部件ctm加载的promise
*/
viewer.loadModel(model, loadingStatus_ => {
	let percent = Math.round((loadingStatus_.loaded / loadingStatus_.total) * 100);
	console.log(
		'loading ' + percent + '%',
		(Date.now() - start) / 1000 + 's',
		'\n--------------------------------------'
	);
}).then(
	() => {
		console.log('finish');
	},
	e => {
		console.error(e.errors, e.result); // 加载错误列表， 加载成功列表
	}
);

/********************************************** 功能方法 **********************************************/

/**
 * @function resetControls - 相机复位
 */
viewer.resetControls();

 /**
 * @function restoreDefaultMaterial - 重置场景中的所有材质为默认材质
 * @return {Promise}
 */
viewer.restoreDefaultMaterial();

/**
 * @function restoreDefaultMaterial - 更换指定部件为指定材质
 * @param {Array} targetList - 需要更换材质的部件的列表
 * @param {Object} newMaterialInfo - 更换的材质信息
 * @param {CSSStyleColor} color - 色值，比如'rgb(255,255,255)'
 * @return {Promise}
 */
viewer.changeTargetComponentsMaterial(targetList, newMaterialInfo, color);

/**
 * @function setMaterialColor - 切换展示的材质颜色
 * @param {CSSStyleColor} color - 色值，比如'rgb(255,255,255)'
 */
 viewer.setMaterialColor(color);

 /**
 * @function reloadModel - 加载新模型
 * 所有参数与返回值都与loadModel方法保持完全一致，这里不再重复
 */
viewer.reloadModel(model, loadingStatus_);