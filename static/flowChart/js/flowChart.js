/**
 * 业务流程图生成JS
 *
 * Author: w.m.
 * CreateDate：2016/11/28
 * History：
 */
var proWf = null;
var jobMeta;
var lastOkJobMeta = null;
var okJobMetaList = null;
var selStatusMap = null;
var selLink = null;
var selSwimlane = null;
var selJobMeta = null;
var selPt = null;

var execLinkList = null;

var ww = 0;
var hh = 0;
var SX = 0;
var SY = 2;
var sx = SX;
var sy = SY;
var px = 0;
var py = 0;
var px0 = 0;
var py0 = 0;
var isDrag = false;

var STATUS_COLOR = "rgb(228, 228, 228)";

var ICON_WW_1 = 32;
var ICON_WW_2 = 24;

var DEFAULT_NODE_WW = 150;
var DEFAULT_NODE_HH = 48;
var DEFAULT_NODE_WW_SC = 48;
var WORK_NODE_HH = 72;

var swimlaneDragMode = 0;
var swimlaneMoveOffsetX = 0;
var isViewMode = false;
var isSelLinkName = false;

//FormStatusMapType
var CONFIRM_STATUS = 0;
var WORK_STATUS = 1;
var SELECT_NODE = 2;
var COMBINE_NODE = 3;
var STOP_NODE = 4;

var PRO_STOP_NODE_TYPE_NORMAL = 0;
var PRO_STOP_NODE_TYPE_CANSEL = 1;
var PRO_STOP_NODE_TYPE_ABNORMAL = 2;

var PRO_COMBINE_NODE_TYPE_OR_COMBINE = 0;
var PRO_COMBINE_NODE_TYPE_AND_COMBINE = 1;
var PRO_COMBINE_NODE_TYPE_EXPRESS_COMBINE  = 2;

var PRO_SELECT_NODE_TYPE_ALL_SEL     = 0;
var PRO_SELECT_NODE_TYPE_EXPRESS_SEL = 1;

var MODE_MOVE                 = 0;
var MODE_NEW_WORK_FLOW        = 1;
var MODE_NEW_STEP_LINK        = 2;
var MODE_RESIZE_STEP          = 3;
var MODE_MODIFY_PROP          = 4;
var MODE_SHOW_EDIT_FIELD      = 5;
var MODE_RESIZE_X1            = 6;
var MODE_RESIZE_X2            = 7;
var MODE_NEW_STEP_SEL         = 8;
var MODE_NEW_SWIMLANE         = 9;
var MODE_NEW_JOBNODE          = 10;
var MODE_NEW_SELECT_NODE      = 11;
var MODE_NEW_COMBINE_NODE     = 12;
var MODE_NEW_STOP_NODE        = 13;
var MODE_NEW_START_NODE       = 14;

var PRO_JB_MT_CLS_START_NODE = 0;
var PRO_JB_MT_CLS_JOB_NODE = 1;
var PRO_JB_MT_CLS_SELECT_NODE = 2;
var PRO_JB_MT_CLS_COMBINE_NODE = 3;
var PRO_JB_MT_CLS_WORK_FLOW = 4;
var PRO_JB_MT_CLS_STOP_NODE = 5;

var drawMode = MODE_MOVE;
var paneWorkFlowNodeList
var canvas = null;
var gc = null;
var adjustmentGap = 4;
var isShowAGMember = false;

var inputIconMap;
var inputValueMap;
var inputFullValueMap;

var outputIconMap;
var outputValueMap;
var outputFullValueMap;
var jobMeta;

window.onload=function () {
    drawFlowChart(window.location.search.split("=")[1], "");
};

// 根据WFMetaId画取工作流定义数据，并画出工作流示意图
function drawFlowChart(proWfMetaId) {
	
	lastOkJobMeta = null;
	okJobMetaList = null;
	selStatusMap = null;
	selLink = null;
	selSwimlane = null;
	selJobMeta = null;
	selPt = null;

	$("#panelbar").html("");

	// 获得流程示意图数据
	$.ajax({
		type: "GET",
		dataType: "json",
		contentType: "application/json",
	    url: "/api/webserverconf/entitygrid/FlowChartForm",
	    async: false,
	    data: {id: proWfMetaId},
	    success: function (data) {
	    	if (data) {
	    		
	    		// 更新对应行的数据
	    		proWf = data;
	    		
	    		inputIconMap = proWf.inputIconMap ;
	    		inputValueMap = proWf.inputValueMap;
	    		inputFullValueMap = proWf.inputFullValueMap;

	    		outputIconMap = proWf.outputIconMap;
	    		outputValueMap = proWf.outputValueMap;
	    		outputFullValueMap = proWf.outputFullValueMap;
	    		execLinkList = proWf.execLinkList;

                okJobMetaList = proWf.okJobMetaList;

                // 获取画面画布
                canvas = document.getElementById("FrmStatusCan");

                // 获取绘制上下文
                gc = canvas.getContext("2d");

                // 设置起始坐标,保证细线效果
                gc.translate(0.5, 0.5);

                gc.font = FORMFONT;

                // 点击事件
                //canvas.addEventListener('click', onClick, false);

                ww = proWf.ww;
                hh = proWf.hh;

                // 鼠标移动事件
                //canvas.addEventListener('mousemove', onMouseMove, false);

                // 鼠标按下事件
                //canvas.addEventListener('mousedown', onMouseDown, false);

                // 鼠标抬起事件
                //canvas.addEventListener('mouseup', onMouseUp, false);

                canvas.width = ww;
                canvas.height = hh;

                //gc.scale(1, 1);
                // 绘制示意图
                drawChart();

	    	} else {
	        	// 如果在服务器端处理出错的话
	            //bootbox.alert(data.message);
	            return;
	        }
	    },
	    error: function (data) {
	    	bootbox.alert("发生错误，请与管理员联系!");
	        return;
	    }
	});
}

/**
 * 鼠标按键按下事件
 * 
 * @param e 事件消息
 */
function onMouseDown(e) {
	
	// 事件触发区域，外部边框
	var rect = e.target.getBoundingClientRect();
	
	// 换算成事件触发区域内部坐标
	var mex = e.clientX - rect.left;
	var mey = e.clientY - rect.top;
		
	px = mex;
	py = mey;
	px0 = mex;
	py0 = mey;
	isDrag = false;
	swimlaneDragMode = 0;
	swimlaneMoveOffsetX = 0;
	
	if (isViewMode) {
		return;
	}
	
	if (36 > mex && 36 > mey) {
		if (ACTIONTYPE_INSERT == jobMeta.actionType || ACTIONTYPE_UPDATE == jobMeta.actionType) {
			return;
		}
	}
	
	if (MODE_NEW_CONFIRM_STATUS == drawMode || MODE_NEW_WORK_STATUS == drawMode
			|| MODE_NEW_SELECT_NODE == drawMode || MODE_NEW_COMBINE_NODE == drawMode
			|| MODE_NEW_STEP_LINK == drawMode || MODE_SHOW_EDIT_FIELD == drawMode || MODE_NEW_STOP_NODE == drawMode) {
		return;
	}
	
	if (MODE_RESIZE_X1 == drawMode || MODE_RESIZE_X2 == drawMode) {
		return;
	}
	
	// 查找被选中的对象
	findSelObj(mex, mey);
	drawChart();
	
	// 如果发生按下事件，将鼠标移动事件切换成鼠标拖拽时间
	canvas.onmousemove = onMouseDrag;
}

/**
 * 鼠标按键抬起事件
 * 
 * @param e 事件消息
 */
