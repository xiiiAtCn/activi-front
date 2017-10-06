<template lang="html">
  <div class="" style="padding:20px;width: 100%;">
    <div id="mapContent" class="" style="width: 100%;height:700px;border: 1px solid #ddd;">
    </div>
  </div>
</template>

<script>
/* eslint-disable */

//创建和初始化地图函数：
        function initMap() {
            createMap(); //创建地图
            setMapEvent(); //设置地图事件
            addMapControl(); //向地图添加控件
            addMarker(); //向地图中添加marker
            addPolyline(); //向地图中添加线
        }

        //创建地图函数：
        function createMap() {
            var map = new BMap.Map("mapContent"); //在百度地图容器中创建一个地图
            var point = new BMap.Point(118.611594, 24.604503); //定义一个中心点坐标
            map.centerAndZoom(point, 13); //设定地图的中心点和坐标并将地图显示在地图容器中
            window.map = map; //将map变量存储在全局
        }

        //地图事件设置函数：
        function setMapEvent() {
            map.enableDragging(); //启用地图拖拽事件，默认启用(可不写)
            map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
            map.enableDoubleClickZoom(); //启用鼠标双击放大，默认启用(可不写)
            map.enableKeyboard(); //启用键盘上下左右键移动地图
        }

        //地图控件添加函数：
        function addMapControl() {
            //向地图中添加缩放控件
            var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
            map.addControl(ctrl_nav);
            //向地图中添加比例尺控件
            var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
            map.addControl(ctrl_sca);
        }

        //标注点数组
        //设置弹出框的信息（json数据）
        var markerArr = [{
                title: "泵房",
                machine: "正常",
                power: "2.2kw",
                communication: "在线",
                lift: "33.0m",
                flow: "0.9m3/h",
                inDN: "55.0mm",
                outDN: "65.0mm",
                point: "118.586873|24.562969",
                isOpen: 0,
                icon: { w: 23, h: 25, l: 0, t: 21, x: 9, lb: 12 }
            }, {
                title: "泵房",
                machine: "不正常",
                power: "3.7kw",
                communication: "不在线",
                lift: "32.0m",
                flow: "0.7m3/h",
                inDN: "55.0mm",
                outDN: "55.0mm",
                point: "118.58328|24.581109",
                isOpen: 0,
                icon: { w: 23, h: 25, l: 0, t: 21, x: 9, lb: 12 }
            }, {
                title: "泵房",
                machine: "不正常",
                power: "2.8kw",
                communication: "在线",
                lift: "36.0m",
                flow: "0.2m3/h",
                inDN: "65.0mm",
                outDN: "75.0mm",
                point: "118.596215|24.586893",
                isOpen: 0,
                icon: { w: 23, h: 25, l: 0, t: 21, x: 9, lb: 12 }
            }, {
                title: "泵房",
                machine: "正常",
                power: "2.7kw",
                communication: "不在线",
                lift: "37.0m",
                flow: "0.0m3/h",
                inDN: "35.0mm",
                outDN: "65.0mm",
                point: "118.607857|24.591229",
                isOpen: 0,
                icon: { w: 23, h: 25, l: 0, t: 21, x: 9, lb: 12 }
            }, {
                title: "泵房",
                machine: "正常",
                power: "2.2kw",
                communication: "在线",
                lift: "32.0m",
                flow: "0.44m3/h",
                inDN: "75.0mm",
                outDN: "75.0mm",
                point: "118.610157|24.609103",
                isOpen: 0,
                icon: { w: 23, h: 25, l: 0, t: 21, x: 9, lb: 12 }
            }, {
                title: "泵房",
                machine: "正常",
                power: "2.9kw",
                communication: "不在线",
                lift: "38.0m",
                flow: "0.32m3/h",
                inDN: "55.0mm",
                outDN: "35.0mm",
                point: "118.623811|24.628156",
                isOpen: 0,
                icon: { w: 23, h: 25, l: 0, t: 21, x: 9, lb: 12 }
            }, {
                title: "泵房",
                machine: "正常",
                power: "2.5kw",
                communication: "在线",
                lift: "40.0m",
                flow: "0.5m3/h",
                inDN: "45.0mm",
                outDN: "65.0mm",
                point: "118.616912|24.618433",
                isOpen: 0,
                icon: { w: 23, h: 25, l: 0, t: 21, x: 9, lb: 12 }
            }, {
                title: "泵房",
                machine: "不正常",
                power: "3.2kw",
                communication: "在线",
                lift: "20.0m",
                flow: "0.0m3/h",
                inDN: "65.0mm",
                outDN: "25.0mm",
                point: "118.621263|24.631524",
                isOpen: 0,
                icon: { w: 23, h: 25, l: 0, t: 21, x: 9, lb: 12 }
            }, {
                title: "泵房",
                machine: "正常",
                power: "2.2kw",
                communication: "不在线",
                lift: "30.8m",
                flow: "0.6m3/h",
                inDN: "25.0mm",
                outDN: "55.0mm",
                point: "118.63804|24.648257",
                isOpen: 0,
                icon: { w: 23, h: 25, l: 0, t: 21, x: 9, lb: 12 }
            }, {
                title: "泵房",
                machine: "不正常",
                power: "3.2kw",
                communication: "在线",
                lift: "35.2m",
                flow: "0.4m3/h",
                inDN: "65.0mm",
                outDN: "45.0mm",
                point: "118.630135|24.640243",
                isOpen: 0,
                icon: { w: 23, h: 25, l: 0, t: 21, x: 9, lb: 12 }
            }, {
                title: "泵房",
                machine: "正常",
                power: "1.2kw",
                communication: "不在线",
                lift: "38.3m",
                flow: "0.4m3/h",
                inDN: "85.0mm",
                outDN: "65.0mm",
                point: "118.651263|24.661524",
                isOpen: 0,
                icon: { w: 23, h: 25, l: 0, t: 21, x: 9, lb: 12 }
            }

        ];
        //创建marker
        function addMarker() {
            for(var i = 0; i < markerArr.length; i++) {
                var json = markerArr[i];
                var p0 = json.point.split("|")[0];
                var p1 = json.point.split("|")[1];
                var point = new BMap.Point(p0, p1);
                var iconImg = createIcon(json.icon);
                var marker = new BMap.Marker(point, { icon: iconImg });
                var iw = createInfoWindow(i);
                var label = new BMap.Label(json.title, { "offset": new BMap.Size(json.icon.lb - json.icon.x + 10, -20) });
                marker.setLabel(label);
                map.addOverlay(marker);
                //标签名框样式设置
                label.setStyle({
                    border: "none",
                    color: "#333",
                    background: "none",
                    cursor: "pointer"
                });
                //点击事件弹出信息框
                (function() {
                    var index = i;
                    var _iw = createInfoWindow(i);
                    var _marker = marker;
                    _marker.addEventListener("click", function() {
                        this.openInfoWindow(_iw);
                    });
                    _iw.addEventListener("open", function() {
                        _marker.getLabel().hide();
                    })
                    _iw.addEventListener("close", function() {
                        _marker.getLabel().show();
                    })
                    label.addEventListener("click", function() {
                        _marker.openInfoWindow(_iw);
                    })
                    if(!!json.isOpen) {
                        label.hide();
                        _marker.openInfoWindow(_iw);
                    }
                })()
            }
        }
        //创建InfoWindow
        function createInfoWindow(i) {
            var json = markerArr[i];
            //将表格打印到页面
            var iw = new BMap.InfoWindow("<table style='width:230px'>" + "<caption>设备数据</caption>" +
                "<tr><td>泵房名</td><td><a>某小区机组一</a></td></tr>" +
                "<tr><td>类别</td><td>数值</td></tr>" +
                "<tr><td>机组状态</td><td>" + json.machine + "</td></tr>" +
                "<tr><td>水泵功率</td><td>" + json.power + "</td></tr>" +
                "<tr><td>通讯状态</td><td>" + json.communication + "</td></tr>" +
                "<tr><td>扬程</td><td>" + json.lift + "</td></tr>" +
                "<tr><td>流量</td><td>" + json.flow + "</td></tr>" +
                "<tr><td>进口DN</td><td>" + json.inDN + "</td></tr>" +
                "<tr><td>出口DN</td><td>" + json.outDN + "</td></tr>" +
                "</table>");
            return iw;
        }
        //创建一个Icon
        function createIcon(json) {
            //点标记图片路径和图片大小
            var icon = new BMap.Icon("http://map.baidu.com/image/us_mk_icon.png", new BMap.Size(20, 22))
            return icon;
        }
        //标注线数组
        var plPoints = [{ style: "solid", weight: 4, color: "#f00", opacity: 0.6, points: ["118.58716|24.561391", "118.585435|24.565335", "118.583998|24.570068", "118.581986|24.574011", "118.581411|24.577954", "118.581124|24.581372", "118.584573|24.585315", "118.590322|24.585315", "118.596071|24.588469", "118.607857|24.591229", "118.610444|24.609891", "118.623883|24.628024", "118.626398|24.633937", "118.631572|24.642476", "118.633297|24.644578", "118.655719|24.665727"] }];
        //向地图中添加线函数
        function addPolyline() {
            for(var i = 0; i < plPoints.length; i++) {
                var json = plPoints[i];
                var points = [];
                for(var j = 0; j < json.points.length; j++) {
                    var p1 = json.points[j].split("|")[0];
                    var p2 = json.points[j].split("|")[1];
                    points.push(new BMap.Point(p1, p2));
                }
                var line = new BMap.Polyline(points, { strokeStyle: json.style, strokeWeight: json.weight, strokeColor: json.color, strokeOpacity: json.opacity });
                map.addOverlay(line);
            }
        }
export default {
  data:function(){
    return {

    }
  },
  mounted:function(){
    initMap();
  }
}

</script>

<style lang="css">
</style>
