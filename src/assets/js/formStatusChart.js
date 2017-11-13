/**
 * 表单状态机图生成JS
 *
 * Author: w.m.
 * CreateDate：2016/11/28
 * History：
 */
var formMeta
var lastOkStatusMap = null
var selStatusMap = null
var selStatusTransfer = null
var selSwimlane = null
var selPt = null
var ww = 800
var hh = 600
var SX = 0
var SY = 2
var sx = SX
var sy = SY
var px = 0
var py = 0
var px0 = 0
var py0 = 0
var isDrag = false

var ICON_WW_1 = 40
var ICON_WW_2 = 28

var INIT = 1

var DEFAULT_NODE_WW = 150
var DEFAULT_NODE_HH = 48
var DEFAULT_NODE_WW_SC = 48
var WORK_NODE_HH = 72

var swimlaneDragMode = 0
var swimlaneMoveOffsetX = 0
var isViewMode = false
var isSelLinkName = false

// FormStatusMapType
var CONFIRM_STATUS = 0
var WORK_STATUS = 1
var SELECT_NODE = 2
var COMBINE_NODE = 3
var STOP_NODE = 4

var MODE_MOVE = 0
var MODE_NEW_CONFIRM_STATUS = 1
var MODE_NEW_STEP_LINK = 2
var MODE_RESIZE_STEP = 3
var MODE_MODIFY_PROP = 4
var MODE_SHOW_EDIT_FIELD = 5
var MODE_RESIZE_X1 = 6
var MODE_RESIZE_X2 = 7
var MODE_NEW_STEP_SEL = 8
var MODE_NEW_SWIMLANE = 9
var MODE_NEW_WORK_STATUS = 10
var MODE_NEW_SELECT_NODE = 11
var MODE_NEW_COMBINE_NODE = 12
var MODE_NEW_STOP_NODE = 13

var drawMode = MODE_MOVE
var paneWorkFlowNodeList
var canvas = null
var gc = null
var adjustmentGap = 4

var platTreeNav
var selFormMetaId = ''
var selClassId = ''
var allClassId = ''

// unuse
$(function () {
    getUserName()

    var options = {
        // 查询事件
        'search': function (selectedValue) {
        	// 将选择值设置为选中表单的第一个
        	var selVal = selectedValue['formNm'].valueArray[0]

        	// 判断选中的表单类型有没有变化，有变化就保存最新的选中
            if (selClassId != selectedValue['formClass'].valueArray.join(',')) {
                selClassId = selectedValue['formClass'].valueArray.join(',')

                // 如果选中的表单类型为空的，根据所有表单设置查询选择器
                if (!checkNotEmpty(selClassId)) {
                    appendSubToNav(allClassId)
                } else {
                    appendSubToNav(selClassId)
                }
            };

            //
            if (checkNotEmpty(selVal) && selVal != selFormMetaId) {
                selFormMetaId = selVal
                drawStatusChart(selFormMetaId, '')
            };
        },
        'expandRow': 2,
        'unclassified': false,
        'searchBoxs': [
            {'id': 'formClass', 'title': '分类', 'isMultiple': true},
            {'id': 'formNm', 'title': '表单', 'isMultiple': false}
        ]
    }

    var filterData = new Object()
    var formClass = new Array()

	// 获得表单分类数据
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
	    url: 'formClass',
	    async: false,
	    success: function (data) {
	    	if (data.result == 'success') {
	    		var classId = ''
	    		if (data.data.length > 0) {
	    			for (var i = 0; i < data.data.length; i++) {
        var fommClsItem = new Object()
        fommClsItem.text = data.data[i].formClassName
        fommClsItem.value = data.data[i].id
        classId = classId + data.data[i].id + ','
        formClass.push(fommClsItem)
	    			}

        filterData.formClass = formClass

	    			// 设置过滤条件组
        options.data = filterData
        platTreeNav = $('#platTreeNav').fiterMore(options)
        allClassId = classId

                    // 根据地址栏参数显示指定的filter
        if (GetParam('id') != null && GetParam('id').split(',').length > 0) {
                    	$('#platTreeNav .searchbox-item:first-child .filter_block span').hide()
                    	$('#platTreeNav .searchbox-item:first-child .option_all').remove()
                    	allClassId = ''
                    	$.each(GetParam('id').split(','), function (i, str) {
                    		$('#platTreeNav .searchbox-item:first-child .filter_block span[data-value=' + str + ']').show()
                    		allClassId = allClassId + str + ','
                    	})
                    	$('#platTreeNav .searchbox-item:first-child .filter_block span:hidden').remove()
                    	$('#platTreeNav .searchbox-item:first-child .filter_block span:first-child').click()
                    	classId = GetParam('id').split(',')[0]
                    	appendSubToNav(classId)
        } else {
                    	appendSubToNav(classId)
        }
    }
	    	} else {
	        	// 如果在服务器端处理出错的话
	            bootbox.alert(data.message)
	            return
	        }
	    },
	    error: function (data) {
	    	bootbox.alert('发生错误，请与管理员联系!')
	        return
	    }
    })
})
// 设置查询选择器
function appendSubToNav (classId) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
	    url: 'formMeta4Class',
	    data: {classId: classId},
	    success: function (data) {
	    	if (data.result == 'success') {
        var listFormMeta = data.data
        if (listFormMeta != null && listFormMeta.length > 0) {
            var data = new Array()
            var firstFormMetaId = ''
            for (var j = 0; j < listFormMeta.length; j++) {
                var formMetaItem = new Object()
                formMetaItem.value = listFormMeta[j].id
                formMetaItem.text = listFormMeta[j].name

                if (j == 0) {
                    firstFormMetaId = listFormMeta[j].id
                }

                if (selFormMetaId == listFormMeta[j].id) {
                    firstFormMetaId = listFormMeta[j].id
                }

                data.push(formMetaItem)
            }

            platTreeNav.refreshData('formNm', data)

					// 触发对应
            $('span[data-value=\'' + firstFormMetaId + '\']').trigger('click')
        }
	    	} else {
	        	// 如果在服务器端处理出错的话
	            // bootbox.alert(data.message);
	            return
	        }
	    },
	    error: function (data) {
	    	bootbox.alert('发生错误，请与管理员联系!')
	        return
	    }
    })
}
function onSelect (e) {
    $('.k-link').removeClass('current-menu')
    $(e.item).find('> .k-link').addClass('current-menu')
}

/*
*
* 开始绘图部分
*drawStatusChart(selFormMetaId, "");
* */
// 根据formMetaId和formInsId获取表单定义数据，绘制状态示意图
function drawStatusChart (formMetaId, formInsId) {
    lastOkStatusMap = null
    selStatusMap = null
    selStatusTransfer = null
    selSwimlane = null
    selPt = null

	// 获得流程示意图数据
    $.ajax({
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
	    url: 'formStatusChart',
	    async: false,
	    data: {formMetaId: formMetaId, formInsId: formInsId},
	    success: function (data) {
	    	if (data.result == 'success') {
	    		// 更新对应行的数据
	            formMeta = data.data

                // 获取画面画布
        canvas = document.getElementById('FrmStatusCan')

                // 获取绘制上下文
        gc = canvas.getContext('2d')

                // 设置起始坐标,保证细线效果
        gc.translate(0.5, 0.5)

        ww = formMeta.ww
        hh = formMeta.hh

        canvas.width = ww
        canvas.height = hh

                // 点击事件
                // canvas.addEventListener('click', onClick, false);

                // 鼠标移动事件
                // canvas.addEventListener('mousemove', onMouseMove, false);

                // 鼠标按下事件
                // canvas.addEventListener('mousedown', onMouseDown, false);

                // 鼠标抬起事件
                // canvas.addEventListener('mouseup', onMouseUp, false);

                // 绘制示意图
        drawChart()
	    	} else {
	        	// 如果在服务器端处理出错的话
	            bootbox.alert(data.message)
	            return
	        }
	    },
	    error: function (data) {
	    	bootbox.alert('发生错误，请与管理员联系!')
	        return
	    }
    })
}

/**
 * 鼠标按键按下事件
 *
 * @param e 事件消息
 */