function onMouseUp(e) {
	
	// 事件触发区域，外部边框
	var rect = e.target.getBoundingClientRect();
	
	// 换算成事件触发区域内部坐标
	var mex = e.clientX - rect.left;
	var mey = e.clientY - rect.top;
	
	var preSx = sx;
	
	if (sx > SX) {
		sx = SX;
	}
	if (sy > SY) {
		sy = SY;
	}
	if (null == jobMeta) {
		return;
	}
	
	if (sx < 200 - jobMeta.ww) {
		sx = 200 - jobMeta.ww;
	}
	
	if (sy < 200 - jobMeta.hh) {
		sy = 200 - jobMeta.hh;
	}
	
	//if (null != pagmv && getChildren().contains(pagmv)) {
	//	pagmv.setTranslateX(pagmv.getTranslateX() + sx - preSx);
	//}
	
	if (isViewMode) {
		drawChart();
		if (!isDrag) {
			showAuthorityGroupMember(e);
		}
		return;
	}
	
	if (36 > mex && 36 > mey) {
		if (ACTIONTYPE_INSERT == jobMeta.actionType || ACTIONTYPE_UPDATE == jobMeta.actionType) {
			saveAction();
			return;
		}
	}
	
	switch (drawMode) {
		case MODE_MOVE: 
			// 左侧内容区显示
			if(null != paneWorkFlowNodeList){
				if(null != selStatusMap){
					//paneWorkFlowNodeList.setFormHandleStatusMap(selStatusMap,false);
				} else if(null != selStatusTransfer){
					//paneWorkFlowNodeList.setFormStatusTransfer(selStatusTransfer,false);
				} else{
					//paneWorkFlowNodeList.setjobMeta(jobMeta);
				}
				//paneWorkFlowNodeList.drawView();
			}
			break;
		case MODE_NEW_CONFIRM_STATUS:
		case MODE_NEW_WORK_STATUS:
		case MODE_NEW_SELECT_NODE:
		case MODE_NEW_STOP_NODE:
		case MODE_NEW_COMBINE_NODE:

		/*	if (null == jobMeta) {
				return;
			}
			FormHandleStatusMap newNode = new FormHandleStatusMap();
			newNode.setPrivateMapId(jobMeta.calcMaxSID());
			newNode.sx = mex - sx;
			newNode.sy = mey - sy;
			newNode.hh = DEFAULT_NODE_HH;
			
			if (MODE_NEW_CONFIRM_STATUS == drawMode) {
				if (null == formStatusSel) {
					return;
				}
				newNode.formHandleStatus = formStatusSel;
				newNode.setStatusId(formStatusSel.id);
				newNode.ww = DEFAULT_NODE_WW;
				newNode.setStatusMapType(CONFIRM_STATUS);
			} else if (MODE_NEW_WORK_STATUS == drawMode) {
				if (null == formStatusSel) {
					return;
				}
				newNode.formHandleStatus = formStatusSel;
				newNode.setStatusId(formStatusSel.id);
				newNode.hh = WORK_NODE_HH;
				newNode.ww = DEFAULT_NODE_WW;
				newNode.setStatusMapType(WORK_STATUS);
			} else if(MODE_NEW_SELECT_NODE == drawMode) {
				newNode.ww = DEFAULT_NODE_WW_SC;
				newNode.setStatusMapType(SELECT_NODE);
			} else if(MODE_NEW_COMBINE_NODE == drawMode) {
				newNode.ww = DEFAULT_NODE_WW_SC;
				newNode.setStatusMapType(COMBINE_NODE);
			} else if(MODE_NEW_STOP_NODE == drawMode) {
				newNode.ww = DEFAULT_NODE_WW_SC;
				newNode.setStatusMapType(STOP_NODE);
			}
			
			List<FormHandleStatusMap> nodeList = jobMeta.getStatusList();
			
			nodeList.add(newNode);
			setDrawMode(MODE_MOVE);
			selStatusMap = newNode;
			if (null != paneWorkFlowNodeList) {
				paneWorkFlowNodeList.setFormHandleStatusMap(newNode,true);
			}
			
			if (ACTIONTYPE_NONE == jobMeta.actionType) {
				if (null == jobMeta.id || 0 == jobMeta.id.length()) {
					jobMeta.actionType = ACTIONTYPE_INSERT;
				} else {
					jobMeta.actionType = ACTIONTYPE_UPDATE;
				}
			}
			if (null != paneWorkFlowNodeList) {
				paneWorkFlowNodeList.drawView();
			}*/
			break;
		case MODE_NEW_STEP_LINK:
			/*
			if (null == newLink) {
				
				if (null == selStatusMap) {
					return;
				}
				
				if (STOP_NODE == selStatusMap.getStatusMapType()) {
					return;
				}
				
				boolean find1 = false;
				for (FormHandleStatusMap tmpMap : jobMeta.getStatusList()) {
					if (tmpMap.getPrivateMapId() == selStatusMap.getPrivateMapId()){
						if(COMBINE_NODE == tmpMap.getStatusMapType()){
							for (FormStatusTransfer transfer : jobMeta.getStatusTransferList()) {
								if (transfer.getStartNodeId() == tmpMap.getPrivateMapId()) {
									find1 = true;
									break;
								}
							}
						}
						break;
					}
				}
				if(find1){
					return;
				}
				
				StatusLinkPoint lp = findSelStep4DrawLink(mex,mey);
				if (null != lp) {
					newLink = new FormStatusTransfer();
					newLink.setTransferId(jobMeta.calcMaxSID());
					newLink.setStartNodeId(selStatusMap.getPrivateMapId());
					newLink.addPoint(lp);
					
					jobMeta.getStatusTransferList().add(newLink);
					
					selStatusTransfer = newLink;
				}
			} else {
				StatusLinkPoint lp = findSelStep4DrawLink(mex,mey);
				if (null != lp) {
					List<FormStatusTransfer> drawLinkList = jobMeta.getStatusTransferList();
					boolean find1 = false;
					for (int k = 0; k < drawLinkList.length; k++) {
						FormStatusTransfer tmpLink = drawLinkList.get(k);
						if (newLink.getStartNodeId() == tmpLink.getStartNodeId()
								&& selStatusMap.getPrivateMapId() == tmpLink.getEndNodeId()) {
							find1 = true;
							break;
						}
					}
					
					if (!find1) {
						for(FormHandleStatusMap tmpMap : jobMeta.getStatusList()){
							if(tmpMap.getPrivateMapId() == selStatusMap.getPrivateMapId()){
								if(SELECT_NODE == tmpMap.getStatusMapType()){
									for(FormStatusTransfer transfer : jobMeta.getStatusTransferList()){
										if(transfer.getEndNodeId() == tmpMap.getPrivateMapId()){
											find1 = true;
											break;
										}
									}
								}
								break;
							}
						}
					}
					
					List<StatusLinkPoint> ptList = newLink.getPtList();
					if(!find1 && 0 < ptList.length){
						
						String newLinkName = "NEW LINK";
						
						newLink.setEndNodeId(selStatusMap.getPrivateMapId());
						
						FormHandleStatusMap startMap = null;
						FormHandleStatusMap endMap = null;
						for (FormHandleStatusMap statusMap1 : jobMeta.getStatusList()) {
							if(null == startMap && statusMap1.getPrivateMapId() == newLink.getStartNodeId()) {
								startMap = statusMap1;
							}
							if(null == endMap && statusMap1.getPrivateMapId() == newLink.getEndNodeId()){
								endMap = statusMap1;
							}
						}
						if (WORK_STATUS == endMap.getStatusMapType()) {
							if(WORK_STATUS != startMap.getStatusMapType()) {
								newLink.setType(1);
							} else {
								newLink.setType(2);
							}
						} else {
							newLink.setType(0);
						}
						
						newLink.addPoint(lp);
						
						newLink.setTransferName(newLinkName);
						
						StatusLinkPoint lp0 = ptList[0];
						newLink.sx = (lp0.x + lp.x) / 2;
						newLink.sy = (lp0.y + lp.y) / 2;
						newLink.hh = 24;
						
						recalLinkNameWidth(newLink);
						
						FormStatusTransfer newLink1 = newLink;
						selStatusTransfer = newLink;
						newLink = null;
						setDrawMode(MODE_MOVE);
						selStatusTransfer = newLink1;
						
						if (null != paneWorkFlowNodeList) {
							paneWorkFlowNodeList.setFormStatusTransfer(selStatusTransfer,true);
							paneWorkFlowNodeList.drawView();
						}
						
						if (ACTIONTYPE_NONE == jobMeta.actionType) {
							if (null == jobMeta.id || 0 == jobMeta.id.length()) {
								jobMeta.actionType = ACTIONTYPE_INSERT;
							} else {
								jobMeta.actionType = ACTIONTYPE_UPDATE;
							}
						}
					} else {
						drawLinkList.remove(newLink);
						newLink = null;
						setDrawMode(MODE_MOVE);
					}
				} else {
					
					int newx = mex - sx;
					int newy = mey - sy;
					int sn = newLink.getPtList().length;
					if(1 <= sn){
						lp = newLink.getPtList().get(sn - 1);
						int newdy = Math.abs(newy - lp.y);
						int newdx = Math.abs(newx - lp.x);
						
						if(16 <= newdy || 16 <= newdx){
							
							if(16 > newdy){
								newy = lp.y;
							}
							if(16 > newdx){
								newx = lp.x;
							}
							lp = new StatusLinkPoint(newx, newy);
							
							newLink.addPoint(lp);
						}
					}
				}
			}*/
			break;
		case MODE_RESIZE_X1:
			break;
		case MODE_RESIZE_X2:
			break;
	}
	
	if (null != selSwimlane) {
		if (2 == swimlaneDragMode) {
			var num1 = jobMeta.swimlaneList.length;
			
			var idx = jobMeta.swimlaneList.indexOf(selSwimlane);;
			//for (var i = 0; i < num1; i++) {
			//	if (jobMeta.swimlaneList[i].authorityGroupId == selSwimlane.authorityGroupId) {
			//		idx = i;
			//		break;
			//	}
			//}
			
			if (0 > swimlaneMoveOffsetX && 0 < idx) {
				swimlaneMoveOffsetX = -swimlaneMoveOffsetX;
				var x = 0;
				var swimlane;
				for (idx--; idx >= 0; idx--) {
					swimlane = jobMeta.swimlaneList[idx];
					if ((x + swimlane.ww / 2) < swimlaneMoveOffsetX && 
							((x + swimlane.ww) > swimlaneMoveOffsetX || 0 == idx)) {
						//jobMeta.swimlaneList.remove(selSwimlane);
						//jobMeta.swimlaneList.add(idx, selSwimlane);
						jobMeta.swimlaneList.splice(idx, 1, selSwimlane);
						break;
					} else if((x + swimlane.ww / 2) > swimlaneMoveOffsetX) {
						//jobMeta.swimlaneList.remove(selSwimlane);
						//jobMeta.swimlaneList.add(idx + 1, selSwimlane);
						jobMeta.swimlaneList.splice(idx, 1);
						jobMeta.swimlaneList.splice(idx + 1, 0, selSwimlane);
						break;
					}
					x += swimlane.ww;
				}
			} else if (0 < swimlaneMoveOffsetX && (num1 - 1) > idx) {
				var x = 0;
				var swimlane;
				for (idx++; idx < num1; idx++) {
					swimlane = jobMeta.swimlaneList[idx];
					if((x + swimlane.ww / 2) < swimlaneMoveOffsetX && 
							((x + swimlane.ww) > swimlaneMoveOffsetX || ((num1 - 1) == idx))){
						//jobMeta.swimlaneList.remove(selSwimlane);
						//jobMeta.swimlaneList().add(idx, selSwimlane);
						jobMeta.swimlaneList.splice(idx, 1, selSwimlane);

						break;
					} else if((x + swimlane.ww / 2) > swimlaneMoveOffsetX) {
						//jobMeta.swimlaneList.remove(selSwimlane);
						//jobMeta.swimlaneList.add(idx - 1, selSwimlane);
						jobMeta.swimlaneList.splice(idx, 1);
						jobMeta.swimlaneList.splice(idx - 1, 0, selSwimlane);
						break;
					}
					x += swimlane.ww;
				}
			}
		}
		swimlaneMoveOffsetX = 0;
		swimlaneDragMode = 0;
	}
	drawChart();
	
	// 重新设置鼠标移动事件
	canvas.onmousemove = onMouseMove;
}

/**
 * 鼠标拖拽事件
 * 
 * @param e 事件消息
 */
