/**
 * 状态链接点
 * 
 * Author: w.m.
 * CreateDate：2016/12/09
 * History：
 */
function StatusLinkPoint(x, y){
	var point = new Object;
	point.x = x;
	point.y = y;
	point.joinNodeId = 0;
	point.joinType = 0;
	
	point.showColor = function(){
		document.write(this.color)
	};
	return point;
}