function onMouseDown (e) {
	// 事件触发区域，外部边框
    var rect = e.target.getBoundingClientRect()

	// 换算成事件触发区域内部坐标
    var mex = e.clientX - rect.left
    var mey = e.clientY - rect.top

    px = mex
    py = mey
    px0 = mex
    py0 = mey
    isDrag = false
    swimlaneDragMode = 0
    swimlaneMoveOffsetX = 0

    if (isViewMode) {
        return
    }

    if (mex < 36 && mey < 36) {
        if (ACTIONTYPE_INSERT == formMeta.actionType || ACTIONTYPE_UPDATE == formMeta.actionType) {
            return
        }
    }

    if (MODE_NEW_CONFIRM_STATUS == drawMode || MODE_NEW_WORK_STATUS == drawMode ||
			MODE_NEW_SELECT_NODE == drawMode || MODE_NEW_COMBINE_NODE == drawMode ||
			MODE_NEW_STEP_LINK == drawMode || MODE_SHOW_EDIT_FIELD == drawMode || MODE_NEW_STOP_NODE == drawMode) {
        return
    }

    if (MODE_RESIZE_X1 == drawMode || MODE_RESIZE_X2 == drawMode) {
        return
    }

	// 查找被选中的对象
    findSelObj(mex, mey)
    drawChart()

	// 如果发生按下事件，将鼠标移动事件切换成鼠标拖拽时间
    canvas.onmousemove = onMouseDrag
}

/**
 * 鼠标按键抬起事件
 *
 * @param e 事件消息
 */