function onMouseDrag(e) {
	
	// 事件触发区域，外部边框
	var rect = e.target.getBoundingClientRect();
	
	// 换算成事件触发区域内部坐标
	var mex = e.clientX - rect.left;
	var mey = e.clientY - rect.top;
	
	var dx = mex - px;
	var dy = mey - py;
	px = mex;
	py = mey;
	
	if (null == jobMeta) {
		return;
	}
	if (36 > px0 && 36 > py0) {
		if (ACTIONTYPE_INSERT == jobMeta.actionType || ACTIONTYPE_UPDATE == jobMeta.actionType) {
			return;
		}
	}
	
	if (isViewMode) {
		if (MODE_MOVE == drawMode) {
			sx += dx;
			sy += dy;
			drawChart();
			//if (null != pagmv && getChildren().contains(pagmv)) {
			//	pagmv.setTranslateX(pagmv.getTranslateX() + dx);
			//}
			isDrag = true;						
		}
		return;
	}
	
	if (MODE_MOVE == drawMode) {
		if (null == selStatusMap && null == selStatusTransfer && null == selSwimlane) {
			sx += dx;
			sy += dy;
			drawChart();
			//if (null != pagmv && getChildren().contains(pagmv)){
			//	pagmv.setTranslateX(pagmv.getTranslateX() + dx);
			//}
			isDrag = true;
			return;
		}
		
		if (null != selSwimlane) {
			
			if (0 == swimlaneDragMode) {
				if (Math.abs(dx) < Math.abs(dy)) {
					swimlaneDragMode = 2;
				} else {
					swimlaneDragMode = 1;
				}
			}
			
			if (1 == swimlaneDragMode) {
				selSwimlane.ww = selSwimlane.ww + dx;
				if (SWIMLINE_WW > selSwimlane.ww){
					selSwimlane.ww = SWIMLINE_WW;
				}
			} else {
				swimlaneMoveOffsetX += dx;
			}
			
			if (!checkNotEmpty(jobMeta.id)) {
				jobMeta.actionType = ACTIONTYPE_INSERT;
			} else {
				jobMeta.actionType = ACTIONTYPE_UPDATE;
			}
			
			drawChart();
			isDrag = true;
			return;
		}
		if (null != selStatusTransfer) {
			if (true == isSelLinkName) {
				var newx = selStatusTransfer.sx + dx;
				var newy = selStatusTransfer.sy + dy;
				if (0 > newx) {
					newx = 0;
				}
				if (0 > newy) {
					newy = 0;
				}
				selStatusTransfer.sx = newx;
				selStatusTransfer.sy = newy;
			}
			if (null != selPt) {
				if (0 < selPt.joinNodeId) {
					setNewPointInJoinPt(mex, mey);								
				} else {
					
					selPt.x = selPt.x + dx;
					selPt.y = selPt.y + dy;
					
					selPt.x = adjustmentDx4Transfer(selStatusTransfer, selPt, selPt.x);
					selPt.y = adjustmentDy4Transfer(selStatusTransfer, selPt, selPt.y);
				}
			}
			if (ACTIONTYPE_NONE == jobMeta.actionType) {
				if (!checkNotEmpty(jobMeta.id)) {
					jobMeta.actionType = ACTIONTYPE_INSERT;
				} else {
					jobMeta.actionType = ACTIONTYPE_UPDATE;
				}
			}
		}
		if (null != selStatusMap) {
			
			dx = adjustmentDx4Node(selStatusMap, dx);
			dy = adjustmentDy4Node(selStatusMap, dy);
			
			resetStatusLoc(dx, dy);
		}
	} else if(MODE_RESIZE_X1 == drawMode) {
		
		var newSx = selStatusMap.sx + dx;
		if (0 > newSx ) {
			return;
		}
		var newWw = selStatusMap.ww - dx;
		if (96 > newWw) {
			return;
		}
		
		var flowLinkList = jobMeta.statusTransferList;
		for (var i = 0; i < flowLinkList.length; i++) {
			var link1 = flowLinkList[i];
			if (link1.startNodeId == selStatusMap.privateMapId) {
				var ptList = link1.ptList;
				var pt0 = ptList[0];
				if (2 > Math.abs(pt0.x - selStatusMap.sx)) {
					pt0.x = newSx;
				}
				if (pt0.x < newSx) {
					pt0.x = newSx;
				}
			}
			if (link1.endNodeId == selStatusMap.privateMapId) {
				var ptList = link1.ptList;
				var pt = ptList[ptList.length - 1];
				if (2 > Math.abs(pt.x - selStatusMap.sx)) {
					pt.x = newSx;
				}
				if (pt.x < newSx) {
					pt.x = newSx;
				}
			}
		}
		selStatusMap.ww = newWw;
		selStatusMap.sx = newSx;
		if (ACTIONTYPE_NONE == jobMeta.actionType) {
			if (!checkNotEmpty(jobMeta.id)) {
				jobMeta.actionType = ACTIONTYPE_INSERT;
			} else {
				jobMeta.actionType = ACTIONTYPE_UPDATE;
			}
		}
	} else if (MODE_RESIZE_X2 == drawMode) {
		
		if (null != selStatusMap) {
			
			dx = adjustmentWW4Node(selStatusMap, dx);
			
			var newWw = selStatusMap.ww + dx;
			if (96 > newWw){
				return;
			}
			var flowLinkList = jobMeta.statusTransferList;
			for (var i = 0; i < flowLinkList.length; i++) {
				var link1 = flowLinkList[i];
				if (link1.startNodeId == selStatusMap.privateMapId) {
					var ptList = link1.ptList;
					var pt0 = ptList[0];
					var newSx = selStatusMap.sx + newWw;
					if (2 > Math.abs(pt0.x - selStatusMap.sx - selStatusMap.ww)) {
						pt0.x = newSx;
					}
					if (pt0.x > selStatusMap.sx + newWw) {
						pt0.x = newSx;
					}
				}
				if (link1.endNodeId == selStatusMap.privateMapId) {
					var ptList = link1.ptList;
					var pt = ptList[ptList.length - 1];
					var newSx = selStatusMap.sx + newWw;
					if (2 > Math.abs(pt.x - selStatusMap.sx - selStatusMap.ww)) {
						pt.x = newSx;
					}
					if (pt.x > newSx) {
						pt.x = newSx;
					}
				}
			}
			selStatusMap.ww = newWw;
			if (ACTIONTYPE_NONE == jobMeta.actionType) {
				if (!checkNotEmpty(jobMeta.id)) {
					jobMeta.actionType = ACTIONTYPE_INSERT;
				} else {
					jobMeta.actionType = ACTIONTYPE_UPDATE;
				}
			}
		}
	}
	drawChart();
}

/**
 * 鼠标移动事件
 * 
 * @param e 事件消息
 */
function onMouseMove(e) {
	
	if (isViewMode) {
		return;
	}
	
	// 事件触发区域，外部边框
	var rect = e.target.getBoundingClientRect();
	
	// 换算成事件触发区域内部坐标
	var mex = e.clientX - rect.left;
	var mey = e.clientY - rect.top;
	
	if (MODE_MOVE == drawMode || MODE_RESIZE_X1 == drawMode || MODE_RESIZE_X2 == drawMode) {
	
		if (null != selStatusMap) {
			var x1 = mex - sx;
			var y1 = mey - sy;
			
			if ((CONFIRM_STATUS == selStatusMap.statusMapType || WORK_STATUS == selStatusMap.statusMapType) && 
					selStatusMap.sy < y1 && selStatusMap.sy + selStatusMap.hh > y1 && 4 >= Math.abs(x1 - selStatusMap.sx)) {
				setCursor("col-resize");
				drawMode = MODE_RESIZE_X1;
			} else if ((CONFIRM_STATUS == selStatusMap.statusMapType || WORK_STATUS == selStatusMap.statusMapType) && 
					selStatusMap.sy < y1 && selStatusMap.sy + selStatusMap.hh > y1 && 4 >= Math.abs(x1 - selStatusMap.sx - selStatusMap.ww)) {
				setCursor("col-resize");
				drawMode = MODE_RESIZE_X2;
			} else {
				setCursor("pointer");
				drawMode = MODE_MOVE;
			}
		}
	} else if(MODE_NEW_CONFIRM_STATUS == drawMode || MODE_NEW_WORK_STATUS == drawMode
			|| MODE_NEW_SELECT_NODE == drawMode || MODE_NEW_COMBINE_NODE == drawMode || MODE_NEW_STOP_NODE == drawMode){
	
		drawChart();
		//drawNewNode(mex,mey);
	} else if(MODE_NEW_STEP_LINK == drawMode){
			
		//findSelStep4Link(mex,mey);
		drawChart();
		
		//gc.drawImage(imgNewLink, mex - 24, mey);
		
		if (null != newLink) {
			
			var size1 = newLink.ptList.length - 1;
			if (0 <= size1) {
				var lp = newLink.ptList[size1];
				gc.strokeStyle = "rgb(255, 102, 0)";
				gc.beginPath();
				gc.moveTo(sx + lp.x, sy + lp.y);
				gc.lineTo(mex, mey);
				gc.stroke();
				gc.closePath();
			}
		}
	}
}

function resetStatusLoc(dx, dy) {
	if (null == selJobMeta) {
		return;
	}
	
	selJobMeta.sx = selJobMeta.sx + dx;
	selJobMeta.sy = selJobMeta.sy + dy;
	var flowLinkList = proWf.linkerList;
	
	var link1;
	for (var i = 0; i < flowLinkList.length;i++) {
		
		link1 = flowLinkList[i];
		var ptList = link1.ptList;
		
		if (link1.formJobMetaId == selJobMeta.id) {
			var pt0 = ptList[0];
			pt0.x += dx;
			pt0.y += dy;
		}
		if (link1.toJobMetaId == selJobMeta.id) {
			var pt = ptList[ptList.length - 1];
			pt.x += dx;
			pt.y += dy;
		}
	}
	if (ACTIONTYPE_NONE == proWf.actionType) {
		if (!checkNotEmpty(proWf.id)) {
			proWf.actionType = ACTIONTYPE_INSERT;
		} else {
			proWf.actionType = ACTIONTYPE_UPDATE;
		}
	}
}

function resetStatusMap(jobMeta){
	var agMapListTmp = new Array();
	
	//agMapListTmp.addAll(jobMeta.authGroupList);
	
	agMapListTmp.concat(jobMeta.authGroupList);
	//jobMeta.authGroupList.clear();
	// 数组清空
	jobMeta.authGroupList.length = 0; 
	
	if (0 < proWf.swimlaneList.length) {
		var ww1 = 0;
		var swimlane;
		for (var i = 0; i < proWf.swimlaneList.length; i++) {
			swimlane = proWf.swimlaneList[i];
			
			if (ww1 + swimlane.ww > jobMeta.sx && ww1 < jobMeta.sx + jobMeta.ww) {
				var agMap1 = null;
				for (var j = 0; j < agMapListTmp.length; j++) {
					
					agMap = agMapListTmp[j]
					if (agMap.authGroupId == swimlane.authorityGroupId) {
						agMap1 = agMap;
						break;
					}
				}
				if (null == agMap1) {
					//agMap1 = new HandleStatusAuthGroupMap();
					agMap1.authGroupId = swimlane.authorityGroupId;
					
				}
				agMap1.ag = swimlane.authorityGroup;
				agMap1.type = swimlane.authorityGroup.type;
				jobMeta.authGroupList.push(agMap1);
			}
			ww1 += swimlane.ww;
		}
	}
}

