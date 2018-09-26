/*
 * @Author: Dwyanewang
 * @Date:   2018-09-13 17:12:10
 * @Last Modified by:   Dwyanewang
 * @Last Modified time: 2018-09-14 10:57:24
 */
var drawLayer = (function (drawLayer) {
    drawLayer = {
        drawPoint: function () {
            var defaultValues = {
                arr: [{
                    // 器件经度坐标
                    "pos_x": "113.92689",
                    // 器件纬度坐标
                    "pos_y": "30.28773",
                    // 器件编号(二维码编号)
                    "number": 1,
                    // 器件名称
                    "name": "test",
                    // 器件状态
                    "status": 0,
                    //type类型有变电站、开关、变压器、故障指示器、配电房、环网箱、开闭所、杆塔
                    "type": "杆塔",
                    // 器件属性一,开关（联络开关，分段开关、分支开关），变压器（公变、专变），其他为null
                    "attr1": null,
                    // 器件属性二,可选（器件自己的编号）
                    "attr2": null,
                    // 器件属性三,可选（所属线路）
                    "attr3": null
                }]
            };
            var params = arguments[0];
            for (var prop in params) {
                if (!params.hasOwnProperty(prop)) continue;
                defaultValues[prop] = params[prop];
            }
            var featureList = [];
            var coordinates = [];
            for (var i = 0, len = defaultValues.arr.length; i < len; i++) {
                var coordinate = [Number(defaultValues.arr[i].pos_x), Number(defaultValues.arr[i].pos_y)];
                coordinates.push(coordinate);
                var point = new ol.Feature({
                    geometry: new ol.geom.Point(coordinate),
                    number: defaultValues.arr[i].number,
                    name: defaultValues.arr[i].name,
                    type: defaultValues.arr[i].type,
                    status: Number(defaultValues.arr[i].status)
                });
                defaultValues.arr[i].attr1 !== undefined && point.set("attr1", defaultValues.arr[i].attr1);
                defaultValues.arr[i].attr2 !== undefined && point.set("attr2", defaultValues.arr[i].attr2);
                defaultValues.arr[i].attr3 !== undefined && point.set("attr3", defaultValues.arr[i].attr3);
                point.setStyle(drawLayer.style(point, defaultValues.arr[i].status));
                featureList.push(point);
            }
            return {
                A: featureList,
                B: coordinates
            };
        },
        drawLine: function () {
            var defaultValues = {
                coordinates: [
                    [113.8059706, 30.201489],
                    [114.0648070, 30.3719346]
                ],
                // 线路编号
                number: 1,
                // 线路名称
                name: "test",
                // 线路状态
                status: 0,
                //type类型有10kv、35kv、110kv、220kv
                type: "专线",
                // 线路属性一
                attr1: null,
                // 线路属性二
                attr2: null,
                // 线路属性三
                attr3: null
            };
            var params = arguments[0];
            for (var prop in params) {
                if (!params.hasOwnProperty(prop)) continue;
                defaultValues[prop] = params[prop];
            }
            var lineList = [];
            var line = new ol.Feature({
                geometry: new ol.geom.LineString(defaultValues.coordinates),
                number: defaultValues.number,
                name: defaultValues.name,
                type: defaultValues.type,
                status: defaultValues.status
            });
            defaultValues.attr1 !== null && line.set("attr1", defaultValues.attr1);
            defaultValues.attr2 !== null && line.set("attr2", defaultValues.attr2);
            defaultValues.attr3 !== null && line.set("attr3", defaultValues.attr3);
            line.setStyle(drawLayer.style(line, defaultValues.status));
            lineList.push(line);
            return lineList;
        },
        style: function (feature, status) {
            var currentURL = window.location.protocol + "//" + window.location.host;
            if (feature.getGeometry().getType() === "Point") {
                var src = "";
                if (status === 0) {
                    switch (feature.get("type")) {
                        case "配电房":
                            src = currentURL + "/GIS2.0/images/公用配电室.jpg";
                            break;
                        case "环网箱":
                            src = currentURL + "/GIS2.0/images/公用环网柜.jpg";
                            break;
                        case "开闭所":
                            src = currentURL + "/GIS2.0/images/开闭所.png";
                            break;
                        case "故障指示器":
                            src = currentURL + "/GIS2.0/images/故障指示器.png";
                            break;
                        case "变电站":
                            if (feature.get("name").indexOf("35") !== -1) {
                                src = currentURL + "/GIS2.0/images/35bdz.png";
                            } else if (feature.get("name").indexOf("110") !== -1) {
                                src = currentURL + "/GIS2.0/images/110bdz.png";
                            } else {
                                src = currentURL + "/GIS2.0/images/220bdz.png";
                            }
                            break;
                        case "开关":
                            if (feature.get("attr1") === "联络开关") {
                                src = currentURL + "/GIS2.0/images/联络开关开.jpg";
                            } else {
                                src = currentURL + "/GIS2.0/images/分段开关闭.jpg";
                            }
                            break;
                        case "变压器":
                            if (feature.get("attr1") === "公变") {
                                src = currentURL + "/GIS2.0/images/正常公变.png";
                            } else {
                                src = currentURL + "/GIS2.0/images/正常专变.png";
                            }
                            break;
                        case "杆塔":
                            return new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 30,
                                    points: 4,
                                    stroke: new ol.style.Stroke({
                                        color: "#4271AE",
                                        width: 2
                                    })
                                })
                            });
                    }
                } else if (status === 1) {
                    switch (feature.get("type")) {
                        // case "故障指示器":
                        //     src = "故障指示器的src";
                        //     break;
                        case "开关":
                            if (feature.get("attr1") === "联络开关") {
                                src = currentURL + "/GIS2.0/images/联络开关闭.png";
                            } else {
                                src = currentURL + "/GIS2.0/images/分段开关开.jpg";
                            }
                            break;
                        case "变压器":
                            if (feature.get("attr1") === "公变") {
                                src = currentURL + "/GIS2.0/images/故障公变.png";
                            } else {
                                src = currentURL + "/GIS2.0/images/故障专变.png";
                            }
                            break;
                    }
                }
                return new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 15],
                        anchorOrigin: 'top-right',
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        offsetOrigin: 'top-right',
                        // offset:[0,10],
                        //图标缩放比例
                        scale: 0.3,
                        //透明度
                        opacity: 1,
                        //图标的url
                        src: src,
                        img: undefined,
                        imgSize: undefined
                    })
                });
            } else if (feature.getGeometry().getType() === "LineString") {
                switch (status) {
                    case 0:
                        switch (feature.get("type")) {
                            case "10kv":
                                return new ol.style.Style({
                                    stroke: new ol.style.Stroke({
                                        color: '#3ca945',
                                        width: 2
                                    }),
                                    text: new ol.style.Text({
                                        //位置
                                        textAlign: 'center',
                                        //基准线
                                        textBaseline: 'middle',
                                        //文字样式
                                        font: 'normal 14px 微软雅黑',
                                        //文本内容
                                        text: feature.get("name"),
                                        //文本填充样式（即文字颜色）
                                        fill: new ol.style.Fill({color: '#aa3300'}),
                                        stroke: new ol.style.Stroke({color: '#ffcc33', width: 2})
                                    })
                                });
                            case "35kv":
                                return new ol.style.Style({
                                    stroke: new ol.style.Stroke({
                                        color: '#0000CD',
                                        width: 2
                                    })
                                });
                            case "110kv":
                                return new ol.style.Style({
                                    stroke: new ol.style.Stroke({
                                        color: '#EE7600',
                                        width: 2
                                    })
                                });
                            case "220kv":
                                return new ol.style.Style({
                                    stroke: new ol.style.Stroke({
                                        color: '#4A4A4A',
                                        width: 2
                                    })
                                });
                            case "专线":
                                return new ol.style.Style({
                                    stroke: new ol.style.Stroke({
                                        color: '#3ca945',
                                        width: 2
                                    })
                                });
                        }
                        break;
                    case 1:
                        if (feature.get("type") === "10kv" || feature.get("type") === "专线") {
                            return new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: '#d81e06',
                                    width: 2
                                })
                            });
                        }
                        break;
                    case 2:
                        if (feature.get("type") === "10kv" || feature.get("type") === "专线") {
                            return new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: '#d81e06',
                                    width: 2
                                })
                            });
                        }
                        break;
                    case 3:
                        if (feature.get("type") === "10kv" || feature.get("type") === "专线") {
                            return new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: '#3ca945',
                                    width: 2
                                })
                            });
                        }
                        break;
                }
            }
        }
    };
    return drawLayer;
})(window.drawLayer || {});