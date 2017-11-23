/**
 * 链接线类型
 * 
 * Author: w.m.
 * CreateDate：2016/12/09
 * History：
 */
var LINK_TYPE_FS = 0;
var LINK_TYPE_SS = 1;
var LINK_TYPE_FF = 2;
var LINK_TYPE_SF = 3;

function LinkType() {
}
LinkType.prototype.datas = ["FS", "SS", "FF", "SF"];
LinkType.prototype.getName = function(type) {
	return this.datas[type];
}