function saveAction() {
	var jobMetaList = proWf.proJobList;
	var linkList = proWf.linkerList;
	var maxx = 0;
	var maxy = 0;
	var tt   = 0;
	var jobMeta;
	for (var i = 0; i < jobMetaList.length; i++) {
		jobMeta = jobMetaList[i];
		tt = jobMeta.sx + jobMeta.ww;
		if (maxx < tt) {
			maxx = tt;
		}
		tt = jobMeta.sy + jobMeta.hh;
		if (maxy < tt) {
			maxy = tt;
		}
	}
	var link1;
	for (var i = 0; i < linkList.length; i++) {
		link1 = linkList[i];
		tt = link1.sx + link1.ww;
		if (maxx < tt) {
			maxx = tt;
		}
		tt = link1.sy + link1.hh;
		if (maxy < tt) {
			maxy = tt;
		}
		var lp;
		for (var j = 0; j <  link1.ptList.length; i++) {
			lp = link1.ptList[j];
			if (maxx < lp.x) {
				maxx = lp.x;
			}
			if (maxy < lp.y) {
				maxy = lp.y;
			}
		}
	}
	
	var newWw = maxx + 16;
	var newHh = maxy + 24;
	if (600 > newWw) {
		newWw = 600;
	}
	if (2000 > newHh) {
		newHh = 2000;
	}
	
	if (0 < proWf.swimlaneList.length){
		var ww1 = 0;
		var swimlane;
		for (var i = 0; i < proWf.swimlaneList.length; i++) {
			swimlane = proWf.swimlaneList[i];
			ww1 += swimlane.ww;
		}
		
		newWw = ww1;
	}
	
	var jobMeta;
	for (var i = 0; i < proWf.proJobList.length; i++) {
		jobMeta = proWf.proJobList[i]
		
		resetStatusMap(jobMeta);
	}
	
	proWf.ww = newWw;
	proWf.hh = newHh;
	
	//ProWfMetaFactory fact = ProWfMetaFactory.getFactory();
	if (ACTIONTYPE_INSERT == proWf.actionType) {
		//fact.insert(proWf);
	} else if(ACTIONTYPE_UPDATE == proWf.actionType) {
		//fact.update(proWf);
	}
	proWf.actionType = ACTIONTYPE_NONE;
	drawChart();
}

function adjustmentDy4Transfer(link, selPt, y) {		
	var ptList = link.ptList;
	var idx = ptList.indexOf(selPt);
	if (0 == idx) {

		var jobMeta;
		for (var i = 0; i < proWf.proJobList.length; i++) {
			
			jobMeta = proWf.proJobList[i];
			if (jobMeta.id == link.formJobMetaId) {
				var middleY = jobMeta.sy + (jobMeta.hh / 2);
				if (adjustmentGap > Math.abs(middleY - y)) {
					return middleY;
				}
				var mY2 = middleY / 2;
				if (adjustmentGap > Math.abs(middleY + mY2 - y)) {
					return middleY + mY2;
				}
				if (adjustmentGap > Math.abs(middleY - mY2 - y)) {
					return middleY - mY2;
				}
				break;
			}
		}
	} else if ((ptList.length - 1) == idx) {
		
		var jobMeta = null;
		for (var i = 0; i < proWf.proJobList.length; i++) {
			
			var jobMeta = proWf.proJobList[i];
			
			if (jobMeta.id == link.toJobMetaId) {
				var middleY = jobMeta.sy + (jobMeta.hh / 2);
				if (adjustmentGap > Math.abs(middleY - y)) {
					return middleY;
				}
				var mY2 = middleY / 2;
				if (adjustmentGap > Math.abs(middleY + mY2 - y)) {
					return middleY + mY2;
				}
				if (adjustmentGap > Math.abs(middleY - mY2 - y)) {
					return middleY - mY2;
				}
				break;
			}
		}
	}
	var lp;
	for (var i = 0; i < ptList.length; i++) {
		
		lp = ptList[i];
		if (lp == selPt) {
			continue;
		}
		
		if (adjustmentGap > Math.abs(lp.y - y)) {
			return lp.y;
		}
	}
	return y;
}

function adjustmentDx4Transfer(jobLink, selPt, x) {
	var ptList = jobLink.ptList;
	
	var idx = ptList.indexOf(selPt);
	if (0 == idx) {
		
		var jobMeta;
		for (var i = 0; i < proWf.proJobList.length; i++) {
			jobMeta = proWf.proJobList[i];
			
			if (jobMeta.id == jobLink.formJobMetaId) {
				var middleX = jobMeta.sx + (jobMeta.ww / 2);
				if (adjustmentGap > Math.abs(middleX - x)) {
					return middleX;
				}
				var mX2 = middleX / 2;
				if (adjustmentGap > Math.abs(middleX + mX2 - x)) {
					return middleX + mX2;
				}
				if (adjustmentGap > Math.abs(middleX - mX2 - x)) {
					return middleX - mX2;
				}
				break;
			}
		}
	} else if((ptList.length - 1) == idx) {
		var jobMeta;
		for (var i = 0; i < proWf.proJobList.length; i++) {
			jobMeta = proWf.proJobList[i];
			
			if (statusMap.id == jobLink.toJobMetaId) {
				var middleX = statusMap.sx + (statusMap.ww / 2);
				if(adjustmentGap > Math.abs(middleX - x)){
					return middleX;
				}
				var mX2 = middleX / 2;
				if (adjustmentGap > Math.abs(middleX + mX2 - x)) {
					return middleX + mX2;
				}
				if (adjustmentGap > Math.abs(middleX - mX2 - x)) {
					return middleX - mX2;
				}
				break;
			}
		}
	}
	
	var lp;
	for (var i = 0; i < ptList.length; i++) {
		lp = ptList[i];
		if (lp == selPt) {
			continue;
		}
		
		if (adjustmentGap > Math.abs(lp.x - x)) {
			return lp.x;
		}
	}
	
	return x;
}

function adjustmentDy4Node(statusMap1, dy) {
	var statusMapList = proWf.proJobList;
	var tmpY = statusMap1.sy + dy;
	if (2 > tmpY) {
		return 0;
	}
	var statusMap;
	for (var i  = 0; i < statusMapList.length; i++) {
		statusMap = statusMapList[i];
		
		if (statusMap == statusMap1) {
			continue;
		}
		
		if (adjustmentGap > Math.abs(statusMap.sy - tmpY)) {
			dy = statusMap.sy - statusMap1.sy;
			return dy;
		}
	}

	return dy;
}

function adjustmentDx4Node(statusMap1, dx) {
	var statusMapList = proWf.proJobList;
	var tmpX = statusMap1.sx + dx;
	
	if (2 > tmpX) {
		return 0;
	}
	
	var jobMeta;
	for (var i = 0; i < statusMapList.length; i++) {
		jobMeta = statusMapList[i]
		
		if (jobMeta == statusMap1) {
			continue;
		}
		
		if (adjustmentGap > Math.abs(jobMeta1.sx - tmpX)) {
			dx = jobMeta.sx - statusMap1.sx;
			return dx;
		}
	}

	return dx;
}

function adjustmentWW4Node(jobMeta1, dx) {
	var statusMapList = proWf.proJobList;
	var tmpWW = jobMeta1.ww + dx;
	
	var statusMap;
	for(var i = 0; i < statusMapList.length; i++){
		
		statusMap = statusMapList[i];
		if (statusMap == jobMeta1) {
			continue;
		}
		
		if (statusMap.sx != jobMeta1.sx) {
			continue;
		}
		
		if (adjustmentGap > Math.abs(statusMap.ww - tmpWW)) {
			dx = statusMap.ww - jobMeta1.ww;
			return dx;
		}
	}

	return dx;
}

function setDrawMode(newDrawMode){
	
	selJobMeta = null;
	selLink = null;
	selPt   = null;
	isSelLinkName = false;
	joinNode = null;
	
	drawMode = newDrawMode;
	
	if (null == proWf) {
		return;
	}
	
	if (null != newLink) {
		var linkList = proWf.linkerList;
		var link1;
		for (var i = 0; i < linkList.length; i++){
			if (newLink == link1) {
				
				var idx = linkList.indexOf(newLink);
				linkList.splice(idx, 1);
				break;
			}
		}
	}
	newLink = null;
	
	switch (drawMode) {
		case MODE_MOVE:
			setCursor("pointer");
			break;
		case MODE_NEW_START_NODE:
		case MODE_NEW_WORK_FLOW:
		case MODE_NEW_JOBNODE:
		case MODE_NEW_SELECT_NODE:
		case MODE_NEW_COMBINE_NODE:
		case MODE_NEW_STOP_NODE:
			setCursor("col-resize");
			break;
		case MODE_NEW_STEP_LINK:
			setCursor("col-resize");
			break;
	}
	
	drawView();
}

function setProWfMeta(proWfMeta){
	
	proWf = proWfMeta;
	selJobMeta = null;
	selLink = null;
	selPt   = null;
	isSelLinkName = false;
	joinNode = null;
	sx = SX;
	sy = SY;
	
	resetInOutDisVal();
	
	if (null != proWfMeta && null != proWfMeta.swimlaneList) {
		var swimlane;
		for (var i = 0; i < proWfMeta.swimlaneList.length; i++) {
			swimlane = proWfMeta.swimlaneList[i];
			if (SWIMLINE_WW > swimlane.ww) {
				swimlane.ww = SWIMLINE_WW;
			}
		}
	}
	
	drawMode = MODE_MOVE;
}

function setMyPrefSize(newWw, newHh){
	ww = newWw;
	hh = newHh + 1000;
	
	canvas.width = ww;
	canvas.height = hh;
}

function drawView() {
	
	drawChart();
	//this.getChildren().clear();
	if (!isViewMode){
		//this.getChildren().add(txtFocus);
	}
	//this.getChildren().add(canvas);
	if (null != pagmv) {
		if (isShowAGMember) {
			//this.getChildren().add(pagmv);
		}
	}
}

