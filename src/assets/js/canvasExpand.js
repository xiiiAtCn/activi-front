/**
 * canvas 扩展功能
 * 
 * Author: w.m.
 * CreateDate：2016/11/28
 * History：
 */

/**
 *  绘制圆形
 * 
 * @param {Number} x 圆心x坐标
 * @param {Number} y 圆心y坐标
 * @param {Number} r 半径
 */
CanvasRenderingContext2D.prototype.fillArc = function (x, y, r) {
	this.beginPath();
	this.arc(x, y, r, 0, Math.PI * 2, true);
	this.closePath();
	this.fill();
}

/**
 * 绘制带有圆角的方框
 * 
 * @param {Number} x  绘制开始点x坐标
 * @param {Number} y  绘制开始点y坐标
 * @param {Number} width  方框宽度
 * @param {Number} height  方框高度
 * @param {Object} radius 4个圆角半径，默认为0 0 0 0
 * @param {Boolean} fill 是否填充该方框. 默认为 false，不填充。
 * @param {Boolean} stroke 该方框是否有边框. 默认为 true，有边框。
 */
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
	var cornerRadius = {ul: 0, ur: 0, ll: 0, lr: 0};
	
	if (typeof fill == "undefined") {
		fill = false;
	}
	
	if (typeof stroke == "undefined") {
		stroke = true;
	}

	if (typeof radius === "object") {
		for (var side in radius) {
			cornerRadius[side] = radius[side];
		}
	}

	this.beginPath();
	this.moveTo(x + cornerRadius.ul, y);
	this.lineTo(x + width - cornerRadius.ur, y);
	this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.ur);
	this.lineTo(x + width, y + height - cornerRadius.lr);
	this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lr, y + height);
	this.lineTo(x + cornerRadius.ll, y + height);
	this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.ll);
	this.lineTo(x, y + cornerRadius.ul);
	this.quadraticCurveTo(x, y, x + cornerRadius.ul, y);
	this.closePath();
	
	// 是否填充
	if (fill) {
		this.fill();
	}
	
	// 是否有边框
	if (stroke) {
		this.stroke();
	}
}

function setCursor(str) {
	canvas.style.cursor = str;
}