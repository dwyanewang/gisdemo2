/**
 * FileName: searchAndSelect.js
 * Author: Dwyanewang
 * CreateTime: 2018/9/14 15:00
 */
var searchAndSelect = (function (searchAndSelect) {
    searchAndSelect = {
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
                condition: ol.events.condition.click
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
            var layer0, layer1;
            $(map.getViewport()).on("contextmenu", function (e) {
                e.preventDefault();
                var pixel = map.getEventPixel(e.originalEvent);
                map.forEachFeatureAtPixel(pixel, function (event) {
                    menu_overlay.setPosition(map.getEventCoordinate(e));
                    if (mapTools.isTypeOfFeatureByProp(event, "联络开关")) {
                        $("#interconnection-switch").css("pointer-events", "auto").click(function () {
                            var featureCoordinate = event.getGeometry().getFirstCoordinate();
                            var featureList = mapTools.getFeaturesByCoordinate(featureCoordinate, map);
                            layer0 = mapTools.getLayerByFeature(featureList[0], map);
                            layer1 = mapTools.getLayerByFeature(featureList[1], map);
                            if (mapTools.isTypeOfLayerByColor(layer0, "#1b67f7")) {
                                //改变layer1中线的样式
                                mapTools.changeLineStringStyleInLayer(layer1, "#703575");
                            } else if (mapTools.isTypeOfLayerByColor(layer1, "#1b67f7")) {
                                //改变layer0中线的样式
                                mapTools.changeLineStringStyleInLayer(layer0, "#703575");
                            } else {
                                //改变layer0,layer1中线的样式
                                mapTools.changeLineStringStyleInLayer(layer0, "#1b67f7");
                                mapTools.changeLineStringStyleInLayer(layer1, "#703575");
                            }
                        });
                    } else {
                        $("#interconnection-switch").css("pointer-events", "none");
                    }

                });
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
                        menu_overlay.setPosition(undefined);
                        if (layer0 !== undefined && layer1 !== undefined) {
                            mapTools.resetLineStringStyleInLayer(layer0);
                            mapTools.resetLineStringStyleInLayer(layer1);
                            layer0 = undefined;
                            layer1 = undefined;
                        }
                    }
                }
            });
        },
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
                orderBy: ['desc desc'],
                //打开分页时，设置每页显示记录数
                pageSize: 15,
                //关闭向下的三角尖按钮,默认打开
                dropButton: true,
                data: data
                //格式化显示项目，提供源数据进行使用
                // formatItem: function(data) {
                //   return data.desc + '(' + data.name + ')';
                // },

            });
            var searchFeatureList = [];
            var searchFeatureStyleList = [];
            $('#func1').click(function () {
                // alert($('#selectPage').selectPageText());
                var featureList = mapTools.getFeaturesByFeatureName($('#selectPage').selectPageText(), map);
                if (featureList.length > 0) {
                    // if (featureList[0].getGeometry().getType() === "LineString") {
                    //     searchFeatureStyle.push(featureList[0].getStyle().clone());
                    // }
                    for (var i = 0; i < featureList.length; i++) {
                        searchFeatureStyleList.push(featureList[i].getStyle().clone());
                    }
                }
                for (var i = 0, len = featureList.length; i < len; i++) {
                    if (featureList[i].getGeometry().getType() === "Point") {
                        featureList[i].getStyle().getImage().setScale(0.6);
                    } else if (featureList[i].getGeometry().getType() === "LineString") {
                        featureList[i].getStyle().getStroke().setWidth(8);
                        featureList[i].getStyle().getStroke().setColor('#1b67f7');
                    }
                    featureList[i].changed();
                }
                searchFeatureList.push(featureList);
                if (searchFeatureList.length > 1) {
                    var temporaryFeatureList = searchFeatureList.shift();
                    for (var j = 0; j < temporaryFeatureList.length; j++) {
                        temporaryFeatureList[j].setStyle(searchFeatureStyleList[j]);
                        temporaryFeatureList[j].changed();
                    }
                    searchFeatureStyleList.splice(0, searchFeatureStyleList.length);
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
                        e.stopPropagation();
                        e.preventDefault();
                        if (searchFeatureList.length > 0) {
                            var temporaryFeatureList = searchFeatureList.shift();
                            for (var j = 0; j < temporaryFeatureList.length; j++) {
                                temporaryFeatureList[j].setStyle(searchFeatureStyleList[j]);
                                temporaryFeatureList[j].changed();
                            }
                            searchFeatureStyleList.splice(0, searchFeatureStyleList.length);
                        }
                    }
                }
            });
        }
    };
    return searchAndSelect;
})(window.searchAndSelect || {});