// 绘制流程示意图
function drawChart(){
	
	gc.clearRect(0, 0, ww, hh);
	gc.lineWidth = 2;
	var updFlg = 0;
	
	gc.textAlign = "left";
	gc.textBaseline = "middle";

	if (null == proWf) {
		gc.fillStyle = "rgb(236, 236, 236)";
		gc.roundRect(sx, sy, ww - 24, hh  - 24, {ul:8,ur:8,ll:8,lr:8}, true, false);
		return;
	}
	
	if (ACTIONTYPE_INSERT == proWf.actionType || ACTIONTYPE_UPDATE == proWf.actionType) {
		updFlg = 1;
		gc.fillStyle = "rgb(255, 255, 204)";
	} else {
		//背景颜色
		gc.fillStyle = "#FFFFFF";
	}
	gc.roundRect(sx, sy, proWf.ww, proWf.hh, {ul:8,ur:8,ll:8,lr:8}, true, false);
	
	var swimlaneList = proWf.swimlaneList;
	var tmpX = sx;
	//泳线
	if (0 < swimlaneList.length) {
		gc.strokeStyle = "#E9EAEC";
		gc.lineWidth = 1;
		
		gc.beginPath();	
		gc.moveTo(tmpX, 0);
		gc.lineTo(tmpX, proWf.hh + sy);
		gc.stroke();
		gc.closePath();
		
		var swimlane;
		for (var idx = 0; idx < swimlaneList.length; idx++) {
			swimlane = swimlaneList[idx];				
			tmpX += swimlane.ww;
			
			gc.beginPath();	
			gc.moveTo(tmpX, 0);
			gc.lineTo(tmpX, proWf.hh + sy);
			gc.stroke();
			gc.closePath();
		}
	}
	
	gc.lineWidth = 2;
	var jobList = proWf.proJobList;

	for (var i = 0; i < jobList.length; i++) {
		jobMeta = jobList[i];
		if (selJobMeta == jobMeta) {
			continue;
		}
		
		if (null == selJobMeta) {
			if (lastOkJobMeta == jobMeta) {
				continue;
			}
		}
		if (okJobMetaList.indexOf(jobMeta.id) >= 0) {
			drawNodeOkStatus(gc, jobMeta);
		//} else if(doingWorkStatusList.indexOf(jobMeta) >=0) {
		//	drawDoingNode(gc,jobMeta);
		} else {
			drawNode(gc, jobMeta);
		}
	}
	if (null != selJobMeta) {
		drawSelNode(gc);
	} else {
		drawLastOkStatus(gc);
	}
	
	gc.strokeStyle = BLACK_COLOR;
	gc.fillStyle = BLACK_COLOR;
	gc.lineWidth = 1;		
	var linkList = proWf.linkerList;
	var flowLink1;
	for (var i = 0; i < linkList.length; i++) {
		flowLink1 = linkList[i];
		if (flowLink1 == selLink) {
			continue;
		}
		drawLink(gc, flowLink1);
	}
	
	gc.strokeStyle = RED_COLOR;
	gc.fillStyle = RED_COLOR;
	if (null != selLink) {
		drawSelLink(gc);
	}
	
	if (0 < swimlaneList.length) {
        gc.strokeStyle = "#E9EAEC";
        gc.lineWidth = 1;

        gc.beginPath();
        gc.moveTo(0, SWIMLANE_HH+1);
        gc.lineTo(proWf.ww , SWIMLANE_HH+1);
        gc.stroke();
        gc.closePath();


		tmpX = sx;

		gc.lineWidth = 1;
		var offsetX = 0;
		var swimlane;
		for (var idx = 0; idx < swimlaneList.length; idx++){				
			swimlane = swimlaneList[idx];
			
			if (selSwimlane == swimlane) {
				if (2 == swimlaneDragMode) {
					gc.strokeStyle = "rgb(200, 200, 200)";
					gc.lineWidth = 1;
					
					gc.beginPath();	
					gc.moveTo(tmpX, 0);
					gc.lineTo(tmpX, SWIMLANE_HH);
					gc.stroke();
					gc.closePath();
					
					offsetX = swimlaneMoveOffsetX + tmpX;
					tmpX += swimlane.ww;
					continue;
				}
			}
            //绘制顶部背景颜色
			gc.fillStyle = "#B3B8C1";
			gc.fillRect(tmpX, 0, swimlane.ww, SWIMLANE_HH);
			
			if (0 == idx) {
				gc.strokeStyle = "rgb(200, 200, 200)";
			}else{
				gc.strokeStyle ="#E9EAEC";
			}
			

			
			if (selSwimlane == swimlane) {
				gc.lineWidth = 2;				
				gc.strokeStyle = RED_COLOR;
				gc.strokeRect(tmpX, 1, selSwimlane.ww - 1, SWIMLANE_HH - 1);
			}
			
			gc.textAlign = "center";
			gc.textBaseline = "middle";
			gc.fillStyle = "#4B5262";

			//绘制顶部字体
            gc.font = FORMFONT;
            gc.fillText(swimlane.authorityGroup.groupName, tmpX + (swimlane.ww/2), SWIMLANE_HH/2, swimlane.ww-4);



            drawSwimlaneIcon(tmpX);

			//image.onload = function () {
				//gc.drawImage(image, tmpX + 2, 4, 24, 24);
			//}
			tmpX += swimlane.ww;
		}



		if (null != selSwimlane) {
			if (2 == swimlaneDragMode) {
				gc.fillStyle = YELLOW_COLOR;
				gc.fillRect(offsetX, 6, selSwimlane.ww, SWIMLANE_HH);				
				
				gc.strokeStyle = "rgb(200, 200, 200)";
				gc.lineWidth = 1;
				
				gc.beginPath();	
				gc.moveTo(offsetX, 6);
				gc.lineTo(offsetX, SWIMLANE_HH);
				gc.stroke();
				gc.closePath();
				
				gc.lineWidth = 2;				
				gc.strokeStyle = RED_COLOR;
				gc.strokeRect(offsetX, 7, selSwimlane.ww - 1, SWIMLANE_HH - 1);					
				
				gc.textAlign = "center";
				gc.textBaseline = "middle";
				
				gc.fillStyle = BLACK_COLOR;
                gc.font = FORMFONT;
                gc.fillText(selSwimlane.authorityGroup.groupName, offsetX + (selSwimlane.ww / 2), SWIMLANE_HH / 2 + 6, selSwimlane.ww - 4);
			}
		}
	}
	
	if (1 == updFlg) {
		
		var imageTS = new Image();
		imageTS.src = "img/toolbar-save.png";
		imageTS.onload = function () {
			gc.drawImage(imageTS, 0, 0, 36, 36);
		}
	}
}


function drawSwimlaneIcon(x) {
    var image = new Image();
    image.src = "img/authority_group.png";

    image.onload = function () {
        gc.drawImage(image, x + 26, 4, 20, 20);
    }
}

function drawDoingNode(gc, jobMeta){

	gc.fillStyle = YELLOW_COLOR;
	gc.roundRect(sx + jobMeta.sx, sy + jobMeta.sy, jobMeta.ww, jobMeta.hh, {ul:4,ur:4,ll:4,lr:4}, true, false);

	if (PRO_JB_MT_CLS_WORK_FLOW == jobMeta.jobClass) {
		gc.strokeStyle = DARKORANGE_COLOR;
	} else if(PRO_JB_MT_CLS_JOB_NODE == jobMeta.jobClass) {
		gc.strokeStyle = DARKGREEN_COLOR;
	} else if(PRO_JB_MT_CLS_COMBINE_NODE == jobMeta.jobClass) {
		gc.strokeStyle = STATUS_COLOR;
	} else if(PRO_JB_MT_CLS_SELECT_NODE == jobMeta.jobClass) {
		gc.strokeStyle = STATUS_COLOR;
	} else if(PRO_JB_MT_CLS_START_NODE == jobMeta.jobClass) {
		gc.strokeStyle = STATUS_COLOR;
	} else {
		gc.strokeStyle = "rgb(128, 128, 128)";
	}
	
	gc.lineWidth = 1;


    //绘制小框内容
    gc.fillStyle = "rgb(210, 224, 246)";
    gc.strokeStyle = "#F8F8F9";
	gc.strokeRoundRect(sx + jobMeta.sx, sy + jobMeta.sy, jobMeta.ww, jobMeta.hh, 10,10);
	gc.fillStyle = BLACK_COLOR;		
	
	drawNodeContent(gc, jobMeta);
}

function drawNodeOkStatus(gc, jobMeta){
    gc.fillStyle = "#0F7CEE";
	gc.fillStyle = "rgb(250, 250, 250)";
	//gc.fillStyle = BLACK_COLOR;
	
	//drawNodeContent(gc, jobMeta);
	
	if (PRO_JB_MT_CLS_WORK_FLOW == jobMeta.jobClass) {
		gc.strokeStyle = DARKORANGE_COLOR;
	} else if(PRO_JB_MT_CLS_JOB_NODE == jobMeta.jobClass) {
		gc.strokeStyle = DARKGREEN_COLOR;
	} else if(PRO_JB_MT_CLS_COMBINE_NODE == jobMeta.jobClass) {
		gc.strokeStyle = STATUS_COLOR;
	} else if(PRO_JB_MT_CLS_SELECT_NODE == jobMeta.jobClass) {
		gc.strokeStyle = STATUS_COLOR;
	} else {
		gc.strokeStyle = "rgb(128, 128, 128)";
	}
	gc.lineWidth = 1;

	//绘制小框内容
    gc.fillStyle = "rgb(210, 224, 246)";
    gc.strokeStyle = "#F8F8F9";
	gc.roundRect(sx + jobMeta.sx, sy + jobMeta.sy, jobMeta.ww, jobMeta.hh, {ul:4,ur:4,ll:4,lr:4}, true, true);


    drawNodeContent(gc, jobMeta);
}