function onMouseUp (e) {
	// 事件触发区域，外部边框
    var rect = e.target.getBoundingClientRect()

	// 换算成事件触发区域内部坐标
    var mex = e.clientX - rect.left
    var mey = e.clientY - rect.top

    var preSx = sx

    if (sx > SX) {
        sx = SX
    }
    if (sy > SY) {
        sy = SY
    }
    if (formMeta == null) {
        return
    }

    if (sx < 200 - formMeta.ww) {
        sx = 200 - formMeta.ww
    }

    if (sy < 200 - formMeta.hh) {
        sy = 200 - formMeta.hh
    }

	// if (null != pagmv && getChildren().contains(pagmv)) {
	//	pagmv.setTranslateX(pagmv.getTranslateX() + sx - preSx);
	// }

    if (isViewMode) {
        drawChart()
        if (!isDrag) {
            showAuthorityGroupMember(e)
        }
        return
    }

    if (mex < 36 && mey < 36) {
        if (ACTIONTYPE_INSERT == formMeta.actionType || ACTIONTYPE_UPDATE == formMeta.actionType) {
            saveAction()
            return
        }
    }

    switch (drawMode) {
    case MODE_MOVE:
			// 左侧内容区显示
        if (paneWorkFlowNodeList != null) {
            if (selStatusMap != null) {
					// paneWorkFlowNodeList.setFormHandleStatusMap(selStatusMap,false);
            } else if (selStatusTransfer != null) {
					// paneWorkFlowNodeList.setFormStatusTransfer(selStatusTransfer,false);
            } else {
					// paneWorkFlowNodeList.setFormMeta(formMeta);
            }
				// paneWorkFlowNodeList.drawView();
        }
        break
    case MODE_NEW_CONFIRM_STATUS:
    case MODE_NEW_WORK_STATUS:
    case MODE_NEW_SELECT_NODE:
    case MODE_NEW_STOP_NODE:
    case MODE_NEW_COMBINE_NODE:

		/*	if (null == formMeta) {
				return;
			}
			FormHandleStatusMap newNode = new FormHandleStatusMap();
			newNode.setPrivateMapId(formMeta.calcMaxSID());
			newNode.setSx(mex - sx);
			newNode.setSy(mey - sy);
			newNode.setHh(DEFAULT_NODE_HH);

			if (MODE_NEW_CONFIRM_STATUS == drawMode) {
				if (null == formStatusSel) {
					return;
				}
				newNode.formHandleStatus = formStatusSel;
				newNode.setStatusId(formStatusSel.getId());
				newNode.setWw(DEFAULT_NODE_WW);
				newNode.setStatusMapType(CONFIRM_STATUS);
			} else if (MODE_NEW_WORK_STATUS == drawMode) {
				if (null == formStatusSel) {
					return;
				}
				newNode.formHandleStatus = formStatusSel;
				newNode.setStatusId(formStatusSel.getId());
				newNode.setHh(WORK_NODE_HH);
				newNode.setWw(DEFAULT_NODE_WW);
				newNode.setStatusMapType(WORK_STATUS);
			} else if(MODE_NEW_SELECT_NODE == drawMode) {
				newNode.setWw(DEFAULT_NODE_WW_SC);
				newNode.setStatusMapType(SELECT_NODE);
			} else if(MODE_NEW_COMBINE_NODE == drawMode) {
				newNode.setWw(DEFAULT_NODE_WW_SC);
				newNode.setStatusMapType(COMBINE_NODE);
			} else if(MODE_NEW_STOP_NODE == drawMode) {
				newNode.setWw(DEFAULT_NODE_WW_SC);
				newNode.setStatusMapType(STOP_NODE);
			}

			List<FormHandleStatusMap> nodeList = formMeta.getStatusList();

			nodeList.add(newNode);
			setDrawMode(MODE_MOVE);
			selStatusMap = newNode;
			if (null != paneWorkFlowNodeList) {
				paneWorkFlowNodeList.setFormHandleStatusMap(newNode,true);
			}

			if (ACTIONTYPE_NONE == formMeta.getActionType()) {
				if (null == formMeta.getId() || 0 == formMeta.getId().length()) {
					formMeta.setActionType(ACTIONTYPE_INSERT);
				} else {
					formMeta.setActionType(ACTIONTYPE_UPDATE);
				}
			}
			if (null != paneWorkFlowNodeList) {
				paneWorkFlowNodeList.drawView();
			} */
        break
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
				for (FormHandleStatusMap tmpMap : formMeta.getStatusList()) {
					if (tmpMap.getPrivateMapId() == selStatusMap.getPrivateMapId()){
						if(COMBINE_NODE == tmpMap.getStatusMapType()){
							for (FormStatusTransfer transfer : formMeta.getStatusTransferList()) {
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
					newLink.setTransferId(formMeta.calcMaxSID());
					newLink.setStartNodeId(selStatusMap.getPrivateMapId());
					newLink.addPoint(lp);

					formMeta.getStatusTransferList().add(newLink);

					selStatusTransfer = newLink;
				}
			} else {
				StatusLinkPoint lp = findSelStep4DrawLink(mex,mey);
				if (null != lp) {
					List<FormStatusTransfer> drawLinkList = formMeta.getStatusTransferList();
					boolean find1 = false;
					for (int k = 0; k < drawLinkList.size(); k++) {
						FormStatusTransfer tmpLink = drawLinkList.get(k);
						if (newLink.getStartNodeId() == tmpLink.getStartNodeId()
								&& selStatusMap.getPrivateMapId() == tmpLink.getEndNodeId()) {
							find1 = true;
							break;
						}
					}

					if (!find1) {
						for(FormHandleStatusMap tmpMap : formMeta.getStatusList()){
							if(tmpMap.getPrivateMapId() == selStatusMap.getPrivateMapId()){
								if(SELECT_NODE == tmpMap.getStatusMapType()){
									for(FormStatusTransfer transfer : formMeta.getStatusTransferList()){
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
					if(!find1 && 0 < ptList.size()){

						String newLinkName = "NEW LINK";

						newLink.setEndNodeId(selStatusMap.getPrivateMapId());

						FormHandleStatusMap startMap = null;
						FormHandleStatusMap endMap = null;
						for (FormHandleStatusMap statusMap1 : formMeta.getStatusList()) {
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

						StatusLinkPoint lp0 = ptList.get(0);
						newLink.setSx((lp0.x + lp.x ) / 2);
						newLink.setSy((lp0.y + lp.y ) / 2);
						newLink.setHh(24);

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

						if (ACTIONTYPE_NONE == formMeta.getActionType()) {
							if (null == formMeta.getId() || 0 == formMeta.getId().length()) {
								formMeta.setActionType(ACTIONTYPE_INSERT);
							} else {
								formMeta.setActionType(ACTIONTYPE_UPDATE);
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
					int sn = newLink.getPtList().size();
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
			} */
        break
    case MODE_RESIZE_X1:
        break
    case MODE_RESIZE_X2:
        break
    }

    if (selSwimlane != null) {
        if (swimlaneDragMode == 2) {
            var num1 = formMeta.swimlaneList.length

            var idx = formMeta.swimlaneList.indexOf(selSwimlane)
			// for (var i = 0; i < num1; i++) {
			//	if (formMeta.swimlaneList[i].authorityGroupId == selSwimlane.authorityGroupId) {
			//		idx = i;
			//		break;
			//	}
			// }

            if (swimlaneMoveOffsetX < 0 && idx > 0) {
                swimlaneMoveOffsetX = -swimlaneMoveOffsetX
                var x = 0
                var swimlane
                for (idx--; idx >= 0; idx--) {
                    swimlane = formMeta.swimlaneList[idx]
                    if ((x + swimlane.ww / 2) < swimlaneMoveOffsetX &&
							((x + swimlane.ww) > swimlaneMoveOffsetX || idx == 0)) {
						// formMeta.swimlaneList.remove(selSwimlane);
						// formMeta.swimlaneList.add(idx, selSwimlane);
                        formMeta.swimlaneList.splice(idx, 1, selSwimlane)
                        break
                    } else if ((x + swimlane.ww / 2) > swimlaneMoveOffsetX) {
						// formMeta.swimlaneList.remove(selSwimlane);
						// formMeta.swimlaneList.add(idx + 1, selSwimlane);
                        formMeta.swimlaneList.splice(idx, 1)
                        formMeta.swimlaneList.splice(idx + 1, 0, selSwimlane)
                        break
                    }
                    x += swimlane.ww
                }
            } else if (swimlaneMoveOffsetX > 0 && (num1 - 1) > idx) {
                var x = 0
                var swimlane
                for (idx++; idx < num1; idx++) {
                    swimlane = formMeta.swimlaneList[idx]
                    if ((x + swimlane.ww / 2) < swimlaneMoveOffsetX &&
							((x + swimlane.ww) > swimlaneMoveOffsetX || ((num1 - 1) == idx))) {
						// formMeta.swimlaneList.remove(selSwimlane);
						// formMeta.swimlaneList().add(idx, selSwimlane);
                        formMeta.swimlaneList.splice(idx, 1, selSwimlane)

                        break
                    } else if ((x + swimlane.ww / 2) > swimlaneMoveOffsetX) {
						// formMeta.swimlaneList.remove(selSwimlane);
						// formMeta.swimlaneList.add(idx - 1, selSwimlane);
                        formMeta.swimlaneList.splice(idx, 1)
                        formMeta.swimlaneList.splice(idx - 1, 0, selSwimlane)
                        break
                    }
                    x += swimlane.ww
                }
            }
        }
        swimlaneMoveOffsetX = 0
        swimlaneDragMode = 0
    }
    drawChart()

	// 重新设置鼠标移动事件
    canvas.onmousemove = onMouseMove
}

/**
 * 鼠标拖拽事件
 *
 * @param e 事件消息
 */
function onMouseDrag (e) {
	// 事件触发区域，外部边框
    var rect = e.target.getBoundingClientRect()

	// 换算成事件触发区域内部坐标
    var mex = e.clientX - rect.left
    var mey = e.clientY - rect.top

    var dx = mex - px
    var dy = mey - py
    px = mex
    py = mey

    if (formMeta == null) {
        return
    }
    if (px0 < 36 && py0 < 36) {
        if (ACTIONTYPE_INSERT == formMeta.actionType || ACTIONTYPE_UPDATE == formMeta.actionType) {
            return
        }
    }

    if (isViewMode) {
        if (MODE_MOVE == drawMode) {
            sx += dx
            sy += dy
            drawChart()
			// if (null != pagmv && getChildren().contains(pagmv)) {
			//	pagmv.setTranslateX(pagmv.getTranslateX() + dx);
			// }
            isDrag = true
        }
        return
    }

    if (MODE_MOVE == drawMode) {
        if (selStatusMap == null && selStatusTransfer == null && selSwimlane == null) {
            sx += dx
            sy += dy
            drawChart()
			// if (null != pagmv && getChildren().contains(pagmv)){
			//	pagmv.setTranslateX(pagmv.getTranslateX() + dx);
			// }
            isDrag = true
            return
        }

        if (selSwimlane != null) {
            if (swimlaneDragMode == 0) {
                if (Math.abs(dx) < Math.abs(dy)) {
                    swimlaneDragMode = 2
                } else {
                    swimlaneDragMode = 1
                }
            }

            if (swimlaneDragMode == 1) {
                selSwimlane.ww = selSwimlane.ww + dx
                if (SWIMLINE_WW > selSwimlane.ww) {
                    selSwimlane.ww = SWIMLINE_WW
                }
            } else {
                swimlaneMoveOffsetX += dx
            }

            if (!checkNotEmpty(formMeta.id)) {
                formMeta.actionType = ACTIONTYPE_INSERT
            } else {
                formMeta.actionType = ACTIONTYPE_UPDATE
            }

            drawChart()
            isDrag = true
            return
        }
        if (selStatusTransfer != null) {
            if (isSelLinkName == true) {
                var newx = selStatusTransfer.sx + dx
                var newy = selStatusTransfer.sy + dy
                if (newx < 0) {
                    newx = 0
                }
                if (newy < 0) {
                    newy = 0
                }
                selStatusTransfer.sx = newx
                selStatusTransfer.sy = newy
            }
            if (selPt != null) {
                if (selPt.joinNodeId > 0) {
                    setNewPointInJoinPt(mex, mey)
                } else {
                    selPt.x = selPt.x + dx
                    selPt.y = selPt.y + dy

                    selPt.x = adjustmentDx4Transfer(selStatusTransfer, selPt, selPt.x)
                    selPt.y = adjustmentDy4Transfer(selStatusTransfer, selPt, selPt.y)
                }
            }
            if (ACTIONTYPE_NONE == formMeta.actionType) {
                if (!checkNotEmpty(formMeta.id)) {
                    formMeta.actionType = ACTIONTYPE_INSERT
                } else {
                    formMeta.actionType = ACTIONTYPE_UPDATE
                }
            }
        }
        if (selStatusMap != null) {
            dx = adjustmentDx4Node(selStatusMap, dx)
            dy = adjustmentDy4Node(selStatusMap, dy)

            resetStatusLoc(dx, dy)
        }
    } else if (MODE_RESIZE_X1 == drawMode) {
        var newSx = selStatusMap.sx + dx
        if (newSx < 0) {
            return
        }
        var newWw = selStatusMap.ww - dx
        if (newWw < 96) {
            return
        }

        var flowLinkList = formMeta.linkerList
        for (var i = 0; i < flowLinkList.length; i++) {
            var link1 = flowLinkList[i]
            if (link1.startNodeId == selStatusMap.privateMapId) {
                var ptList = link1.ptList
                var pt0 = ptList[0]
                if (Math.abs(pt0.x - selStatusMap.sx) < 2) {
                    pt0.x = newSx
                }
                if (pt0.x < newSx) {
                    pt0.x = newSx
                }
            }
            if (link1.endNodeId == selStatusMap.privateMapId) {
                var ptList = link1.ptList
                var pt = ptList[ptList.length - 1]
                if (Math.abs(pt.x - selStatusMap.sx) < 2) {
                    pt.x = newSx
                }
                if (pt.x < newSx) {
                    pt.x = newSx
                }
            }
        }
        selStatusMap.ww = newWw
        selStatusMap.sx = newSx
        if (ACTIONTYPE_NONE == formMeta.actionType) {
            if (!checkNotEmpty(formMeta.id)) {
                formMeta.actionType = ACTIONTYPE_INSERT
            } else {
                formMeta.actionType = ACTIONTYPE_UPDATE
            }
        }
    } else if (MODE_RESIZE_X2 == drawMode) {
        if (selStatusMap != null) {
            dx = adjustmentWW4Node(selStatusMap, dx)

            var newWw = selStatusMap.ww + dx
            if (newWw < 96) {
                return
            }
            var flowLinkList = formMeta.linkerList
            for (var i = 0; i < flowLinkList.length; i++) {
                var link1 = flowLinkList[i]
                if (link1.startNodeId == selStatusMap.privateMapId) {
                    var ptList = link1.ptList
                    var pt0 = ptList[0]
                    var newSx = selStatusMap.sx + newWw
                    if (Math.abs(pt0.x - selStatusMap.sx - selStatusMap.ww) < 2) {
                        pt0.x = newSx
                    }
                    if (pt0.x > selStatusMap.sx + newWw) {
                        pt0.x = newSx
                    }
                }
                if (link1.endNodeId == selStatusMap.privateMapId) {
                    var ptList = link1.ptList
                    var pt = ptList[ptList.length - 1]
                    var newSx = selStatusMap.sx + newWw
                    if (Math.abs(pt.x - selStatusMap.sx - selStatusMap.ww) < 2) {
                        pt.x = newSx
                    }
                    if (pt.x > newSx) {
                        pt.x = newSx
                    }
                }
            }
            selStatusMap.setWw(newWw)
            if (ACTIONTYPE_NONE == formMeta.actionType) {
                if (!checkNotEmpty(formMeta.id)) {
                    formMeta.actionType = ACTIONTYPE_INSERT
                } else {
                    formMeta.actionType = ACTIONTYPE_UPDATE
                }
            }
        }
    }
    drawChart()
}

/**
 * 鼠标移动事件
 *
 * @param e 事件消息
 */
function onMouseMove (e) {
    if (isViewMode) {
        return
    }

	// 事件触发区域，外部边框
    var rect = e.target.getBoundingClientRect()

	// 换算成事件触发区域内部坐标
    var mex = e.clientX - rect.left
    var mey = e.clientY - rect.top

    if (MODE_MOVE == drawMode || MODE_RESIZE_X1 == drawMode || MODE_RESIZE_X2 == drawMode) {
        if (selStatusMap != null) {
            var x1 = mex - sx
            var y1 = mey - sy

            if ((CONFIRM_STATUS == selStatusMap.statusMapType || WORK_STATUS == selStatusMap.statusMapType) &&
					selStatusMap.sy < y1 && selStatusMap.sy + selStatusMap.hh > y1 && Math.abs(x1 - selStatusMap.sx) <= 4) {
                setCursor('col-resize')
                drawMode = MODE_RESIZE_X1
            } else if ((CONFIRM_STATUS == selStatusMap.statusMapType || WORK_STATUS == selStatusMap.statusMapType) &&
					selStatusMap.sy < y1 && selStatusMap.sy + selStatusMap.hh > y1 && Math.abs(x1 - selStatusMap.sx - selStatusMap.ww) <= 4) {
                setCursor('col-resize')
                drawMode = MODE_RESIZE_X2
            } else {
                setCursor('pointer')
                drawMode = MODE_MOVE
            }
        }
    } else if (MODE_NEW_CONFIRM_STATUS == drawMode || MODE_NEW_WORK_STATUS == drawMode ||
			MODE_NEW_SELECT_NODE == drawMode || MODE_NEW_COMBINE_NODE == drawMode || MODE_NEW_STOP_NODE == drawMode) {
        drawChart()
		// drawNewNode(mex,mey);
    } else if (MODE_NEW_STEP_LINK == drawMode) {
		// findSelStep4Link(mex,mey);
        drawChart()

		// gc.drawImage(imgNewLink, mex - 24, mey);

        if (newLink != null) {
            var size1 = newLink.ptList.length - 1
            if (size1 >= 0) {
                var lp = newLink.ptList[size1]
                gc.strokeStyle = 'rgb(255, 102, 0)'
                gc.beginPath()
                gc.moveTo(sx + lp.x, sy + lp.y)
                gc.lineTo(mex, mey)
                gc.stroke()
                gc.closePath()
            }
        }
    }
}

function adjustmentDy4Node (statusMap1, dy) {
    var statusMapList = formMeta.statusList
    var tmpY = statusMap1.sy + dy
    if (tmpY < 2) {
        return 0
    }
    var statusMap
    for (var i = 0; i < statusMapList.length; i++) {
        statusMap = statusMapList[i]
        if (statusMap == statusMap1) {
            continue
        }

        if (adjustmentGap > Math.abs(statusMap.sy - tmpY)) {
            dy = statusMap.sy - statusMap1.sy
            return dy
        }
    }
    return dy
}

function adjustmentDx4Node (statusMap1, dx) {
    var statusMapList = formMeta.statusList
    var tmpX = statusMap1.sx + dx

    if (tmpX < 2) {
        return 0
    }
    var statusMap
    for (var i = 0; i < statusMapList.length; i++) {
        statusMap = statusMapList[i]
        if (statusMap == statusMap1) {
            continue
        }

        if (adjustmentGap > Math.abs(statusMap.sx - tmpX)) {
            dx = statusMap.sx - statusMap1.sx
            return dx
        }
    }

    return dx
}

function adjustmentDy4Transfer (statusTransfer, selPt, y) {
    var ptList = statusTransfer.ptList
    var idx = ptList.indexOf(selPt)
    if (idx == 0) {
        var statusMap
        for (var i = 0; i < formMeta.statusList.length; i++) {
            statusMap = formMeta.statusList[i]

            if (statusMap.privateMapId == statusTransfer.startNodeId) {
                var middleY = statusMap.sy + (statusMap.hh / 2)
                if (adjustmentGap > Math.abs(middleY - y)) {
                    return middleY
                }
                var mY2 = middleY / 2
                if (adjustmentGap > Math.abs(middleY + mY2 - y)) {
                    return middleY + mY2
                }
                if (adjustmentGap > Math.abs(middleY - mY2 - y)) {
                    return middleY - mY2
                }
                break
            }
        }
    } else if ((ptList.length - 1) == idx) {
        var statusMap
        for (var i = 0; i < formMeta.statusList.length; i++) {
            statusMap = formMeta.statusList[i]

            if (statusMap.privateMapId == statusTransfer.endNodeId) {
                var middleY = statusMap.sy + (statusMap.hh / 2)
                if (adjustmentGap > Math.abs(middleY - y)) {
                    return middleY
                }
                var mY2 = middleY / 2
                if (adjustmentGap > Math.abs(middleY + mY2 - y)) {
                    return middleY + mY2
                }
                if (adjustmentGap > Math.abs(middleY - mY2 - y)) {
                    return middleY - mY2
                }
                break
            }
        }
    }
    var lp
    for (var i = 0; i < ptList.length; i++) {
        lp = ptList[i]
        if (lp == selPt) {
            continue
        }

        if (adjustmentGap > Math.abs(lp.y - y)) {
            return lp.y
        }
    }
    return y
}

function adjustmentDx4Transfer (statusTransfer, selPt, x) {
    var ptList = statusTransfer.ptList
    var idx = ptList.indexOf(selPt)
    if (idx == 0) {
        var statusMap
        for (var i = 0; i < formMeta.statusList.length; i++) {
            statusMap = formMeta.statusList[i]
            if (statusMap.privateMapId == statusTransfer.startNodeId) {
                var middleX = statusMap.sx + (statusMap.ww / 2)
                if (adjustmentGap > Math.abs(middleX - x)) {
                    return middleX
                }
                var mX2 = middleX / 2
                if (adjustmentGap > Math.abs(middleX + mX2 - x)) {
                    return middleX + mX2
                }
                if (adjustmentGap > Math.abs(middleX - mX2 - x)) {
                    return middleX - mX2
                }
                break
            }
        }
    } else if ((ptList.length - 1) == idx) {
        var statusMap
        for (var i = 0; i < formMeta.statusList.length; i++) {
            statusMap = formMeta.statusList[i]
            if (statusMap.privateMapId == statusTransfer.endNodeId) {
                var middleX = statusMap.sx + (statusMap.ww / 2)
                if (adjustmentGap > Math.abs(middleX - x)) {
                    return middleX
                }
                var mX2 = middleX / 2
                if (adjustmentGap > Math.abs(middleX + mX2 - x)) {
                    return middleX + mX2
                }
                if (adjustmentGap > Math.abs(middleX - mX2 - x)) {
                    return middleX - mX2
                }
                break
            }
        }
    }

    var lp
    for (var i = 0; i < ptList.length; i++) {
        lp = ptList[i]
        if (lp == selPt) {
            continue
        }

        if (adjustmentGap > Math.abs(lp.x - x)) {
            return lp.x
        }
    }

    return x
}

function resetStatusLoc (dx, dy) {
    if (selStatusMap == null) {
        return
    }
    selStatusMap.sx = selStatusMap.sx + dx
    selStatusMap.sy = selStatusMap.sy + dy
    var transferList = formMeta.linkerList
    var transfer
    for (var i = 0; i < transferList.length; i++) {
        transfer = transferList[i]
        var ptList = transfer.ptList
        if (transfer.startNodeId == selStatusMap.privateMapId) {
            var pt0 = ptList[0]
            pt0.x += dx
            pt0.y += dy
        }
        if (transfer.endNodeId == selStatusMap.privateMapId) {
            var pt = ptList[ptList.length - 1]
            pt.x += dx
            pt.y += dy
        }
    }
    if (ACTIONTYPE_NONE == formMeta.actionType) {
        if (!checkNotEmpty(formMeta.id)) {
            formMeta.actionType = ACTIONTYPE_INSERT
        } else {
            formMeta.actionType = ACTIONTYPE_UPDATE
        }
    }
}

function setNewPointInJoinPt (x, y) {
    if (selPt == null || selPt.joinNodeId <= 0) {
        return
    }
    var lp = selPt
    var step = null

    var x1 = x - sx
    var y1 = y - sy

    x1 = adjustmentDx4Transfer(selStatusTransfer, selPt, x1)
    y1 = adjustmentDy4Transfer(selStatusTransfer, selPt, y1)

    var nodeList = formMeta.statusList
    for (var i = 0; i < nodeList.length; i++) {
        if (selPt.joinNodeId == nodeList[i].privateMapId) {
            step = nodeList[i]
            break
        }
    }
    if (step == null) {
        return
    }
    var maxx = step.sx + step.ww
    var maxy = step.sy + step.hh
    if (x1 < step.sx) {
        x1 = step.sx
    }
    if (x1 > maxx) {
        x1 = maxx
    }
    if (y1 < step.sy) {
        y1 = step.sy
    }
    if (y1 > maxy) {
        y1 = maxy
    }

    var dx1 = Math.abs(x1 - step.sx)
    var dx2 = Math.abs(maxx - x1)
    var dy1 = Math.abs(y1 - step.sy)
    var dy2 = Math.abs(maxy - y1)

    var mindd = dx1
    if (dx2 < dx1) {
        mindd = dx2
    }
    if (dy1 < mindd) {
        mindd = dy1
    }
    if (dy2 < mindd) {
        mindd = dy2
    }

    if (mindd == dx1) {
        lp.x = step.sx
        lp.y = y1
    } else if (mindd == dx2) {
        lp.x = maxx
        lp.y = y1
    } else if (mindd == dy1) {
        lp.x = x1
        lp.y = step.sy
    } else {
        lp.x = x1
        lp.y = maxy
    }
}

function findSelStep (x, y) {
    selStatusMap = null
    var flowNodeList = formMeta.statusList
    if (flowNodeList == null) {
        return
    }
    var flowNode
    for (var i = 0; i < flowNodeList.length; i++) {
        flowNode = flowNodeList[i]
        if (x > (sx + flowNode.sx) && x < (sx + flowNode.sx + flowNode.ww) &&
				y > (sy + flowNode.sy) && y < (sy + flowNode.sy + flowNode.hh)) {
            selStatusMap = flowNode
            break
        }
    }
}

function setCursor (str) {
    canvas.style.cursor = str
}

function onClick (e) {
}

function saveAction () {
    var statusMapList = formMeta.statusList
    var transferList = formMeta.linkerList
    var maxx = 0
    var maxy = 0
    var tt = 0

    var statusMap
    for (var i = 0; i < statusMapList.length; i++) {
        statusMap = statusMapList[i]
        tt = statusMap.sx + statusMap.ww
        if (maxx < tt) {
            maxx = tt
        }
        tt = statusMap.sy + statusMap.hh
        if (maxy < tt) {
            maxy = tt
        }
    }
    var transfer
    for (var i = 0; i < transferList.length; i++) {
        transfer = transferList[i]
        tt = transfer.sx + transfer.ww
        if (maxx < tt) {
            maxx = tt
        }
        tt = transfer.sy + transfer.hh
        if (maxy < tt) {
            maxy = tt
        }
        var lp
        var ptlist = transfer.ptList
        for (var j = 0; j < ptList.length; j++) {
            lp = ptlist[j]
            if (maxx < lp.x) {
                maxx = lp.x
            }
            if (maxy < lp.y) {
                maxy = lp.y
            }
        }
    }

    var newWw = maxx + 16
    var newHh = maxy + 24
    if (newWw < 600) {
        newWw = 600
    }
    if (newHh < 2000) {
        newHh = 2000
    }

    if (formMeta.swimlaneList.length > 0) {
        var ww = 0
        var swimlane
        for (var i = 0; i < formMeta.swimlaneList.length; i++) {
            swimlane = formMeta.swimlaneList[i]
            ww += swimlane.ww
        }
        newWw = ww
    }

    var statusMap
    for (var i = 0; i < formMeta.statusList.length; i++) {
        resetStatusMap(statusMap)
    }

    formMeta.ww = newWw
    formMeta.hh = newHh

	// FormMetaInfoFactory fact = new FormMetaInfoFactory();
    if (ACTIONTYPE_INSERT == formMeta.actionType) {
		// 插入操作 以后用Ajax方法实现
		// fact.insert(formMeta);
    } else if (ACTIONTYPE_UPDATE == formMeta.actionType) {
		// 更新操作以后用Ajax方法实现
		// fact.update(formMeta);
    }
    formMeta.actionType = ACTIONTYPE_NONE
    drawChart()
}

// 开始画图
function drawChart () {
    $('#formMetaNm h4').text(formMeta.name)

    gc.clearRect(0, 0, ww, hh)
    var updFlg = 0

    gc.textAlign = 'left'
    gc.textBaseline = 'middle'

    if (formMeta == null) {
        gc.fillStyle = 'rgb(236, 236, 236)'
        gc.roundRect(sx, sy, ww - 24, hh - 24, {ul: 8, ur: 8, ll: 8, lr: 8}, true, false)
        return
    }

    if (ACTIONTYPE_INSERT == formMeta.actionType || ACTIONTYPE_UPDATE == formMeta.actionType) {
        updFlg = 1
        gc.fillStyle = 'rgb(255, 255, 204)'
    } else {
        gc.fillStyle = 'rgb(245, 245, 245)'
    }
    gc.roundRect(sx, sy, ww, hh, {ul: 8, ur: 8, ll: 8, lr: 8}, true, false)

    var swimlaneList = formMeta.swimlaneList
    var tmpX = sx
    if (swimlaneList != null && swimlaneList.length > 0) {
        gc.strokeStyle = GRAY_LINE_COLOR
        gc.lineWidth = 1

        gc.beginPath()
        gc.moveTo(tmpX, 0)
        gc.lineTo(tmpX, formMeta.hh + sy)
        gc.stroke()
        gc.closePath()

        var swimlane
        for (var idx = 0; idx < swimlaneList.length; idx++) {
            swimlane = swimlaneList[idx]
            tmpX += swimlane.ww

            gc.beginPath()
            gc.moveTo(tmpX, 0)
            gc.lineTo(tmpX, formMeta.hh + sy)
            gc.stroke()
            gc.closePath()
        }
    }

    gc.lineWidth = 2
    var statusList = formMeta.statusList
    var stat
    for (var i = 0; i < statusList.length; i++) {
        stat = statusList[i]
        if (selStatusMap == stat) {
            continue
        }

        if (selStatusMap == null && lastOkStatusMap == stat) {
            continue
        }
        if (contains(formMeta.okStatusList, stat.id)) {
            drawNodeOkStatus(gc, stat)
        } else if (contains(formMeta.doingWorkStatusList, stat.id)) {
            drawDoingNode(gc, stat)
        } else {
            drawNode(gc, stat)
        }
    }

    if (selStatusMap != null) {
        drawSelStatus(gc)
    } else {
        drawLastOkStatus(gc)
    }

    gc.strokeStyle = BLACK_COLOR
    gc.fillStyle = BLACK_COLOR
    gc.lineWidth = 1
    var linkList = formMeta.linkerList
    var flowLink
    for (var i = 0; i < linkList.length; i++) {
        flowLink = linkList[i]
        if (flowLink == selStatusTransfer) {
            continue
        }
        drawTransfer(formMeta, gc, flowLink)
    }

    gc.strokeStyle = RED_COLOR
    gc.fillStyle = RED_COLOR
    if (selStatusTransfer != null) {
        drawSelTransfer(gc)
    }

    if (swimlaneList.length > 0) {
        tmpX = sx

        gc.lineWidth = 1
        var offsetX = 0
        var swimlane

        var image = new Image()
        image.src = 'img/authority_group.png'

        for (var idx = 0; idx < swimlaneList.length; idx++) {
            swimlane = swimlaneList[idx]

            if (selSwimlane == swimlane && swimlaneDragMode == 2) {
                gc.strokeStyle = GRAY_LINE_COLOR
                gc.lineWidth = 1

                gc.beginPath()
                gc.moveTo(tmpX, 0)
                gc.lineTo(tmpX, 32)
                gc.stroke()
                gc.closePath()

                offsetX = swimlaneMoveOffsetX + tmpX
                tmpX += swimlane.ww
                continue
            }

            gc.fillStyle = 'rgb(150, 150, 150)'
            gc.fillRect(tmpX, 0, swimlane.ww, 32)

            gc.beginPath()

            if (idx == 0) {
                gc.strokeStyle = GRAY_LINE_COLOR
            } else {
                gc.strokeStyle = WHITE_COLOR
            }

            gc.lineWidth = 1

            gc.moveTo(tmpX, 0)
            gc.lineTo(tmpX, 32)
            gc.stroke()
            gc.closePath()

            if (selSwimlane == swimlane) {
                gc.lineWidth = 2
                gc.strokeStyle = RED_COLOR
                gc.strokeRect(tmpX, 1, selSwimlane.ww - 1, 32 - 1)
            }

            gc.textAlign = 'center'
            gc.textBaseline = 'middle'
            gc.fillStyle = WHITE_COLOR
            gc.font = FORMFONT
            gc.fillText(swimlane.authorityGroup.groupName, tmpX + swimlane.ww / 2, 16, swimlane.ww - 4)

			// image.onload = function () {
			//	gc.drawImage(image, tmpX + 2, 4, 24, 24);
			// }

            drawSwimlaneIcon(tmpX)

            tmpX += swimlane.ww
        }

        if (selSwimlane != null && swimlaneDragMode == 2) {
            gc.fillStyle = YELLOW_COLOR

            gc.fillRect(offsetX, 6, selSwimlane.ww, 32)

            gc.beginPath()
            gc.strokeStyle = GRAY_LINE_COLOR
            gc.lineWidth = 1

            gc.moveTo(offsetX, 6)
            gc.lineTo(offsetX, 32)
            gc.stroke()
            gc.closePath()

            gc.lineWidth = 2
            gc.strokeStyle = RED_COLOR
            gc.strokeRect(offsetX, 7, selSwimlane.ww - 1, 32 - 1)

            gc.textAlign = 'center'
            gc.textBaseline = 'middle'
            gc.fillStyle = BLACK_COLOR
            gc.font = FORMFONT
            gc.fillText(selSwimlane.authorityGroup.groupName, offsetX + selSwimlane.ww / 2, 22, selSwimlane.ww - 4)
        }
    }

    if (updFlg == 1) {
        var imageTS = new Image()
        imageTS.src = 'img/toolbar-save.png'
        imageTS.onload = function () {
            gc.drawImage(imageTS, 0, 0, 36, 36)
        }
    }
}

function drawSwimlaneIcon (x) {
    var image = new Image()
    image.src = 'img/authority_group.png'

    image.onload = function () {
        gc.drawImage(image, x + 2, 4, 24, 24)
    }
}

function drawNode (gc, formStatus) {
    gc.fillStyle = WHITE_COLOR

    if (formStatus.statusMapType == 0) {
        gc.strokeStyle = DARKORANGE_COLOR
    } else if (formStatus.statusMapType == 1) {
        gc.strokeStyle = DARKGREEN_COLOR
    } else {
        gc.strokeStyle = GRAY_FILL_COLOR_2
        gc.fillStyle = GRAY_FILL_COLOR_2
    }

    gc.lineWidth = 2
    gc.roundRect(sx + formStatus.sx, sy + formStatus.sy, formStatus.ww, formStatus.hh, {ul: 4, ur: 4, ll: 4, lr: 4}, true, true)

    gc.fillStyle = BLACK_COLOR
    drawNodeContent(gc, formStatus)
}

/**
 * 查找被选中的对象
 *
 * @param x x坐标
 * @param y y坐标
 */
function findSelObj (x, y) {
    selStatusMap = null
    selStatusTransfer = null
    selPt = null
    isSelLinkName = false
    joinNode = null
    selSwimlane = null

    if (formMeta == null) {
        return
    }

    if (formMeta.swimlaneList.length > 0 && SWIMLANE_HH > y) {
        var x1 = sx
        var swimlane
        for (var i = 0; i < formMeta.swimlaneList.length; i++) {
            swimlane = formMeta.swimlaneList[i]
            if (x1 + swimlane.ww > x) {
                selSwimlane = swimlane
                break
            }
            x1 += swimlane.ww
        }
        return
    }

    var flowLinkList = formMeta.linkerList
    var flowNodeList = formMeta.statusList

    var pt1 = null
    var pt2 = null
    var x1 = 0
    var y1 = 0
    var x2 = 0
    var y2 = 0
    var ptMaxIdx = 0
    var stepLink
    for (var i = 0; i < flowLinkList.length; i++) {
        stepLink = flowLinkList[i]
        if (x >= stepLink.sx + sx && x <= stepLink.sx + stepLink.ww + sx &&
				y >= stepLink.sy + sy && y <= stepLink.sy + 24 + sy) {
            selStatusTransfer = stepLink
            isSelLinkName = true
            return
        }

        var ptList = stepLink.ptList
        ptMaxIdx = ptList.length - 1
        var pt1
        for (var j = 0; j <= ptMaxIdx; j++) {
            pt1 = ptList[j]
            if (Math.abs(pt1.x - x + sx) <= 8 && Math.abs(pt1.y - y + sy) <= 8) {
                selPt = pt1
                if (pt1.joinNodeId > 0) {
                    var stepRect
                    for (var k = 0; k < flowNodeList.length; j++) {
                        stepRect = flowNodeList[k]
                        if (stepRect.privateMapId == pt1.joinNodeId) {
                            joinNode = stepRect
                            break
                        }
                    }
                }
                selStatusTransfer = stepLink
                return
            }
        }
        if (ptMaxIdx >= 1) {
            for (var j = 0; j < ptMaxIdx; j++) {
                pt1 = ptList[j]
                pt2 = ptList[j + 1]

                if (pt2.x > pt1.x) {
                    x1 = pt1.x
                    x2 = pt2.x
                } else {
                    x1 = pt2.x
                    x2 = pt1.x
                }
                if (pt2.y > pt1.y) {
                    y1 = pt1.y
                    y2 = pt2.y
                } else {
                    y1 = pt2.y
                    y2 = pt1.y
                }

                if (x2 - x1 < 16) {
                    x1 -= 8
                    x2 += 8
                }
                if (y2 - y1 < 16) {
                    y1 -= 8
                    y2 += 8
                }

                x1 += sx
                x2 += sx
                y1 += sy
                y2 += sy
                if (x > x1 && x < x2 && y > y1 && y < y2) {
                    var dxx1 = x - pt1.x - sx
                    var dyy1 = y - pt1.y - sy

                    var dxx2 = pt2.x + sx - x
                    var dyy2 = pt2.y + sy - y

                    var dxx = pt2.x - pt1.x
                    var dyy = pt2.y - pt1.y

                    if ((Math.abs(dxx1) < 4 && Math.abs(dyy1) < 4) ||
							(Math.abs(dxx2) < 4 && Math.abs(dyy2) < 4) ||
							Math.abs(dxx) < 4 || Math.abs(dyy) < 4) {
                        selStatusTransfer = stepLink
                        return
                    }

                    var tanyxgap = dxx1 * dyy / dxx - dyy1
                    if (Math.abs(tanyxgap) <= 16) {
                        selStatusTransfer = stepLink
                        return
                    }
                }
            }
        }
    }

    if (selStatusTransfer != null) {
        return
    }
    findSelStep(x, y)
}

function drawNodeOkStatus (gc, formStatus) {
    gc.fillStyle = GRAY_FILL_COLOR
    gc.roundRect(sx + formStatus.sx, sy + formStatus.sy, formStatus.ww, formStatus.hh, {ul: 4, ur: 4, ll: 4, lr: 4}, true, false)

    if (formStatus.statusMapType == 0) {
        gc.strokeStyle = DARKORANGE_COLOR
    } else if (formStatus.statusMapType == 1) {
        gc.strokeStyle = DARKGREEN_COLOR
    } else if (formStatus.statusMapType == 3) {
        gc.strokeStyle = GRAY_FILL_COLOR_2
    } else if (formStatus.statusMapType == 2) {
        gc.strokeStyle = GRAY_FILL_COLOR_2
    } else {
        gc.strokeStyle = GRAY_FILL_COLOR_3
    }

    gc.lineWidth = 2
    gc.roundRect(sx + formStatus.sx, sy + formStatus.sy, formStatus.ww, formStatus.hh, {ul: 4, ur: 4, ll: 4, lr: 4}, false, true)
    gc.fillStyle = BLACK_COLOR

    drawNodeContent(gc, formStatus)
}

function drawNodeContent (gc, formStatus) {
    var imageNC = new Image()
    var imageNC2 = new Image()
    var imageIcon = new Image()

    if (formStatus.formHandleStatus != null) {
        if (formStatus.statusMapType == 0) {
            gc.font = FORMFONT
            gc.fillText(formStatus.formHandleStatus.statusName, sx + formStatus.sx + ICON_WW_1 + 8, sy + formStatus.sy + formStatus.hh / 2)

            if (checkNotEmpty(formStatus.formHandleStatus.iconName)) {
                imageIcon.src = formStatus.formHandleStatus.iconName
                imageIcon.onload = function () {
                    gc.drawImage(imageIcon, sx + formStatus.sx + 4, sy + formStatus.sy + 4, ICON_WW_1, ICON_WW_1)
                }
            } else {
                imageNC.src = 'img/status_default.png'
                imageNC.onload = function () {
                    gc.drawImage(imageNC, sx + formStatus.sx + 4, sy + formStatus.sy + 4, ICON_WW_1, ICON_WW_1)
                }
            }

            if (formStatus.statusType == INIT) {
                imageNC2.src = 'img/form_status_start.png'
                imageNC2.onload = function () {
                    gc.drawImage(imageNC2, sx + formStatus.sx + (ICON_WW_1 / 2) + 4, sy + formStatus.sy + formStatus.hh - 24, ICON_WW_1 / 2, ICON_WW_1 / 2)
                }
            }
        } else {
            gc.font = FORMFONT
            gc.fillText(formStatus.formHandleStatus.statusName, sx + formStatus.sx + ICON_WW_2 + 8, sy + formStatus.sy + formStatus.hh / 4)

            if (checkNotEmpty(formStatus.formHandleStatus.iconName)) {
                imageIcon.src = formStatus.formHandleStatus.iconName
                imageIcon.onload = function () {
                    gc.drawImage(imageIcon, sx + formStatus.sx + 4, sy + formStatus.sy + 4, ICON_WW_2, ICON_WW_2)
                }
            } else {
                imageNC.src = 'img/status_default.png'
                imageNC.onload = function () {
                    gc.drawImage(imageNC, sx + formStatus.sx + 4, sy + formStatus.sy + 4, ICON_WW_2, ICON_WW_2)
                }
            }

            gc.beginPath()
            gc.strokeStyle = 'darkgray'
            var lineX = sx + formStatus.sx + 14
            gc.lineWidth = 1

            gc.moveTo(lineX, sy + formStatus.sy + formStatus.hh / 2)
            gc.lineTo(lineX + formStatus.ww - ICON_WW_2, sy + formStatus.sy + (formStatus.hh / 2))
            gc.stroke()
            gc.closePath()

            if (formStatus.wsNewFormMeta != null) {
                if (checkNotEmpty(formStatus.wsNewFormMeta.iconName)) {
                    imageNC2.src = formStatus.wsNewFormMeta.iconName
                    imageNC2.onload = function () {
                        gc.drawImage(imageNC2, sx + formStatus.sx + 4, sy + formStatus.sy + 4 + formStatus.hh / 2, ICON_WW_2, ICON_WW_2)
                    }
                }
                gc.font = FORMFONT
                gc.fillText(formStatus.wsNewFormMeta.name, sx + formStatus.sx + ICON_WW_2 + 8, sy + formStatus.sy + formStatus.hh * 3 / 4)
            }
        }
    } else {
        if (formStatus.statusMapType == 2) {
            imageNC.src = 'img/tool_select_node.png'
            if (formStatus.selectNodeType == 0) {
                imageNC.src = 'img/tool_select_node_all.png'
            } else if (formStatus.selectNodeType == 1) {
                imageNC.src = 'img/tool_select_node_express.png'
            }
            imageNC.onload = function () {
                gc.drawImage(imageNC, sx + formStatus.sx + 4, sy + formStatus.sy + 4, ICON_WW_1, ICON_WW_1)
            }
        } else if (formStatus.statusMapType == 3) {
            if (formStatus.combineNodeType == 1) {
                imageNC.src = 'img/tool_combine_node_and.png'
            } else if (formStatus.combineNodeType == 0) {
                imageNC.src = 'img/tool_combine_node_or.png'
            } else if (formStatus.combineNodeType == 2) {
                imageNC.src = 'img/tool_combine_node_express.png'
            } else {
                imageNC.src = 'img/tool_combine_node.png'
            }
            imageNC.onload = function () {
                gc.drawImage(imageNC, sx + formStatus.sx + 4, sy + formStatus.sy + 4, ICON_WW_1, ICON_WW_1)
            }
        } else if (formStatus.statusMapType == 4) {
            if (formStatus.stopNodeType == 0) {
                imageNC.src = 'img/tool_stop_normal.png'
            } else if (formStatus.stopNodeType == 1) {
                imageNC.src = 'img/tool_stop_cansel.png'
            } else if (formStatus.stopNodeType == 2) {
                imageNC.src = 'img/tool_stop_abnormal.png'
            } else {
                imageNC.src = 'img/tool_status_stop.png'
            }
            imageNC.onload = function () {
                gc.drawImage(imageNC, sx + formStatus.sx + 4, sy + formStatus.sy + 4, ICON_WW_1, ICON_WW_1)
            }
        }
    }
}

function drawDoingNode (gc, formStatus) {
    gc.fillStyle = YELLOW_COLOR
    gc.roundRect(sx + formStatus.sx, sy + formStatus.sy, formStatus.ww, formStatus.hh, {ul: 4, ur: 4, ll: 4, lr: 4}, true, false)
    if (formStatus.statusMapType == 0) {
        gc.strokeStyle = DARKORANGE_COLOR
    } else if (formStatus.statusMapType == 1) {
        gc.strokeStyle = DARKGREEN_COLOR
    } else if (formStatus.statusMapType == 3) {
        gc.strokeStyle = GRAY_FILL_COLOR_2
    } else if (formStatus.statusMapType == 2) {
        gc.strokeStyle = GRAY_FILL_COLOR_2
    } else {
        gc.strokeStyle = GRAY_FILL_COLOR_3
    }

    gc.lineWidth = 2
    gc.roundRect(sx + formStatus.sx, sy + formStatus.sy, formStatus.ww, formStatus.hh, {ul: 4, ur: 4, ll: 4, lr: 4}, false, true)
    gc.fillStyle = BLACK_COLOR

    drawNodeContent(gc, formStatus)
}

function drawSelStatus (gc) {
    if (selStatusMap == null) {
        return
    }
    var formStatus = selStatusMap
    gc.fillStyle = YELLOW_COLOR
    gc.strokeStyle = RED_COLOR
    gc.roundRect(sx + formStatus.sx, sy + formStatus.sy, formStatus.ww, formStatus.hh, {ul: 4, ur: 4, ll: 4, lr: 4}, true, true)
    gc.fillStyle = RED_COLOR

    drawNodeContent(gc, formStatus)

	// gc.drawImage(iconPool.getIcon("hand.png"), sx + formStatus.sx - 30, sy + formStatus.sy, 24, 24);
}

function drawLastOkStatus (gc) {
    if (lastOkStatusMap == null) {
        return
    }
    var formStatus = lastOkStatusMap
    gc.fillStyle = GRAY_FILL_COLOR
    gc.strokeStyle = RED_COLOR
    gc.roundRect(sx + formStatus.sx, sy + formStatus.sy, formStatus.ww, formStatus.hh, {ul: 4, ur: 4, ll: 4, lr: 4}, true, true)
    gc.fillStyle = RED_COLOR

    drawNodeContent(gc, formStatus)
}

function drawTransfer (formMeta, gc, statusTransfer) {
    if (contains(formMeta.execTransferList, statusTransfer.id)) {
        gc.strokeStyle = DARKORANGE_COLOR
    } else if (selStatusTransfer == statusTransfer) {
        gc.strokeStyle = RED_COLOR
    } else {
        gc.strokeStyle = BLACK_COLOR
    }

    var ptList = statusTransfer.ptList
    var ptSize = ptList.length - 1
    var pt1
    var pt2
    for (var i = 0; i < ptSize; i++) {
        pt1 = ptList[i]
        pt2 = ptList[i + 1]

        gc.beginPath()
        gc.moveTo(sx + pt1.x, sy + pt1.y)
        gc.lineTo(sx + pt2.x, sy + pt2.y)
        gc.stroke()
        gc.closePath()
    }

    if (ptList.length <= 0) {
        return
    }

    var lp0 = ptList[0]
    gc.fillArc(sx + lp0.x, sy + lp0.y, 2)

    var sn = ptList.length
    if (sn >= 2) {
        pt1 = ptList[sn - 2]
        pt2 = ptList[sn - 1]

        var dx = pt2.x - pt1.x
        var dy = pt2.y - pt1.y

        var ax = pt2.x
        var ay = pt2.y
        var bx = pt2.x
        var by = pt2.y

        var px = pt2.x
        var py = pt2.y

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                px -= 16
            } else {
                px += 16
            }

            py = dy / dx * (px - pt1.x) + pt1.y

            ax = px
            ay = py - 5

            bx = px
            by = py + 5
        } else {
            if (dy > 0) {
                py -= 16
            } else {
                py += 16
            }

            px = dx / dy * (py - pt1.y) + pt1.x

            ay = py
            ax = px - 5

            by = py
            bx = px + 5
        }

        gc.beginPath()

        gc.moveTo(sx + ax, sy + ay)
        gc.lineTo(sx + pt2.x, sy + pt2.y)
        gc.moveTo(sx + bx, sy + by)
        gc.lineTo(sx + pt2.x, sy + pt2.y)

        gc.stroke()
        gc.closePath()
    }

    var name = getTransferName(statusTransfer)
    gc.font = FORMFONT
    gc.fillText(name, sx + statusTransfer.sx + 1, sy + statusTransfer.sy + statusTransfer.hh / 2)
}

function showAuthorityGroupMember (e) {
	// 事件触发区域，外部边框
    var rect = e.target.getBoundingClientRect()

	// 换算成事件触发区域内部坐标
    var x = e.clientX - rect.left
    var y = e.clientY - rect.top

    var locX = 0
    var authorityGroup = null
    if (formMeta.swimlaneList.length > 0 && swimlaneDragMode == 0 && SWIMLANE_HH > y) {
        var x1 = sx
        var swimlane
        for (var i = 0; i < formMeta.swimlaneList.length; i++) {
            swimlane = formMeta.swimlaneList[i]
            if (x1 + swimlane.ww() > x) {
                if ((x - x1) < 36) {
                    authorityGroup = swimlane.authorityGroup
                    locX = x1
                }
                break
            }
            x1 += swimlane.ww
        }
    }

    if (authorityGroup == null) {
        isShowAGMember = false
		// if (null != pagmv) {
		//	this.getChildren().remove(pagmv);
		// }
        return
	 } else {
        if (pagmv != null) {
			// if (pagmv.getAuthorityGroup() == authorityGroup &&
			//		this.getChildren().contains(pagmv)){
			//	this.getChildren().remove(pagmv);
			//	isShowAGMember = false;
			//	return;
			// }
        }
    }

    if (pagmv == null) {
		// pagmv = new PomaAuthorityGroupMemberView();
		// pagmv.init1(fPage, 200);
		// pagmv.setCloseCallback(new Callback<Boolean, Boolean>(){

		//	@Override
		//	public Boolean call(Boolean param) {
		//		getChildren().remove(pagmv);
		//		return true;
		//	}

		// });
    }
	// pagmv.setAuthorityGroup(authorityGroup);

	// var ww1 = pagmv.width;
	// if (ww1 + locX + 2 > ww) {
	//	locX = ww - ww1 - 2;
	// }

	// pagmv.setTranslateX(locX + 2);
	// pagmv.setTranslateY(SWIMLANE_HH + 2);
	// if(!getChildren().contains(pagmv)){
	//	this.getChildren().add(pagmv);
	// }
	// pagmv.toFront();
    isShowAGMember = true
}

/**
 * 绘制被选中的链接线
 *
 * @param gc 绘制上下文
 */
function drawSelTransfer (gc) {
    if (selStatusTransfer == null) {
        return
    }
    gc.lineWidth = 2
    drawTransfer(formMeta, gc, selStatusTransfer)
    var ptList = selStatusTransfer.ptList
    var lp0 = ptList[0]
    gc.fillArc(sx + lp0.x, sy + lp0.y, 5)
    var lp
    for (var i = 1; i < ptList.length; i++) {
        lp = ptList[i]
        gc.fillRect(sx + lp.x - 4, sy + lp.y - 4, 8, 8)
    }
    if (selPt != null) {
        gc.roundRect(sx + selPt.x - 8, sy + selPt.y - 8, 16, 16, {ul: 4, ur: 4, ll: 4, lr: 4}, false, true)
    }
    if (isSelLinkName) {
        gc.roundRect(sx + selStatusTransfer.sx - 1, sy + selStatusTransfer.sy - 1, selStatusTransfer.ww + 2, 26, {ul: 4, ur: 4, ll: 4, lr: 4}, false, true)
    }
}

/**
 * 获取链接线名称
 *
 * @param statusTransfer 链接线
 * @return 链接线名称
 */
function getTransferName (statusTransfer) {
    var name = statusTransfer.transferName
    if (statusTransfer.type == 1 || statusTransfer.type == 2) {
        if (statusTransfer.workStatusType == 0) {
            name = '[待办 ]' + name
        } else {
            name = '[未办]' + name
        }
    }

    if (statusTransfer.type == 2) {
	//	name = "[" + FormTransferType.getName(statusTransfer.getTransferType()) +"]" + name;
    }
    return name
}

/**
 * ID是否包含在List中
 *
 * @param list 列表
 * @param id 查找的ID
 * @return true 包含、false 不包含
 */
function contains (list, id) {
    if (list == null || list.length == 0) {
        return false
    }

    for (var i = 0; i < list.length; i++) {
        if (id == list[i]) {
            return true
        }
    }
    return false
}
function GetParam (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2]); return null
}
