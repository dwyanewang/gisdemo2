/**
 * FileName: searchAndSelect.js
 * Author: Dwyanewang
 * CreateTime: 2018/9/14 15:00
 */
var searchAndSelect = (function (searchAndSelect) {
    searchAndSelect = {
        switchFlag: 0,
        /**
         * 拉框查询，按下“ctrl+左键”触发
         * @param map 地图容器
         * @param source 矢量图层源
         */
        dragBox: function (map, source) {
            var select = new ol.interaction.Select();
            map.addInteraction(select);
            var selectedFeatures = select.getFeatures();
            var dragBox = new ol.interaction.DragBox({
                condition: ol.events.condition.platformModifierKeyOnly
            });
            map.addInteraction(dragBox);
            dragBox.on('boxstart', function () {
                selectedFeatures.clear();
            });
            dragBox.on('boxend', function () {
                var info = [];
                var extent = dragBox.getGeometry().getExtent();
                source.forEachFeatureIntersectingExtent(extent, function (feature) {
                    selectedFeatures.push(feature);
                    info.push(feature.get('name'));
                });
                if (info.length > 0) {
                    console.log(info);
                    return info;
                }
            });
            map.on('click', function () {
                selectedFeatures.clear();
            });
        },
        // 暂未写好
        iconSelect: function (map) {
            function createStyle(src, img) {
                return new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 15],
                        src: src,
                        img: img,
                        imgSize: img ? [img.width, img.height] : undefined
                    })
                });
            }

            var selectStyle = {};
            var select = new ol.interaction.Select({
                style: function (feature) {
                    console.log(feature);
                    var image = feature.get('style').getImage().getImage();

                    if (!selectStyle[image.src]) {
                        var canvas = document.createElement('canvas');
                        var context = canvas.getContext('2d');
                        canvas.width = image.width;
                        canvas.height = image.height;
                        context.drawImage(image, 0, 0, image.width, image.height);
                        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        var data = imageData.data;
                        for (var i = 0, ii = data.length; i < ii; i = i + (i % 4 === 2 ? 2 : 1)) {
                            data[i] = 255 - data[i];
                        }
                        context.putImageData(imageData, 0, 0);
                        selectStyle[image.src] = createStyle(undefined, canvas);
                    }
                    return selectStyle[image.src];
                }
            });
            map.addInteraction(select);
        },
        /**
         * 鼠标移入、移出事件
         * @param map 地图容器
         */
        selectPointerMove: function (map) {
            var selectPointerMove = new ol.interaction.Select({
                condition: ol.events.condition.pointerMove
            });
            map.addInteraction(selectPointerMove);
            var menu_overlay = new ol.Overlay({
                element: document.getElementById("hover-tips"),
                positioning: 'center-center'
            });
            menu_overlay.setMap(map);
            selectPointerMove.on("select", function (event) {
                if (event.deselected.length > 0) {
                    $(map.getViewport()).on("mousemove", function (e) {
                        e.preventDefault();
                        menu_overlay.setPosition(undefined);
                    });
                }
                if (event.selected.length > 0) {
                    $("#hover-tips").html(event.selected[0].get("name"));
                    $(map.getViewport()).on("mousemove", function (e) {
                        e.preventDefault();
                        menu_overlay.setPosition(map.getEventCoordinate(e));
                    });
                }
            });
        },
        /**
         * 鼠标左键点击事件
         * @param map 地图容器
         */
        leftClick: function (map) {
            var selectClick = new ol.interaction.Select({
                condition: ol.events.condition.click,
                filter: function (feature) {
                    return !mapTools.hasValue(feature, "专线");
                }
            });
            map.addInteraction(selectClick);
            var temporaryFeatureStyleList = [];
            selectClick.on("select", function (e) {
                if (e.deselected.length > 0) {
                    var desFeatureName = e.deselected[0].get("name");
                    var desFeatureList = mapTools.getFeaturesByFeatureName(desFeatureName, map);
                    for (var i = 0, lens = desFeatureList.length; i < lens; i++) {
                        desFeatureList[i].setStyle(temporaryFeatureStyleList[i]);
                        desFeatureList[i].changed();
                    }
                }
                if (e.selected.length > 0) {
                    temporaryFeatureStyleList = [];
                    var featureName = e.selected[0].get("name");
                    console.log(featureName);
                    var featureList = mapTools.getFeaturesByFeatureName(featureName, map);
                    for (var j = 0, len = featureList.length; j < len; j++) {
                        var temporaryFeatureClickStyle = featureList[j].getStyle().clone();
                        temporaryFeatureStyleList.push(temporaryFeatureClickStyle);
                        if (featureList[j].getGeometry().getType() === "Point") {
                            featureList[j].getStyle().getImage().setScale(0.6);
                        } else if (featureList[j].getGeometry().getType() === "LineString") {
                            featureList[j].getStyle().getStroke().setWidth(8);
                            featureList[j].getStyle().getStroke().setColor('#1b67f7');
                        }
                        featureList[j].changed();
                    }

                }
            });
        },
        /**
         * 鼠标右键事件
         * @param map 地图容器
         */
        rightClick: function (map) {
            var menu_overlay = new ol.Overlay({
                element: document.getElementById("contextmenu_container"),
                positioning: 'center-center'
            });
            menu_overlay.setMap(map);
            var layerList = [];

            $(map.getViewport()).on("contextmenu", function (e) {
                e.preventDefault();
                e.stopPropagation();
                var pixel = map.getEventPixel(e.originalEvent);
                var features = [];
                map.forEachFeatureAtPixel(pixel, function (event) {
                    features.push(event);
                    menu_overlay.setPosition(map.getEventCoordinate(e));
                });
                $("#interconnection-switch").css("pointer-events", "none");
                $("#changeSwitchStatus").css("pointer-events", "none");
                console.log(features[0]);
                if (mapTools.hasValue(features[0], "联络开关")) {
                    // jQuery的click事件会累计，因此在添加click事件时，先移除click
                    $("#interconnection-switch").css("pointer-events", "auto").off("click").click(function () {
                        var featureCoordinate = features[0].getGeometry().getFirstCoordinate();
                        var featureList = mapTools.getFeaturesByCoordinate(featureCoordinate, map);
                        for (var i = 0; i < featureList.length; i++) {
                            if (featureList[i].getGeometry().getType() === "Point") {
                                featureList.splice(i, 1);
                            }
                        }
                        for (var j = 0; j < featureList.length; j++) {
                            layerList.push(mapTools.getLayerByFeature(featureList[j], map));
                        }
                        // layer0 = mapTools.getLayerByFeature(featureList[0], map);
                        // layer1 = mapTools.getLayerByFeature(featureList[1], map);
                        if (mapTools.isTypeOfLayerByColor(layerList[0], "#1b67f7")) {
                            //改变layer1中线的样式
                            mapTools.changeLineStringStyleInLayer(layerList[1], "#703575");
                        } else if (mapTools.isTypeOfLayerByColor(layerList[1], "#1b67f7")) {
                            //改变layer0中线的样式
                            mapTools.changeLineStringStyleInLayer(layerList[0], "#703575");
                        } else {
                            //改变layer0,layer1中线的样式
                            mapTools.changeLineStringStyleInLayer(layerList[0], "#1b67f7");
                            mapTools.changeLineStringStyleInLayer(layerList[1], "#703575");
                        }
                    });
                    $("#changeSwitchStatus").css("pointer-events", "auto").off("click").click(function () {
                        var featureCoord = features[0].getGeometry().getFirstCoordinate();
                        var featuresByCoord = mapTools.getFeaturesByCoordinate(featureCoord, map, "LineString");
                        var featureList = mapTools.getFeaturesByColor(featuresByCoord, "#ccc");
                        var faultyFeatureList = mapTools.getFeaturesByColor(featuresByCoord, "#d81e06");
                        if (featureList.length > 0) {
                            features[0].set("status", 0);
                            features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                            features[0].changed();
                            var featuresBySwitchAttr = mapTools.getFeaturesBySwitchAttr(featureList[0].get("number"), map);
                            for (var j = 0; j < featuresBySwitchAttr.length; j++) {
                                if (mapTools.hasKey(featuresBySwitchAttr[j], "status")) {
                                    featuresBySwitchAttr[j].set("status", 0);
                                    featuresBySwitchAttr[j].setStyle(drawLayer.style(featuresBySwitchAttr[j], featuresBySwitchAttr[j].get("status")));
                                    if (featuresBySwitchAttr[j].getGeometry().getType() === "LineString") {
                                        featuresBySwitchAttr[j].getStyle().getStroke().setWidth(2);
                                    }
                                    featuresBySwitchAttr[j].changed();
                                }
                            }
                        }
                        var switchStatus1 = function (featuresByCoord) {
                            for (var i = 0; i < featuresByCoord.length; i++) {
                                var switchFeatureList = mapTools.getFeaturesByPropInMap("attr3", featuresByCoord[i].get("number"), map);
                                for (var j = 0; j < switchFeatureList.length; j++) {
                                    if (switchFeatureList[j].get("type") === "开关") {
                                        console.log(switchFeatureList[j]);
                                        if (switchFeatureList[j].get("status") === 1) {
                                            return switchFeatureList[j];
                                        }
                                    }
                                }
                            }
                        };
                        var faultySwitch = switchStatus1(featuresByCoord);
                        if (faultySwitch !== undefined && faultyFeatureList.length === 0 && featureList.length === 0) {

                            features[0].set("status", 1);
                            features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                            features[0].changed();
                            var featuresBySwitchAttr = mapTools.getFeaturesBySwitchAttr(faultySwitch.get("attr3"), map);
                            for (var j = 0; j < featuresBySwitchAttr.length; j++) {
                                if (mapTools.hasKey(featuresBySwitchAttr[j], "status")) {
                                    featuresBySwitchAttr[j].set("status", 2);
                                    featuresBySwitchAttr[j].setStyle(drawLayer.style(featuresBySwitchAttr[j], featuresBySwitchAttr[j].get("status")));
                                    if (featuresBySwitchAttr[j].getGeometry().getType() === "LineString") {
                                        featuresBySwitchAttr[j].getStyle().getStroke().setWidth(8);
                                    }
                                    featuresBySwitchAttr[j].changed();
                                }
                            }
                        }
                    });
                }
                if (mapTools.hasValue(features[0], "分段开关")) {
                    $("#changeSwitchStatus").css("pointer-events", "auto").off("click").click(function () {
                            var lineMapNumber = Math.floor(Number(features[0].get("attr3")) / 100);
                            var layer = mapTools.getLayerByFeature(features[0], map);
                            var featureList = mapTools.getFeaturesByLineMapNumberInLayer(lineMapNumber, layer);
                            var newFeatureList = mapTools.sortFeatureListByPropName(featureList, "attr3");
                            var mainSwitchFeatures = mapTools.removeFeatureByPropInFeatureList("分支开关", newFeatureList);
                            var lineNumber = mainSwitchFeatures[mainSwitchFeatures.length - 1].get("attr3");
                            var lastLineFeature = mapTools.getFeaturesByPropInMap("number", lineNumber, map)[0];
                            var lastCoordinate = lastLineFeature.getGeometry().getLastCoordinate();
                            var lastFeatureList = mapTools.getFeaturesByCoordinate(lastCoordinate, map);
                            var interconnectionSwitchFeature = mapTools.getFeatureByPropInFeatureList("attr1", "联络开关", lastFeatureList);
                            var featuresBySwitchAttr = mapTools.getFeaturesBySwitchAttr(features[0].get("attr3"), map);
                            var kgList = mapTools.getFeaturesByPropInFeatureList("status", 1, mainSwitchFeatures);
                            if (kgList.length > 1) {
                                //存在多个断开的开关
                                var minKg = kgList[0];
                                var maxKg = kgList[kgList.length - 1];
                                if (minKg.get("attr3") > features[0].get("attr3")) {
                                    //当点击的开关的所属线路要小于kgList的最小值
                                    features[0].set("status", 1);
                                    features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                                    features[0].changed();
                                    var middleFeaturesBySwitchAttr = mapTools.getFeaturesBySwitchAttr(features[0].get("attr3"), map, minKg.get("attr3"));
                                    for (var j = 0; j < middleFeaturesBySwitchAttr.length; j++) {
                                        if (mapTools.hasKey(middleFeaturesBySwitchAttr[j], "status")) {
                                            middleFeaturesBySwitchAttr[j].set("status", 1);
                                            middleFeaturesBySwitchAttr[j].setStyle(drawLayer.style(middleFeaturesBySwitchAttr[j], middleFeaturesBySwitchAttr[j].get("status")));
                                            if (middleFeaturesBySwitchAttr[j].getGeometry().getType() === "LineString") {
                                                middleFeaturesBySwitchAttr[j].getStyle().getStroke().setWidth(8);
                                            }
                                            middleFeaturesBySwitchAttr[j].changed();
                                        }
                                    }
                                } else if (minKg.get("attr3") === features[0].get("attr3")) {
                                    //当点击的开关的所属线路要等于kgList的最小值
                                    features[0].set("status", 0);
                                    features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                                    features[0].changed();
                                    var middleFeaturesBySwitchAttr = mapTools.getFeaturesBySwitchAttr(features[0].get("attr3"), map, maxKg.get("attr3"));
                                    for (var j = 0; j < middleFeaturesBySwitchAttr.length; j++) {
                                        if (mapTools.hasKey(middleFeaturesBySwitchAttr[j], "status")) {
                                            middleFeaturesBySwitchAttr[j].set("status", 0);
                                            middleFeaturesBySwitchAttr[j].setStyle(drawLayer.style(middleFeaturesBySwitchAttr[j], middleFeaturesBySwitchAttr[j].get("status")));
                                            if (middleFeaturesBySwitchAttr[j].getGeometry().getType() === "LineString") {
                                                middleFeaturesBySwitchAttr[j].getStyle().getStroke().setWidth(2);
                                            }
                                            middleFeaturesBySwitchAttr[j].changed();
                                        }
                                    }
                                } else if (minKg.get("attr3") < features[0].get("attr3") && maxKg.get("attr3") > features[0].get("attr3")) {
                                    //当点击的开关的所属线路要处于kgList的最小值与最大值之间
                                    var flag = 0;
                                    if (features[0].get("status") === 0) {
                                        flag = 1;
                                    }
                                    features[0].set("status", flag);
                                    features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                                    features[0].changed();
                                } else if (maxKg.get("attr3") === features[0].get("attr3")) {
                                    //当点击的开关的所属线路要等于kgList的最大值
                                    if (interconnectionSwitchFeature.get("status") === 1) {
                                        //闭合此开关，并将后面除开关外所有器件或线路状态置为1
                                        features[0].set("status", 0);
                                        features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                                        features[0].changed();
                                        for (var j = 0; j < featuresBySwitchAttr.length; j++) {
                                            if (mapTools.hasKey(featuresBySwitchAttr[j], "status")) {
                                                //状态得改
                                                featuresBySwitchAttr[j].set("status", 1);
                                                featuresBySwitchAttr[j].setStyle(drawLayer.style(featuresBySwitchAttr[j], featuresBySwitchAttr[j].get("status")));
                                                if (featuresBySwitchAttr[j].getGeometry().getType() === "LineString") {
                                                    featuresBySwitchAttr[j].getStyle().getStroke().setWidth(8);
                                                }
                                                featuresBySwitchAttr[j].changed();
                                            }
                                        }
                                    } else if (interconnectionSwitchFeature.get("status") === 0) {
                                        alert(features[0].get("name") + "不可闭合");
                                    }
                                } else if (maxKg.get("attr3") < features[0].get("attr3")) {
                                    //当点击的开关的所属线路要大于kgList的最大值
                                    if (interconnectionSwitchFeature.get("status") === 1) {
                                        var flag = 0;
                                        if (features[0].get("status") === 0) {
                                            flag = 1;
                                        }
                                        features[0].set("status", flag);
                                        features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                                        features[0].changed();
                                    } else if (interconnectionSwitchFeature.get("status") === 0) {
                                        //断开此开关，并将kgList的最大值与点击的开关之间的器件或状态置为停电状态
                                        features[0].set("status", 1);
                                        features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                                        features[0].changed();
                                        var middleFeaturesBySwitchAttr = mapTools.getFeaturesBySwitchAttr(maxKg.get("attr3"), map, features[0].get("attr3"));
                                        for (var j = 0; j < middleFeaturesBySwitchAttr.length; j++) {
                                            if (mapTools.hasKey(middleFeaturesBySwitchAttr[j], "status")) {
                                                middleFeaturesBySwitchAttr[j].set("status", 2);
                                                middleFeaturesBySwitchAttr[j].setStyle(drawLayer.style(middleFeaturesBySwitchAttr[j], middleFeaturesBySwitchAttr[j].get("status")));
                                                if (middleFeaturesBySwitchAttr[j].getGeometry().getType() === "LineString") {
                                                    middleFeaturesBySwitchAttr[j].getStyle().getStroke().setWidth(8);
                                                }
                                                middleFeaturesBySwitchAttr[j].changed();
                                            }
                                        }
                                    }
                                }
                            } else if (kgList.length === 1) {
                                //存在一个断开的开关
                                console.log(kgList[0]);
                                //判断kgList中的开关，与所点击的开关的相关位置，在前、当前或之后
                                if (kgList[0].get("attr3") < features[0].get("attr3")) {
                                    if (interconnectionSwitchFeature.get("status") === 1) {
                                        //断开此开关，并将后面除开关外所有器件或线路状态置为停电状态
                                        features[0].set("status", 1);
                                        features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                                        features[0].changed();
                                        for (var j = 0; j < featuresBySwitchAttr.length; j++) {
                                            if (mapTools.hasKey(featuresBySwitchAttr[j], "status")) {
                                                //状态得改
                                                featuresBySwitchAttr[j].set("status", 2);
                                                featuresBySwitchAttr[j].setStyle(drawLayer.style(featuresBySwitchAttr[j], featuresBySwitchAttr[j].get("status")));
                                                if (featuresBySwitchAttr[j].getGeometry().getType() === "LineString") {
                                                    featuresBySwitchAttr[j].getStyle().getStroke().setWidth(8);
                                                }
                                                featuresBySwitchAttr[j].changed();
                                            }
                                        }
                                    }
                                } else if (kgList[0].get("attr3") === features[0].get("attr3")) {
                                    if (interconnectionSwitchFeature.get("status") === 1) {
                                        //闭合此开关，将后面除开关外所有器件或线路状态置为正常状态
                                        features[0].set("status", 0);
                                        features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                                        features[0].changed();
                                        for (var j = 0; j < featuresBySwitchAttr.length; j++) {
                                            if (mapTools.hasKey(featuresBySwitchAttr[j], "status")) {
                                                //状态得改
                                                featuresBySwitchAttr[j].set("status", 0);
                                                featuresBySwitchAttr[j].setStyle(drawLayer.style(featuresBySwitchAttr[j], featuresBySwitchAttr[j].get("status")));
                                                if (featuresBySwitchAttr[j].getGeometry().getType() === "LineString") {
                                                    featuresBySwitchAttr[j].getStyle().getStroke().setWidth(2);
                                                }
                                                featuresBySwitchAttr[j].changed();
                                            }
                                        }
                                    }else if (interconnectionSwitchFeature.get("status") === 0) {
                                        alert(features[0].get("name") + "不可闭合");
                                    }

                                } else {
                                    // 断开此开关，并将此开关与i之间的器件或线路状态置为1
                                    features[0].set("status", 1);
                                    features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                                    features[0].changed();
                                    var middleFeaturesBySwitchAttr = mapTools.getFeaturesBySwitchAttr(features[0].get("attr3"), map, kgList[0].get("attr3"));
                                    for (var j = 0; j < middleFeaturesBySwitchAttr.length; j++) {
                                        if (mapTools.hasKey(middleFeaturesBySwitchAttr[j], "status")) {
                                            middleFeaturesBySwitchAttr[j].set("status", 1);
                                            middleFeaturesBySwitchAttr[j].setStyle(drawLayer.style(middleFeaturesBySwitchAttr[j], middleFeaturesBySwitchAttr[j].get("status")));
                                            if (middleFeaturesBySwitchAttr[j].getGeometry().getType() === "LineString") {
                                                middleFeaturesBySwitchAttr[j].getStyle().getStroke().setWidth(8);
                                            }
                                            middleFeaturesBySwitchAttr[j].changed();
                                        }
                                    }
                                }
                            } else {
                                //为空
                                //断开此开关，改变后面线路或器件的状态，置为1
                                features[0].set("status", 1);
                                features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                                features[0].changed();
                                for (var j = 0; j < featuresBySwitchAttr.length; j++) {
                                    if (mapTools.hasKey(featuresBySwitchAttr[j], "status")) {
                                        featuresBySwitchAttr[j].set("status", 1);
                                        featuresBySwitchAttr[j].setStyle(drawLayer.style(featuresBySwitchAttr[j], featuresBySwitchAttr[j].get("status")));
                                        if (featuresBySwitchAttr[j].getGeometry().getType() === "LineString") {
                                            featuresBySwitchAttr[j].getStyle().getStroke().setWidth(8);
                                        }
                                        featuresBySwitchAttr[j].changed();
                                    }
                                }
                            }


                            // for (var i = 0; i < mainSwitchFeatures.length; i++) {
                            //
                            //     if (mainSwitchFeatures[i].get("status") === 1) {
                            //         console.log(mainSwitchFeatures[i]);
                            //         console.log(features[0]);
                            //         switchFlag = 1;
                            //         if (mainSwitchFeatures[i].get("attr3") < features[0].get("attr3")) {
                            //             if (interconnectionSwitchFeature.get("status") === 0) {
                            //                 //断开此开关，并将后面除开关外所有器件或线路状态置为0
                            //                 features[0].set("status", 1);
                            //                 features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                            //                 features[0].changed();
                            //                 for (var j = 0; j < featuresBySwitchAttr.length; j++) {
                            //                     if (mapTools.hasKey(featuresBySwitchAttr[j], "status")) {
                            //                         featuresBySwitchAttr[j].set("status", 0);
                            //                         featuresBySwitchAttr[j].setStyle(drawLayer.style(featuresBySwitchAttr[j], featuresBySwitchAttr[j].get("status")));
                            //                         if (featuresBySwitchAttr[j].getGeometry().getType() === "LineString") {
                            //                             featuresBySwitchAttr[j].getStyle().getStroke().setWidth(2);
                            //                         }
                            //                         featuresBySwitchAttr[j].changed();
                            //                     }
                            //                 }
                            //             } else if (interconnectionSwitchFeature.get("status") === 1) {
                            //                 //断开此开关，并将后面除开关外所有器件或线路状态置为停电状态
                            //                 features[0].set("status", 1);
                            //                 features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                            //                 features[0].changed();
                            //                 for (var j = 0; j < featuresBySwitchAttr.length; j++) {
                            //                     if (mapTools.hasKey(featuresBySwitchAttr[j], "status")) {
                            //                         //状态得改
                            //                         featuresBySwitchAttr[j].set("status", 0);
                            //                         featuresBySwitchAttr[j].setStyle(drawLayer.style(featuresBySwitchAttr[j], featuresBySwitchAttr[j].get("status")));
                            //                         if (featuresBySwitchAttr[j].getGeometry().getType() === "LineString") {
                            //                             featuresBySwitchAttr[j].getStyle().getStroke().setWidth(2);
                            //                         }
                            //                         featuresBySwitchAttr[j].changed();
                            //                     }
                            //                 }
                            //             }
                            //             break;
                            //         } else if (mainSwitchFeatures[i].get("attr3") === features[0].get("attr3")) {
                            //             console.log("hello");
                            //             console.log(interconnectionSwitchFeature.get("status"));
                            //             if (interconnectionSwitchFeature.get("status") === 0) {
                            //                 console.log(interconnectionSwitchFeature.get("status"));
                            //                 //此开关不可闭合
                            //                 features[0].set("status", 1);
                            //                 features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                            //                 features[0].changed();
                            //             } else if (interconnectionSwitchFeature.get("status") === 1) {
                            //                 //闭合此开关，并将后面除开关外所有器件或线路状态置为0
                            //                 features[0].set("status", 0);
                            //                 features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                            //                 features[0].changed();
                            //                 for (var j = 0; j < featuresBySwitchAttr.length; j++) {
                            //                     if (mapTools.hasKey(featuresBySwitchAttr[j], "status")) {
                            //                         featuresBySwitchAttr[j].set("status", 0);
                            //                         featuresBySwitchAttr[j].setStyle(drawLayer.style(featuresBySwitchAttr[j], featuresBySwitchAttr[j].get("status")));
                            //                         if (featuresBySwitchAttr[j].getGeometry().getType() === "LineString") {
                            //                             featuresBySwitchAttr[j].getStyle().getStroke().setWidth(2);
                            //                         }
                            //                         featuresBySwitchAttr[j].changed();
                            //                     }
                            //                 }
                            //             }
                            //             break;
                            //         } else {
                            //             // 断开此开关，并将此开关与i之间的器件或线路状态置为1
                            //             features[0].set("status", 1);
                            //             features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                            //             features[0].changed();
                            //             var middleFeaturesBySwitchAttr = mapTools.getFeaturesBySwitchAttr(features[0].get("attr3"), map, mainSwitchFeatures[i].get("attr3"));
                            //             for (var j = 0; j < middleFeaturesBySwitchAttr.length; j++) {
                            //                 if (mapTools.hasKey(middleFeaturesBySwitchAttr[j], "status")) {
                            //                     middleFeaturesBySwitchAttr[j].set("status", 1);
                            //                     middleFeaturesBySwitchAttr[j].setStyle(drawLayer.style(middleFeaturesBySwitchAttr[j], middleFeaturesBySwitchAttr[j].get("status")));
                            //                     if (middleFeaturesBySwitchAttr[j].getGeometry().getType() === "LineString") {
                            //                         middleFeaturesBySwitchAttr[j].getStyle().getStroke().setWidth(8);
                            //                     }
                            //                     middleFeaturesBySwitchAttr[j].changed();
                            //                 }
                            //             }
                            //             break;
                            //         }
                            //     }
                            // }
                            // if (switchFlag === 0) {
                            //     //断开此开关，并将后面除开关外所有器件或线路状态置为1
                            //     features[0].set("status", 1);
                            //     features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                            //     features[0].changed();
                            //     for (var j = 0; j < featuresBySwitchAttr.length; j++) {
                            //         if (mapTools.hasKey(featuresBySwitchAttr[j], "status")) {
                            //             featuresBySwitchAttr[j].set("status", 1);
                            //             featuresBySwitchAttr[j].setStyle(drawLayer.style(featuresBySwitchAttr[j], featuresBySwitchAttr[j].get("status")));
                            //             if (featuresBySwitchAttr[j].getGeometry().getType() === "LineString") {
                            //                 featuresBySwitchAttr[j].getStyle().getStroke().setWidth(8);
                            //             }
                            //             featuresBySwitchAttr[j].changed();
                            //         }
                            //     }
                            // }


                            // if (features[0].get("status") === 0) {
                            //     flag = 1;
                            // }
                            // features[0].set("status", flag);
                            // features[0].setStyle(drawLayer.style(features[0], features[0].get("status")));
                            // // var featuresBySwitchAttr = mapTools.getFeaturesBySwitchAttr(features[0].get("attr3"), map);
                            // for (var i = 0; i < featuresBySwitchAttr.length; i++) {
                            //     if (mapTools.hasKey(featuresBySwitchAttr[i], "status")) {
                            //         featuresBySwitchAttr[i].set("status", 0);
                            //     }
                            //     featuresBySwitchAttr[i].setStyle(drawLayer.style(featuresBySwitchAttr[i], featuresBySwitchAttr[i].get("status")));
                            //     if (featuresBySwitchAttr[i].getGeometry().getType() === "LineString") {
                            //         if (flag === 0) {
                            //             featuresBySwitchAttr[i].getStyle().getStroke().setWidth(2);
                            //         } else {
                            //             featuresBySwitchAttr[i].getStyle().getStroke().setWidth(8);
                            //         }
                            //
                            //     }
                            //     featuresBySwitchAttr[i].changed();
                            // }
                            // }
                        }
                    );
                }
            });
            var flag = 0;
            $(map.getViewport()).on({
                mousedown: function (e) {
                    flag = 0;
                },
                mousemove: function (e) {
                    flag = 1;
                },
                mouseup: function (e) {
                    if (flag === 0) {//点击
                        e.preventDefault();
                        e.stopPropagation();
                        menu_overlay.setPosition(undefined);
                        for (var i = 0; i < layerList.length; i++) {
                            mapTools.resetLineStringStyleInLayer(layerList[i]);
                        }
                        layerList.splice(0, layerList.length);

                    }
                }
            });
        },
        /**
         * 查询事件
         * @param data 器件或线路的名称
         * @param map 地图容器
         */
        search: function (data, map) {
            $('#selectPage').selectPage({
                showField: 'name',
                keyField: 'name',
                autoFillResult: true,
                autoSelectFirst: true,
                //关闭分页栏，数据将会一次性在列表中展示，上限200个项目,
                pagination: true,
                //关闭分页的状态下，列表显示的项目个数，其它的项目以滚动条滚动方式展现（默认10个）
                listSize: 20,
                // 多选，默认为false
                multiple: false,
                //多查询条件之间的“与(AND)”“或(OR)”关系
                andOr: 'OR',
                //设置结果集排序，若只指定字段，不指定排序方式，则默认使用asc升序模式
                //排序字段若不指定，则默认对showField指定的列进行升序排列
                //若需要多字段排序，则设置['id desc','name']
                //当前案例设置了使用desc字段的内容进行降序排序
                orderBy: ['name'],
                //打开分页时，设置每页显示记录数
                pageSize: 15,
                //关闭向下的三角尖按钮,默认打开
                dropButton: true,
                data: data,
                //格式化显示项目，提供源数据进行使用
                formatItem: function (data) {
                    if (data.attr2 !== undefined) {
                        return data.name + '(' + data.attr2 + ')';
                    } else {
                        return data.name;
                    }

                }

            });
            var searchFeatureList = [];
            var searchFeatureStyleList = [];
            $('#func1').off("click").click(function () {
                if (searchFeatureList.length > 0) {
                    for (var i = 0; i < searchFeatureList.length; i++) {
                        searchFeatureList[i].setStyle(searchFeatureStyleList[i]);
                        searchFeatureList[i].changed();
                    }
                    searchFeatureList = [];
                    searchFeatureStyleList = [];
                }
                // 获取查询框中对应的feature,可能会是多个
                var featureList = mapTools.getFeaturesByFeatureName($('#selectPage').selectPageText().split("(")[0], map);
                for (var j = 0; j < featureList.length; j++) {
                    searchFeatureStyleList.push(featureList[j].getStyle().clone());
                    searchFeatureList.push(featureList[j]);
                    if (featureList[j].getGeometry().getType() === "Point") {
                        featureList[j].getStyle().getImage().setScale(0.6);
                    } else if (featureList[j].getGeometry().getType() === "LineString") {
                        featureList[j].getStyle().getStroke().setWidth(8);
                        featureList[j].getStyle().getStroke().setColor('#1b67f7');
                    }
                    featureList[j].changed();
                    var p = featureList[j].getGeometry().getFirstCoordinate();
                    map.getView().setCenter(p);
                }
                // searchFeatureList.push(featureList);

            });
            var flag = 0;
            $(map.getViewport()).on({
                mousedown: function (e) {
                    flag = 0;
                },
                mousemove: function (e) {
                    flag = 1;
                },
                mouseup: function (e) {
                    if (flag === 0) {//点击
                        e.stopPropagation();
                        e.preventDefault();
                        if (searchFeatureList.length > 0) {
                            for (var i = 0; i < searchFeatureList.length; i++) {
                                searchFeatureList[i].setStyle(searchFeatureStyleList[i]);
                                searchFeatureList[i].changed();
                            }
                            searchFeatureList = [];
                            searchFeatureStyleList = [];
                        }
                    }
                }
            });
        }
    };
    return searchAndSelect;
})
(window.searchAndSelect || {});