function drawNodeContent(gc, jobMeta){
	
	var image = new Image();
	var imageIn = new Image();
	var imageOut = new Image();
	var imageDefault = new Image(); 
	var imageUrl= "img/tool_select_node.png";

	if (PRO_JB_MT_CLS_WORK_FLOW == jobMeta.jobClass) {

        gc.font = FORMFONT;
        if (null != jobMeta.wfMeta) {
			gc.fillText(jobMeta.wfMeta.name, sx + jobMeta.sx + ICON_WW_1 + 8, sy + jobMeta.sy + jobMeta.hh/2);
		} else {
			gc.fillText(jobMeta.name, sx + jobMeta.sx + ICON_WW_1 + 8, sy + jobMeta.sy + jobMeta.hh/2);
		}
		
		if (checkNotEmpty(jobMeta.iconName)) {

            image.src = jobMeta.iconName;
            image.onload = function () {
                gc.drawImage(image, sx + jobMeta.sx + 4, sy + jobMeta.sy + (jobMeta.hh - ICON_WW_1)/2, ICON_WW_1, ICON_WW_1);
            }

		} else {
			image.src = "img/pro_wf_sub_wf.png";
			image.onload = function () {
				gc.drawImage(image, sx + jobMeta.sx + 4, sy + jobMeta.sy + (jobMeta.hh - ICON_WW_1)/2, ICON_WW_1, ICON_WW_1);
			}
		}
	} else if (PRO_JB_MT_CLS_JOB_NODE == jobMeta.jobClass) {


		//三种状态头部颜色
        if (okJobMetaList.indexOf(jobMeta.id) >= 0) {
            gc.fillStyle = "#0F7CEE";
            //} else if(doingWorkStatusList.indexOf(jobMeta) >=0) {
            //	gc.fillStyle = "rgb(128, 167, 229)";
        } else {
            gc.fillStyle = "rgb(179, 184, 193)";
        }



		//绘制小矩形框的头部
		gc.roundRect(sx + jobMeta.sx + 1, sy + jobMeta.sy + 1, jobMeta.ww - 2, jobMeta.hh / 3, {ul:4,ur:4,ll:0,lr:0}, true, true);
		//小框字体颜色
		gc.fillStyle = WHITE_COLOR;

		image.src = "img/pro_job_node_default.png";
		image.onload = function () {
			gc.drawImage(image, sx + jobMeta.sx + 4, sy + jobMeta.sy + 4, ICON_WW_2, ICON_WW_2);
		}

		var name = jobMeta.jobInsNewNum != 0 ? jobMeta.name + "[" + jobMeta.jobInsNewNum + "]"  : jobMeta.name;
        gc.font = FORMFONT;
        gc.fillText(name, sx + jobMeta.sx + ICON_WW_2 + 8, sy + jobMeta.sy + (jobMeta.hh / 6) + 2);

		gc.textAlign = "left";
		
		var sx1 = sx + jobMeta.sx + (jobMeta.hh/6);

		var inputIcon = inputIconMap[jobMeta.id];
		var inputVal = inputValueMap[jobMeta.id];

        var outputIcon = outputIconMap[jobMeta.id];
		var outputVal = outputValueMap[jobMeta.id];
		//小框最下面字体颜色
        gc.fillStyle = "#999";

		if (selJobMeta == jobMeta) {

			inputVal = inputFullValueMap[jobMeta.id];
			outputVal = outputFullValueMap[jobMeta.id];
		}
		//小框底部的小图标颜色
		if (checkNotEmpty(inputVal)) {
			if (checkNotEmpty(inputIcon)) {
                imageIn.src = inputIcon;
                imageIn.onload = function () {
					gc.drawImage(imageIn, sx1, sy + jobMeta.sy + 4 + jobMeta.hh / 3, ICON_WW_2, ICON_WW_2);
                }
			} else {
				
				imageDefault.src = "img/default-form-icon.png";
				imageDefault.onload = function () {
					gc.drawImage(imageDefault, sx1, sy + jobMeta.sy + 4 + jobMeta.hh / 3, ICON_WW_2, ICON_WW_2);
				}
			}

            gc.font = FORMFONT;
            gc.fillText(inputVal, sx1 + ICON_WW_2 + 4, sy + jobMeta.sy + jobMeta.hh/2);
		}
		
		if (checkNotEmpty(outputVal)) {
			if (checkNotEmpty(outputIcon)) {
                imageOut.src = outputIcon;
                imageOut.onload = function () {
                    gc.drawImage(imageOut, sx1, sy + jobMeta.sy + 4 + jobMeta.hh*2/3, ICON_WW_2, ICON_WW_2);
                }

			} else {
				imageDefault.src = "img/default-form-icon.png";
				imageDefault.onload = function () {
					gc.drawImage(imageDefault, sx1, sy + jobMeta.sy + 4 + jobMeta.hh*2/3, ICON_WW_2, ICON_WW_2);
				}
			}

            gc.font = FORMFONT;
            gc.fillText(outputVal, sx1 + ICON_WW_2 + 4, sy + jobMeta.sy + jobMeta.hh*5/6);
		}


		//小框里面的线

		gc.strokeStyle = "#fff";

		var lineX = sx1 ;
		var lineX2 = sx + jobMeta.sx + jobMeta.ww - 10;
		gc.lineWidth = 1;
		
		gc.beginPath();	
		gc.moveTo(lineX, sy + jobMeta.sy + (jobMeta.hh * 2 / 3));
		gc.lineTo(lineX2, sy + jobMeta.sy + (jobMeta.hh * 2 / 3));
		gc.stroke();
		gc.closePath();

	} else if (PRO_JB_MT_CLS_SELECT_NODE == jobMeta.jobClass) {
		
		imageUrl= "img/tool_select_node.png";
		
		if (PRO_SELECT_NODE_TYPE_ALL_SEL == jobMeta.selectNodeType) {
			imageUrl = "img/tool_select_node_all.png";
		} else if (PRO_SELECT_NODE_TYPE_EXPRESS_SEL == jobMeta.selectNodeType) {
			imageUrl = "img/tool_select_node_express.png";
		}
		
		image.src = imageUrl;
		image.onload = function () {
			gc.drawImage(image, sx + jobMeta.sx + 8, sy + jobMeta.sy + 8, ICON_WW_1, ICON_WW_1);
		}
	} else if (PRO_JB_MT_CLS_COMBINE_NODE == jobMeta.jobClass) {
		imageUrl = "img/tool_combine_node.png";
		if (PRO_COMBINE_NODE_TYPE_AND_COMBINE == jobMeta.combineNodeType) {
			imageUrl = "img/tool_combine_node_and.png";
		} else if (PRO_COMBINE_NODE_TYPE_OR_COMBINE == jobMeta.combineNodeType) {
			imageUrl = "img/tool_combine_node_or.png";
		} else if (PRO_COMBINE_NODE_TYPE_EXPRESS_COMBINE == jobMeta.combineNodeType) {
			imageUrl = "img/tool_combine_node_express.png";
		}
		
		image.src = imageUrl;
		image.onload = function () {
			gc.drawImage(image, sx + jobMeta.sx + 8, sy + jobMeta.sy + 8, ICON_WW_1, ICON_WW_1);
		}
	} else if (PRO_JB_MT_CLS_STOP_NODE == jobMeta.jobClass) {
		imageUrl = "img/tool_status_stop.png";
		if (PRO_STOP_NODE_TYPE_NORMAL == jobMeta.stopNodeTyp) {
			imageUrl = "img/tool_stop_normal.png";
		} else if (PRO_STOP_NODE_TYPE_CANSEL == jobMeta.stopNodeType) {
			imageUrl = "img/tool_stop_cansel.png";
		} else if (PRO_STOP_NODE_TYPE_ABNORMAL == jobMeta.stopNodeType) {
			imageUrl = "img/tool_stop_abnormal.png";
		}
		
		image.src = imageUrl;
		image.onload = function () {
			gc.drawImage(image, sx + jobMeta.sx + 8, sy + jobMeta.sy + 8, ICON_WW_1, ICON_WW_1);
		}
	} else if (PRO_JB_MT_CLS_START_NODE == jobMeta.jobClass) {
		imageUrl = "img/tool_start_node.png";
		
		image.src = imageUrl;
		image.onload = function () {
			gc.drawImage(image, sx + jobMeta.sx + 8, sy + jobMeta.sy + 8, ICON_WW_1, ICON_WW_1);
		}
	}
}

function drawNode(gc, jobMeta){

	gc.fillStyle = WHITE_COLOR;
	if (PRO_JB_MT_CLS_WORK_FLOW == jobMeta.jobClass) {
		gc.strokeStyle = DARKORANGE_COLOR;
	} else if (PRO_JB_MT_CLS_JOB_NODE == jobMeta.jobClass){
		gc.strokeStyle = WHITE_COLOR;
	} else if (PRO_JB_MT_CLS_COMBINE_NODE == jobMeta.jobClass ||
			PRO_JB_MT_CLS_SELECT_NODE == jobMeta.jobClass ||
			PRO_JB_MT_CLS_STOP_NODE == jobMeta.jobClass ||
			PRO_JB_MT_CLS_START_NODE == jobMeta.jobClass){
		gc.strokeStyle = STATUS_COLOR;
		gc.fillSytle = STATUS_COLOR;
	} else {
		gc.strokeStyle = "rgb(128, 128, 128)";
	}

    gc.fillStyle = "rgb(242,243,246)";
    gc.strokeStyle = "#F8F8F9";

	gc.lineWidth = 1;
	gc.roundRect(sx + jobMeta.sx, sy + jobMeta.sy, jobMeta.ww, jobMeta.hh, {ul:4,ur:4,ll:4,lr:4}, true, true);
	
	drawNodeContent(gc, jobMeta);
}

function drawLink(gc, link){
	
	if (execLinkList.indexOf(link) >= 0) {
		gc.strokeStyle = DARKORANGE_COLOR;;
	} else if(selLink == link) {
		gc.strokeStyle = RED_COLOR;
	} else{
		gc.strokeStyle = "rgb(100, 100, 100)";
	}
	
	var ptList = link.ptList;
	var ptSize = ptList.length - 1;
	
	var pt1;
	var pt2;
	for (var i = 0; i < ptSize; i++) {
		pt1 = ptList[i];
		pt2 = ptList[i + 1];
		
		gc.beginPath();	
		gc.moveTo(sx + pt1.x, sy + pt1.y);
		gc.lineTo(sx + pt2.x, sy + pt2.y);
		gc.stroke();
		gc.closePath();
	}
	
	if (0 >= ptList.length) {
		return;
	}
	
	var lp0 = ptList[0];
	gc.fillArc(sx + lp0.x, sy + lp0.y, 2);
	
	var sn = ptList.length;
	if (2 <= sn) {
		var pt1 = ptList[sn - 2];
		var pt2 = ptList[sn - 1];
		
		var dx = pt2.x - pt1.x;
		var dy = pt2.y - pt1.y;
		
		var ax = pt2.x;
		var ay = pt2.y;
		var bx = pt2.x;
		var by = pt2.y;
		
		var px = pt2.x;
		var py = pt2.y;
		if (selLink != link) {
			gc.strokeStyle = "rgb(60, 60, 60)";
		}
		
		if(Math.abs(dx) > Math.abs(dy)){
			
			if (0 < dx) {
				px -= 16;
			} else {
				px += 16;
			}
			
			var k = dy / dx;
			
			py = k * (px - pt1.x) + pt1.y;
			
			ax = px ;
			ay = py - 5;
			
			bx = px ;
			by = py + 5;
		} else {
			if (0 < dy) {
				py -= 16;
			} else {
				py += 16;
			}
			
			var k = dx / dy;
			
			px = k * (py - pt1.y) + pt1.x;
			
			ay = py ;
			ax = px - 5;
			
			by = py ;
			bx = px + 5;	
		}
		
		gc.beginPath();
		gc.moveTo(sx + ax, sy + ay);
		gc.lineTo(sx + pt2.x, sy + pt2.y);
		
		gc.moveTo(sx + bx, sy + by);
		gc.lineTo(sx + pt2.x, sy + pt2.y);
	
		gc.stroke();
		gc.closePath();
	}
	
	var name = getTransferName(link);
	if (null != name) {
        gc.font = FORMFONT;
        gc.fillText(name, sx + link.sx + 4, sy + link.sy + link.hh / 2);
	}
}

function getTransferName(link) {
	var name = null;
	var linkType = new LinkType();
	if (PRO_JB_MT_LNK_TYPE_FS != link.linkType) {
		name = linkType.getName(link.linkType);
		//if (checkNotEmpty(link.linkExpress)) {
		//	name += " (" + link.linkExpress + ")";
		//}
	} else {
		if (selLink == link || checkNotEmpty(link.linkExpress)) {
			if (checkNotEmpty(link.linkExpress)) {
				if (link.linkExpress == "1") {
					name = "FnS";
				} else if (link.linkExpress == "2") {
					name = "FcS";
				} else if (link.linkExpress == "3") {
					name = "FeS";
				} else {
				//	name = "FS (" + link.linkExpress + ")";
				}
			} else {
				name = linkType.getName(link.linkType);
			}
		}
	}
	return name;
}

