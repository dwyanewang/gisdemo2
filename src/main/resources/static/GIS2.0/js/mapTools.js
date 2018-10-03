/**
 * FileName: mapTools.js
 * Author: Dwyanewang
 * CreateTime: 2018/9/17 9:03
 */
var mapTools = (function (mapTools) {
        mapTools = {
            /**
             * 通用数组或对象数组去重
             * @param arr 数组或对象数组
             * @param type 对象去重类型
             * @returns {*}
             */
            duplicate: function (arr, type) {
                var newArr = [];
                var tArr = [];
                if (arr.length === 0) {
                    return arr;
                } else {
                    if (type) {
                        for (var i = 0; i < arr.length; i++) {
                            if (!tArr[arr[i][type]]) {
                                newArr.push(arr[i]);
                                tArr[arr[i][type]] = true;
                            }
                        }
                        return newArr;
                    } else {
                        for (var j = 0; j < arr.length; j++) {
                            if (!tArr[arr[j]]) {
                                newArr.push(arr[j]);
                                tArr[arr[j]] = true;
                            }
                        }
                        return newArr;
                    }
                }
            },
            /**
             * 获取所有的线要素
             * @param map 地图容器
             * @returns {Array}
             */
            getAllFeatures: function (map) {
                var featureList = [];
                var layers = map.getLayers().getArray();
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (layers[i] instanceof ol.layer.Vector) {
                        var features = layers[i].getSource().getFeatures();
                        for (var j = 0; j < features.length; j++) {
                            if (features[j].getGeometry().getType() === "LineString") {
                                featureList.push(features[j]);
                            }
                        }
                    }
                }
                return featureList;
            },
            /**
             * 获取map中所有feature的name属性
             * @param map 地图容器
             * @returns {*}
             */
            getAllFeatureNames: function (map) {
                var featureNameList = [];
                var layers = map.getLayers().getArray();
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (layers[i] instanceof ol.layer.Vector) {
                        var features = layers[i].getSource().getFeatures();
                        for (var j = 0; j < features.length; j++) {
                            var props = features[j].getProperties();
                            for (var key in props) {
                                if (!props.hasOwnProperty(key)) continue;
                                if (key === "name") {
                                    featureNameList.push({"name": props[key]});
                                }
                            }
                        }
                    }
                }
                return mapTools.duplicate(featureNameList, "name");
            },
            /**
             * 查询所有feature的某一个或多个属性，用于器件或线路查询时
             * @param map 地图容器
             * @returns {*}
             */
            getAllFeaturesProps: function (map) {
                var defaultValues = {
                    featureType: ["name"]
                };
                var params = arguments[1];
                for (var prop in params) {
                    if (!params.hasOwnProperty(prop)) continue;
                    defaultValues[prop] = params[prop];
                }
                var featureNameList = [];
                var layers = map.getLayers().getArray();
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (layers[i] instanceof ol.layer.Vector) {
                        var features = layers[i].getSource().getFeatures();
                        for (var j = 0; j < features.length; j++) {
                            if (!mapTools.hasValue(features[j], "专线")) {
                                var props = features[j].getProperties();
                                var featureMap = {};
                                for (var key in props) {
                                    if (!props.hasOwnProperty(key)) continue;
                                    for (var k = 0, featuresLen = defaultValues.featureType.length; k < featuresLen; k++) {
                                        if (key === defaultValues.featureType[k]) {
                                            featureMap[key] = props[key];
                                        }
                                    }
                                }
                                featureNameList.push(featureMap);
                            }
                        }
                    }
                }
                return mapTools.duplicate(featureNameList, defaultValues.featureType[0]);
            },
            /**
             * 通过坐标获取相应的layerList
             * @param coordinate 坐标
             * @param map 地图容器
             * @returns {Array}
             */
            getLayersByCoordinate: function (coordinate, map) {
                var layerList = [];
                var layers = map.getLayers().getArray();
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (layers[i] instanceof ol.layer.Vector) {
                        console.log(layers[i]);
                    }
                    var source = layers[i].getSource();
                    if (source instanceof ol.source.Vector) {
                        var features = source.getFeatures();
                        for (var j = 0; j < features.length; j++) {
                            // if (features[j].getGeometry().getType() === "Point") {
                            var x = features[j].getGeometry().getFirstCoordinate()[0];
                            var y = features[j].getGeometry().getFirstCoordinate()[1];
                            console.log(coordinate);
                            if (Math.abs(x - coordinate[0]) < 0.001 && Math.abs(y - coordinate[1]) < 0.001) {
                                layerList.push(layers[i]);
                                console.log(features[j]);
                            }
                        }
                    }
                }
                return layerList;
            },
            /**
             * 通过layer的“name”属性获取相应的layerList
             * @param layerName layer的“name”属性
             * @param map 地图容器
             * @returns {Array}
             */
            getLayersByLayerName: function (layerName, map) {
                var layerList = [];
                var layers = map.getLayers().getArray();
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (layers[i] instanceof ol.layer.Vector) {
                        if (layers[i].get("name") === layerName) {
                            layerList.push(layers[i]);
                        }
                    }
                }
                return layerList;
            },
            /**
             * 通过feature获取此feature所在图层
             * @param feature 点或线要素
             * @param map 地图容器
             * @returns {ol.layer.Vector}
             */
            getLayerByFeature: function (feature, map) {
                var layers = map.getLayers().getArray();
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (layers[i] instanceof ol.layer.Vector) {
                        var features = layers[i].getSource().getFeatures();
                        for (var j = 0; j < features.length; j++) {
                            if (features[j] === feature) {
                                return layers[i];
                            }
                        }
                    }
                }
            },
            /**
             * 通过坐标获取相应的featureList
             * @param coordinate 坐标
             * @param map 地图容器
             * @returns {Array}
             */
            getFeaturesByCoordinate: function (coordinate, map) {
                var featureList = [];
                var layers = map.getLayers().getArray();
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (layers[i] instanceof ol.layer.Vector) {
                        var features = layers[i].getSource().getFeatures();
                        for (var j = 0, featureLen = features.length; j < featureLen; j++) {
                            var featureCoordinates = [];
                            featureCoordinates.push(features[j].getGeometry().getFirstCoordinate());
                            if (features[j].getGeometry().getType() === "LineString") {
                                featureCoordinates.push(features[j].getGeometry().getLastCoordinate());
                            }
                            for (var k = 0; k < featureCoordinates.length; k++) {
                                if (coordinate[0] === featureCoordinates[k][0] && coordinate[1] === featureCoordinates[k][1]) {
                                    featureList.push(features[j]);
                                }
                            }
                        }
                    }
                }
                return featureList;
            },
            /**
             * 通过feature的“name”属性获取相应的featureList
             * @param featureName feature的“name”属性
             * @param map 地图容器
             * @returns {Array}
             */
            getFeaturesByFeatureName: function (featureName, map) {
                var featureList = [];
                var layers = map.getLayers().getArray();
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (layers[i] instanceof ol.layer.Vector) {
                        var features = layers[i].getSource().getFeatures();
                        for (var j = 0, featureLen = features.length; j < featureLen; j++) {
                            if (features[j].get("name") === featureName) {
                                featureList.push(features[j]);
                            }
                        }
                    }
                }
                return featureList;
            },
            /**
             * 获取layer中某一类型的所有feature
             * @param layer 矢量图层
             * @param featureType feature的类型，如：点(Point)、线(LineString)...
             * @returns {Array}
             */
            getFeaturesInLayerByFeatureType: function (layer, featureType) {
                var featureList = [];
                var features = layer.getSource().getFeatures();
                for (var i = 0; i < features.length; i++) {
                    if (features[i].getGeometry().getType() === featureType) {
                        featureList.push(features[i]);
                    }
                }
                return featureList;
            },
            /**
             * 通过feature样式的颜色来获取相应的feature
             * @param features 主要是线要素
             * @param color feature样式的颜色
             * @returns {Array}
             */
            getFeaturesByColor: function (features, color) {
                var featureList = [];
                for (var i = 0; i < features.length; i++) {
                    if (features[i].getGeometry().getType() === "LineString") {
                        if (features[i].getStyle().getStroke().getColor() === color) {
                            featureList.push(features[i]);
                        }
                    }
                }
                return featureList;
            },
            /**
             * 判断feature或layer是否存在value这一属性值
             * @param featureOrLayer 要素或图层
             * @param value 属性值
             * @returns {boolean}
             */
            hasValue: function (featureOrLayer, value) {
                if (featureOrLayer !== undefined) {
                    var props = featureOrLayer.getProperties();
                    for (var key in props) {
                        if (!props.hasOwnProperty(key)) continue;
                        if (props[key] === value) {
                            return true;
                        }
                    }
                    return false;
                }
            },
            hasSimilarValue: function (featureOrLayer, value) {
                if (featureOrLayer !== undefined) {
                    var props = featureOrLayer.getProperties();
                    for (var key in props) {
                        if (!props.hasOwnProperty(key)) continue;
                        if (typeof props[key] === "string") {
                            if (props[key].indexOf(value) !== -1) {
                                return true;
                            }
                        }
                    }
                    return false;
                }
            },
            /**
             * 判断feature或layer是否存在key这一属性名
             * @param featureOrLayer 要素或图层
             * @param key 属性名
             * @returns {boolean}
             */
            hasKey: function (featureOrLayer, key) {
                if (featureOrLayer !== undefined) {
                    var props = featureOrLayer.getProperties();
                    for (var ownKey in props) {
                        if (!props.hasOwnProperty(ownKey)) continue;
                        if (ownKey === key) {
                            return true;
                        }
                    }
                    return false;
                }
            },
            /**
             * 判断layer中是否存在某种颜色的feature
             * @param layer 矢量图层
             * @param color 颜色色值
             * @returns {boolean}
             */
            isTypeOfLayerByColor: function (layer, color) {
                var features = layer.getSource().getFeatures();
                for (var i = 0; i < features.length; i++) {
                    if (features[i].getGeometry().getType() === "LineString") {
                        if (features[i].getStyle().getStroke().getColor() === color) {
                            return true;
                        }
                    }
                }
                return false;
            },
            /**
             * 改变feature的样式
             * @param feature 点或线要素
             */
            changeFeatureStyle: function (feature) {
                if (feature.getGeometry().getType() === "Point") {
                    feature.setStyle(new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 30,
                            points: 4,
                            stroke: new ol.style.Stroke({
                                color: "#4271AE",
                                width: 2
                            }),
                            fill: new ol.style.Fill({
                                color: "#ccc"
                            })
                        })
                    }));
                } else if (feature.getGeometry().getType() === "LineString") {
                    feature.setStyle(new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#d81e06',
                            width: 2
                        })
                    }));
                }
                feature.changed();
            },
            /**
             * 重置线要素的样式
             * @param feature 线要素
             */
            resetLineStringStyle: function (feature) {
                switch (feature.get("type")) {
                    case "10kV":
                        feature.getStyle().getStroke().setColor("#3ca945");
                        feature.getStyle().getStroke().setWidth(2);
                        break;
                    case "35kV":
                        feature.getStyle().getStroke().setColor("#0000CD");
                        feature.getStyle().getStroke().setWidth(2);
                        break;
                    case "110kV":
                        feature.getStyle().getStroke().setColor("#EE7600");
                        feature.getStyle().getStroke().setWidth(2);
                        break;
                    case "220kV":
                        feature.getStyle().getStroke().setColor("#4A4A4A");
                        feature.getStyle().getStroke().setWidth(2);
                        break;
                    case "专线":
                        feature.getStyle().getStroke().setColor("#3ca945");
                        feature.getStyle().getStroke().setWidth(2);
                        break;
                }
            },
            /**
             * 重置layers中所有线要素的样式
             * @param layer 矢量图层
             */
            resetLineStringStyleInLayer: function (layer) {
                var features = layer.getSource().getFeatures();
                for (var i = 0; i < features.length; i++) {
                    if (features[i].getGeometry().getType() === "LineString") {
                        mapTools.resetLineStringStyle(features[i]);
                        features[i].changed();
                    }
                }
            },
            changeLineStringStyleInLayer: function (layer, color) {
                var features = layer.getSource().getFeatures();
                for (var i = 0; i < features.length; i++) {
                    if (features[i].getGeometry().getType() === "LineString") {
                        features[i].getStyle().getStroke().setColor(color);
                        features[i].getStyle().getStroke().setWidth(8);
                        features[i].changed();
                    }
                }
            },
            /**
             * 根据开关的所属线路属性，获取在此图层上此开关之后的所有feature
             * @param attr 开关的线路属性
             * @param map 地图容器
             * @param maxAttr 线路属性最大值
             * @returns {Array}
             */
            getFeaturesBySwitchAttr: function (attr, map, maxAttr) {
                if (maxAttr === undefined) {
                    maxAttr = (Math.floor(attr / 100) + 1) * 100;
                }
                var featureList = [];
                var layers = map.getLayers().getArray();
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (layers[i] instanceof ol.layer.Vector) {
                        var features = layers[i].getSource().getFeatures();
                        for (var j = 0, featureLen = features.length; j < featureLen; j++) {
                            if (features[j].get("type") !== "杆塔" && features[j].get("type") !== "开关") {

                                if (mapTools.hasKey(features[j], "attr3")) {
                                    if (features[j].getGeometry().getType() === "Point") {
                                        if (features[j].get("attr3") >= attr && features[j].get("attr3") < maxAttr) {
                                            featureList.push(features[j]);
                                        }
                                    } else if (features[j].getGeometry().getType() === "LineString") {
                                        if (features[j].get("number") >= attr && features[j].get("number") < maxAttr) {
                                            featureList.push(features[j]);
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
                return featureList;
            },
            /**
             * 获取layer中所有包含某一属性值的feature
             * @param prop feature的属性值
             * @param layer 矢量图层
             * @returns {Array}
             */
            getFeaturesByPropInLayer: function (prop, layer) {
                var featureList = [];
                if (layer instanceof ol.layer.Vector) {
                    var features = layer.getSource().getFeatures();
                    for (var i = 0, featureLen = features.length; i < featureLen; i++) {
                        if (mapTools.hasValue(features[i], prop)) {
                            featureList.push(features[i]);
                        }
                    }
                }
                return featureList;
            },
            /**
             * 获取layer中所有包含某一相似属性值的feature
             * @param prop 相似属性值，只能为string类型
             * @param layer 矢量图层
             * @returns {Array}
             */
            getFeaturesBySimilarPropInLayer: function (prop, layer) {
                var featureList = [];
                if (layer instanceof ol.layer.Vector) {
                    var features = layer.getSource().getFeatures();
                    for (var i = 0, featureLen = features.length; i < featureLen; i++) {
                        if (mapTools.hasSimilarValue(features[i], prop)) {
                            featureList.push(features[i]);
                        }
                    }
                }
                return featureList;
            },
            //通过lineMapNumber获取此图层中所有相关feature
            getFeaturesByLineMapNumberInLayer: function (lineMapNumber, layer) {
                var featureList = [];
                var minAttr = lineMapNumber * 100;
                var maxAttr = (lineMapNumber + 1) * 100;
                if (layer instanceof ol.layer.Vector) {
                    var features = layer.getSource().getFeatures();
                    for (var i = 0, featureLen = features.length; i < featureLen; i++) {
                        if (mapTools.hasKey(features[i], "attr3")) {
                            if (features[i].get("attr3") >= minAttr && features[i].get("attr3") < maxAttr) {
                                featureList.push(features[i]);
                            }
                        }
                    }
                }
                return featureList;
            },
            /**
             * 获取map中所有包含某一属性值的layer
             * @param prop layer的属性值
             * @param map 地图容器
             * @returns {Array}
             */
            getLayersByPropInMap: function (prop, map) {
                var layerList = [];
                var layers = map.getLayers().getArray();
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (layers[i] instanceof ol.layer.Vector) {
                        if (mapTools.hasValue(layers[i], prop)) {
                            layerList.push(layers[i]);
                        }
                    }
                }
                return layerList;
            },
            /**
             * 将对象数组进行排序
             * @param propName 对象属性名
             * @returns {Function}
             */
            compare: function (propName) {
                return function (obj1, obj2) {
                    var val1 = obj1[propName];
                    var val2 = obj2[propName];
                    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                        val1 = Number(val1);
                        val2 = Number(val2);
                    }
                    if (val1 < val2) {
                        return -1;
                    } else if (val1 > val2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
            //将featureList按照某一属性名进行排序
            sortFeatureListByPropName: function (featureList, propName) {
                var s;
                for (var i = 1; i < featureList.length; i++) {
                    for (var j = i; j > 0; j--) {
                        if (mapTools.hasKey(featureList[j], propName)) {
                            if (featureList[j].get(propName) < featureList[j - 1].get(propName)) {
                                s = featureList[j];
                                featureList[j] = featureList[j - 1];
                                featureList[j - 1] = s;
                            }
                        }
                    }
                }
                return featureList;
            },
            //移除featureList中包含某一属性值的feature
            removeFeatureByPropInFeatureList: function (prop, features) {
                var featureList = [];
                for (var i = 0; i < features.length; i++) {
                    if (!mapTools.hasValue(features[i], prop)) {
                        featureList.push(features[i]);
                    }
                }
                return featureList;
            },
            // 通过属性值获取相对应的feature
            getFeaturesByPropInMap: function (propName, prop, map) {
                var featureList = [];
                var layers = map.getLayers().getArray();
                for (var i = 0, len = layers.length; i < len; i++) {
                    if (layers[i] instanceof ol.layer.Vector) {
                        var features = layers[i].getSource().getFeatures();
                        for (var j = 0, featureLen = features.length; j < featureLen; j++) {
                            var props = features[j].getProperties();
                            for (var key in props) {
                                if (!props.hasOwnProperty(key)) continue;
                                if (key === propName && props[key] === prop) {
                                    featureList.push(features[j]);
                                }
                            }
                        }
                    }
                }
                return featureList;
            },
            //通过属性值获取featureList中相对应的feature
            getFeatureByPropInFeatureList: function (propName, prop, featureList) {
                for (var i = 0, featureLen = featureList.length; i < featureLen; i++) {
                    var props = featureList[i].getProperties();
                    for (var key in props) {
                        if (!props.hasOwnProperty(key)) continue;
                        if (key === propName && props[key] === prop) {
                            return featureList[i];
                        }
                    }
                }
            },
            //通过属性值获取featureList中相对应的feature
            getFeaturesByPropInFeatureList: function (propName, prop, features) {
                var featureList = [];
                for (var i = 0, featureLen = features.length; i < featureLen; i++) {
                    var props = features[i].getProperties();
                    for (var key in props) {
                        if (!props.hasOwnProperty(key)) continue;
                        if (key === propName && props[key] === prop) {
                            featureList.push(features[i]);
                        }
                    }
                }
                return featureList;
            }
        };
        return mapTools;
    }
)(window.mapTools || {});