function drawLastOkStatus(gc) {
	if (null == lastOkJobMeta) {
		return;
	}
	var formStatus = lastOkJobMeta;
	gc.fillStyle = "rgb(216, 216, 216)";
	gc.strokeStyle = RED_COLOR;

	gc.lineWidth = 2;
	
	gc.roundRect(sx + formStatus.sx, sy + formStatus.sy, formStatus.ww, formStatus.hh, {ul:4,ur:4,ll:4,lr:4}, true, true);
	gc.fillStyle = RED_COLOR;
	
	drawNodeContent(gc, formStatus);
}

function drawSelNode(gc) {
	if (null == selJobMeta) {
		return;
	}
	
	var formStatus = selJobMeta;
	gc.fillStyle = WHITE_COLOR;;
	gc.strokeStyle = RED_COLOR;
	
	gc.roundRect(sx + formStatus.sx, sy + formStatus.sy, formStatus.ww, formStatus.hh, {ul:4,ur:4,ll:4,lr:4}, true, true);
	
	gc.fillStyle = RED_COLOR;
	
	drawNodeContent(gc, formStatus);
}

function drawSelLink(gc){
	if (null == selLink) {
		return;
	}
	gc.lineWidth = 2;
	drawLink(gc, selLink);
	var ptList = selLink.ptList;
	var lp0 = ptList[0];
	gc.fillArc(sx + lp0.x, sy + lp0.y, 5);
	var lp;
	for (var i = 1; i < ptList.length; i++) {
		lp = ptList[i];
		gc.fillRect(sx + lp.x - 4, sy + lp.y - 4, 8, 8);
	}
	if (null != selPt) {
		gc.roundRect(sx + selPt.x - 8, sy + selPt.y - 8 , 16, 16, {ul:4,ur:4,ll:4,lr:4}, false, true);

	}
	if (isSelLinkName) {
		gc.roundRect(sx + selLink.sx - 1, sy + selLink.sy - 1, selLink.ww + 2, 26, {ul:4,ur:4,ll:4,lr:4}, false, true);
	}
}

function drawNewNode(mex, mey){		
	var gc = canvas.getGraphicsContext2D();
	
	var image = new Image();
	var imageUrl;
	if (MODE_NEW_WORK_FLOW == drawMode || MODE_NEW_JOBNODE == drawMode) {
		gc.strokeStyle = BLUE_COLOR;
		gc.fillStyle = BLUE_COLOR;

		gc.lineWidth = 2;		
		gc.roundRect(mex, mey, DEFAULT_NODE_WW, DEFAULT_NODE_HH, {ul:4,ur:4,ll:4,lr:4}, false, true);

        gc.font = FORMFONT;
        gc.fillText(newNodeStr, mex + 82, mey + DEFAULT_NODE_HH / 2);
		imageUrl = "img/status_default.png"
	} else {
		gc.lineWidth = 2;
		gc.strokeStyle = BLUE_COLOR;
		gc.roundRect(mex, mey, DEFAULT_NODE_WW_SC, DEFAULT_NODE_HH, {ul:4,ur:4,ll:4,lr:4}, false, true);
		
		if (MODE_NEW_SELECT_NODE == drawMode) {
			imageUrl = "img/tool_select_node.png"
		} else if(MODE_NEW_COMBINE_NODE == drawMode) {
			imageUrl = "img/tool_combine_node.png"
		} else if(MODE_NEW_STOP_NODE == drawMode) {
			imageUrl = "img/tool_status_stop.png"
		} else {
			imageUrl = "img/tool_start_node.png"
		}		
	}
	
	image.src = imageUrl;
	image.onload = function() {
		gc.drawImage(image, mex + 4, mey + 4, 40, 40);	
	}
}

function findSelStep4Link(x, y){
	
	selJobMeta = null;
	var flowNodeList = proWf.proJobList;
	if (null == flowNodeList) {
		return;
	}
	
	var flowNode;
	for (var i = 0; i < flowNodeList.length; i++) {
		flowNode = flowNodeList[i];
		if (x >= (sx + flowNode.sx - 12) 
				&& x <= (sx + flowNode.sx + flowNode.ww + 12) 
				&& y >= (sy + flowNode.sy - 12) 
				&& y <= (sy + flowNode.sy + flowNode.hh + 12)) {
			selJobMeta = flowNode;
			return;
		}
	}
}

function findSelStep(x, y){
	
	selJobMeta = null;
	var flowNodeList = proWf.proJobList;
	if (null == flowNodeList) {
		return;
	}
	var flowNode;
	for (var i = 0; i < flowNodeList.length; i++) {
		
		if (x > (sx + flowNode.sx ) 
				&& x < (sx + flowNode.sx + flowNode.ww ) 
				&& y > (sy + flowNode.sy ) 
				&& y < (sy + flowNode.sy + flowNode.hh )) {
			selJobMeta = flowNode;
			break;
		}
	}
}

function findSelObj(x, y){
	
	selJobMeta = null;
	selLink = null;
	selPt   = null;
	isSelLinkName = false;
	joinNode = null;
	selSwimlane = null;
	if (null == proWf) {
		return;
	}
	
	if (0 < proWf.swimlaneList.length && SWIMLANE_HH > y) {
		var x1 = sx;
		var swimlane;
		for (var i = 0; i <  proWf.swimlaneList.length; i++) {
			
			swimlane = proWf.swimlaneList[i];
			if (x1 + swimlane.ww > x) {
				selSwimlane = swimlane;
				break;
			}
			x1 += swimlane.ww;
		}
		return;
	}
	
	var flowLinkList = proWf.linkerList;
	var flowNodeList = proWf.proJobList;
	
	var pt1 = null;
	var pt2 = null;
	var x1 = 0;
	var y1 = 0;
	var x2 = 0;
	var y2 = 0;
	var ptMaxIdx = 0;
	var stepLink;
	for (var i = 0; i < flowLinkList.length; i++) {
		stepLink = flowLinkList[i];
		if (x >= stepLink.sx + sx 
				&& x <= stepLink.sx + stepLink.ww + sx
				&& y >= stepLink.sy + sy
				&& y <= stepLink.sy + 24 + sy) {
			selLink = stepLink;
			isSelLinkName = true;
			return;
		}
		
		var ptList = stepLink.ptList;
		
		ptMaxIdx = ptList.length - 1;
		for (var j = 0; j <= ptMaxIdx; j++) {
			pt1 = ptList[j];
			if (8 >= Math.abs(pt1.x - x + sx)
				&& 8 >= Math.abs(pt1.y - y + sy)) {
				selPt = pt1;
				if (0 < pt1.joinNodeId) {
					
					var stepRect;
					for (var k = 0; k < flowNodeList.length; k++) {
						stepRect = flowNodeList[k]
						
						if (stepRect.id == pt1.joinNodeId) {
							joinNode = stepRect;
							break;
						}
					}
				}
				selLink = stepLink;
				return;
			}
		}
		if (1 <= ptMaxIdx) {
			for (var j = 0; j < ptMaxIdx; j++) {
				pt1 = ptList[j];
				pt2 = ptList[j + 1];
				
				if (pt2.x > pt1.x ) {
					x1 = pt1.x;
					x2 = pt2.x;
				} else {
					x1 = pt2.x;
					x2 = pt1.x;
				}
				
				if (pt2.y > pt1.y) {
					y1 = pt1.y;
					y2 = pt2.y;
				} else {
					y1 = pt2.y;
					y2 = pt1.y;
				}
				
				if (16 > x2 - x1) {
					x1 -= 8;
					x2 += 8;
				}
				if (16 > y2 - y1) {
					y1 -= 8;
					y2 += 8;
				}
				
				x1 += sx;
				x2 += sx;
				y1 += sy;
				y2 += sy;
				if (x > x1 && x < x2 && y > y1  && y < y2 ) {

					var dxx1 = x - pt1.x - sx;
					var dyy1 = y - pt1.y - sy;
					
					var dxx2 = pt2.x + sx - x;
					var dyy2 = pt2.y + sy - y;
					
					var dxx = pt2.x - pt1.x;
					var dyy = pt2.y - pt1.y;
					
					if ((4 > Math.abs(dxx1) && 4 > Math.abs(dyy1)) 
							|| (4 > Math.abs(dxx2) && 4 > Math.abs(dyy2))
							|| 4 > Math.abs(dxx) 
							|| 4 > Math.abs(dyy)) {
						
						selLink = stepLink;
						return;
					}
					var tanyxgap = (dxx1 * dyy / dxx ) - dyy1;
					
					if (16 >= Math.abs(tanyxgap)) {
						
						selLink = stepLink;
						return;
					}
				}
			}
		}
	}
	
	if (null != selLink) {
		return;
	}
	findSelStep(x, y);
}

function findSelStep4DrawLink(x, y){

	if (null == selJobMeta) {
		return null;
	}
	var lp = null;
	var step1 = selJobMeta;
	var x1 = x - sx;
	var y1 = y - sy;
	
	var maxx = step1.sx + step1.ww;
	var maxy = step1.sy + step1.hh;
	if (x1 < step1.sx) {
		x1 = step1.sx;
	}
	if (x1 > maxx ) {
		x1 = maxx;
	}
	if (y1 < step1.sy) {
		y1 = step1.sy;
	}
	if (y1 > maxy ) {
		y1 = maxy;
	}
	
	var dx1 = Math.abs(x1 - step1.sx);
	var dx2 = Math.abs(maxx - x1);
	var dy1 = Math.abs(y1 - step1.sy);
	var dy2 = Math.abs(maxy - y1);

	var mindd = dx1;
	if (dx2 < dx1) {
		mindd = dx2;
	}
	if (dy1 < mindd) {
		mindd = dy1;
	}
	if (dy2 < mindd) {
		mindd = dy2;
	}
	
	if (mindd == dx1) {
		lp = new StatusLinkPoint(step1.sx,y1);
	} else if (mindd == dx2) {
		lp = new StatusLinkPoint(maxx,y1);
	} else if (mindd == dy1) {
		lp = new StatusLinkPoint(x1,step1.sy);
	} else {
		lp = new StatusLinkPoint(x1,maxy);
	}
	lp.joinNodeId = selJobMeta.id;
	return lp;	
}

function setNewPointInJoinPt(x, y) {

	if (null == selPt || 0 >= selPt.joinNodeId) {
		return;
	}
	var lp = selPt;
	var step1 = null;
	
	var x1 = x - sx;
	var y1 = y - sy;
	
	x1 = adjustmentDx4Transfer(selLink, selPt, x1);
	y1 = adjustmentDy4Transfer(selLink, selPt, y1);
	
	var nodeList = proWf.proJobList;
	 
	for (var i = 0; i < nodeList.length; i++) {
		if (selPt.joinNodeId == nodeList[i].id) {
			step1 = nodeList.get(i);
			break;
		}
	}
	if (null == step1) {
		return;
	}
	var maxx = step1.sx + step1.ww;
	var maxy = step1.sy + step1.hh;
	if (x1 < step1.sx) {
		x1 = step1.sx;
	}
	if (x1 > maxx ) {
		x1 = maxx;
	}
	if (y1 < step1.sy) {
		y1 = step1.sy;
	}
	if (y1 > maxy ) {
		y1 = maxy;
	}
	
	var dx1 = Math.abs(x1 - step1.sx);
	var dx2 = Math.abs(maxx - x1);
	var dy1 = Math.abs(y1 - step1.sy);
	var dy2 = Math.abs(maxy - y1);

	var mindd = dx1;
	if (dx2 < dx1) {
		mindd = dx2;
	}
	if (dy1 < mindd) {
		mindd = dy1;
	}
	if (dy2 < mindd) {
		mindd = dy2;
	}
	
	if (mindd == dx1) {
		lp.x = step1.sx;
		lp.y = y1;
	} else if (mindd == dx2) {
		lp.x = maxx;
		lp.y = y1;
	} else if (mindd == dy1) {
		lp.x = x1;
		lp.y = step1.sy;
	} else {
		lp.x = x1;
		lp.y = maxy;
	}
}

function delSelObj() {
	
	delSelLink();
	delSelNode();
	delSelSwimlane();
	
	if (ACTIONTYPE_NONE == proWf.actionType) {
		if (!checkNotEmpty(proWf.id)) {
			proWf.actionType = ACTIONTYPE_INSERT;
		} else {
			proWf.actionType = ACTIONTYPE_UPDATE;
		}
	}		
	if (null != paneProWfNodeList) {
		//paneProWfNodeList.proWfMeta = proWf;
		//paneProWfNodeList.drawView();
	}
	drawChart();
}

function delSelSwimlane() {
	if (null == proWf) {
		return;
	}
	if (null == selSwimlane) {
		return;
	}
	
	var idx = proWf.swimlaneList.indexOf(selSwimlane);
	proWf.swimlaneList.splice(idx, 1);
	selSwimlane = null;
}

function delSelLink() {
	if (null == proWf) {
		return;
	}
	if (null == selLink) {
		return;
	}
	var linkList = proWf.linkerList;
	var link1;
	for (var i = 0; i < linkList.length; i++) {
		
		link1 = linkList[i];
		if (link1 == selLink) {
			linkList.splice(i, 1);
			break;
		}
	}
}

function delSelNode(){
	if (null == proWf) {
		return;
	}
	if (null == selJobMeta) {
		return;
	}
	var linkList = proWf.linkerList;
	var link1;
	for(var i = linkList.length - 1; i >= 0; i--) {
		link1 = linkList[i];
		if (link1.formJobMetaId == selJobMeta.id
				|| link1.formJobMetaId == selJobMeta.id) {
			linkList.splice(i, 1);
		}
	}
	var nodeList = proWf.proJobList;
	var node1;
	for (var i = 0; i < nodeList.length; i++) {
		node1 = nodeList[i];
		if (node1 == selJobMeta) {
			nodeList.splice(i, 1);
			break;
		}
	}
}

function recalLinkNameWidth(link){
	if (null == link) {
		return;
	}
	
	//textTmp.setText(getTransferName(link));
	link.ww = textTmp.boundsInLocal.width + 8;
}

function setSelFormStatus(obj) {
	selLink = null;
	selPt   = null;
	isSelLinkName = false;
	joinNode = null;
	selJobMeta = obj;
}

function addNewSwimlane(authorityGroup) {
	swimlane = new FormHandleStatusSwimlane();		
	swimlane.authorityGroupId = authorityGroup.id;
	swimlane.authorityGroup = authorityGroup;
	proWf.swimlaneList.push(swimlane);
	if (ACTIONTYPE_NONE == proWf.actionType) {
		proWf.actionType = ACTIONTYPE_UPDATE;
	}
	drawView();
}

function showAuthorityGroupMember(me) {
	
	var y = me.getY();
	var x = me.getX();

	var locX = 0;
	var authorityGroup = null;
	if (0 < proWf.swimlaneList.length && 0 == swimlaneDragMode && SWIMLANE_HH > y) {
		var x1 = sx;
		var swimlane;
		for (var i = 0; i < proWf.swimlaneList.length; i++) {
			
			swimlane = proWf.swimlaneList[i];
			
			if (x1 + swimlane.ww > x) {
				if (36 > (x - x1)){
					authorityGroup = swimlane.authorityGroup;
					locX = x1;
				}
				break;
			}
			x1 += swimlane.ww;
		}
	}
	
	if (null == authorityGroup) {
		isShowAGMember = false;
		//if (null != pagmv) {
		//	this.getChildren().remove(pagmv);
		//}
		return;
	}// else {
		//if (null != pagmv) {
		//	if(pagmv.getAuthorityGroup() == authorityGroup &&
		//			this.getChildren().contains(pagmv)){
		//		this.getChildren().remove(pagmv);
		//		isShowAGMember = false;
		//		return;
		//	}
	//	}
	//}
	
	//if (null == pagmv) {
		/*pagmv = new PomaAuthorityGroupMemberView();
		pagmv.init1(fPage, 200);
		pagmv.setCloseCallback(new Callback<Boolean, Boolean>(){

			@Override
			public Boolean call(Boolean param) {
				getChildren().remove(pagmv);
				return true;
			}
			
		});*/
	//}
	//pagmv.setAuthorityGroup(authorityGroup);
	
	//var ww1 = pagmv.getWidth();
	//if(ww1 + locX + 2 > ww){
	//	locX = ww - ww1 - 2;
	//}
	
	//pagmv.setTranslateX(locX + 2);
	//pagmv.setTranslateY(SWIMLANE_HH + 2);
	//if(!getChildren().contains(pagmv)){
	//	this.getChildren().add(pagmv);
	//}
	//pagmv.toFront();
	isShowAGMember = true;
}

/*function resetInOutDisVal(){
	inputIconMap.clear();
	inputValueMap.clear();
	outputIconMap.clear();
	outputValueMap.clear();
	inputFullValueMap.clear();
	outputFullValueMap.clear();
	if (null == proWf) {
		return;
	}
	for (ProJobMeta jobMeta : proWf.proJobList) {
		if(PRO_JB_MT_CLS_JOB_NODE != jobMeta.jobClass){
			continue;
		}
		
		resetInOutDisVal4Job(jobMeta);
	}
}

function resetInOutDisVal4Job(jobMeta) {
	if (PRO_JB_MT_CLS_JOB_NODE != jobMeta.jobClass) {
		return;
	}
	
	if (checkNotEmpty(jobMeta.inputFormDataExpress)) {
		String[] inputVals = jobMeta.getInputFormDataExpress().split(ComConf.SPLIT_CHAR_1);
		int idx = 0;
		for(String item : inputVals){
			String[] items = item.split(ComConf.SPLIT_CHAR_2);
			if(items[0].equalsIgnoreCase("FORM")){
				if (4 != items.length) {
					continue;
				}
				
				FormMetaInfo formMeta = FormMetaInfoFactory.getFactory().findById(items[1]);
				if (null != formMeta) {
					if (0 == idx) {
						inputIconMap.put(jobMeta.id, jobMeta.iconName);
						if (1 < inputVals.length) {
							inputValueMap.put(jobMeta.id, jobMeta.name + " ...");
						} else {
							inputValueMap.put(jobMeta.id, jobMeta.name);
						}
						inputFullValueMap.put(jobMeta.id, jobMeta.name);
					} else {
						inputFullValueMap.put(jobMeta.id, inputFullValueMap.get(jobMeta.id) + " " + jobMeta.name);
					}
					idx++;
					
				}else{
					inputIconMap.put(jobMeta.id, null);
					inputValueMap.put(jobMeta.id, null);
					inputFullValueMap.put(jobMeta.id, null);
				}
				
			}
		}
	} else {
		inputIconMap.put(jobMeta.id, null);
		inputValueMap.put(jobMeta.id, null);
		inputFullValueMap.put(jobMeta.id, null);
	}
	

	if (StringUtils.isNotBlank(jobMeta.getOutputFormDataExpress())) {
		var outputVals = jobMeta.getOutputFormDataExpress().split(ComConf.SPLIT_CHAR_1);
		var idx = 0;
		for (String item : outputVals) {
			String[] items = item.split(ComConf.SPLIT_CHAR_2);
			if (items[0].equalsIgnoreCase("NEW")) {
				if (3 > items.length) {
					continue;
				}
				
				var formMeta = FormMetaInfoFactory.getFactory().findById(items[2]);
				if (null != formMeta) {
					if (0 == idx) {
						var strTmp = items[1];
						if ("-1" == items[1]) {
							strTmp = "n";
						}
						outputIconMap.put(jobMeta.id, formMeta.iconName);
						if (1 < outputVals.length) {
							outputValueMap.put(jobMeta.id, "[+" + strTmp + "] " + formMeta.name + " ...");
						} else {
							outputValueMap.put(jobMeta.id, "[+" + strTmp + "] " + formMeta.name);
						}
						outputFullValueMap.put(jobMeta.id, "[+" + strTmp + "] " + formMeta.name);
					} else {
						String val = outputFullValueMap.get(jobMeta.id);
						outputFullValueMap.put(jobMeta.id, val + " " + formMeta.name);
					}
					idx++;
					
				} else {
					outputIconMap.put(jobMeta.id, null);
					outputValueMap.put(jobMeta.id, null);
					outputFullValueMap.put(jobMeta.id, null);
				}
			}
			
			
		}
	} else {
		outputIconMap.put(jobMeta.id, null);
		outputValueMap.put(jobMeta.id, null);
		outputFullValueMap.put(jobMeta.id, null);
	}
	
}*/

/**
 * ID是否包含在List中
 * 
 * @param list 列表
 * @param id 查找的ID
 * @return true 包含、false 不包含
 */
function contains(list, id) {
	if (null == list || 0 == list.length) {
		return false;
	}
	
	for (var i = 0; i < list.length; i++) {
		if (id == list[i]) {
			return true;
		}
	}
	return false;
}
//检查是否为不空
function checkNotEmpty(thing){
	if(thing === "" || thing === null || thing === undefined){
		return false
	}else{
        return true
	}
}