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
            return mapTools.duplicate(featureNameList, defaultValues.featureType[1]);
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
         * @returns {T|number|*}
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
                        var featureCoordinates = features[j].getGeometry().getCoordinates();
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
         * 判断feature是否存在prop这一属性值
         * @param feature 点或线要素
         * @param prop 属性值
         * @returns {boolean}
         */
        isTypeOfFeatureByProp: function (feature, prop) {
            if (feature !== undefined) {
                var props = feature.getProperties();
                for (var key in props) {
                    if (!props.hasOwnProperty(key)) continue;
                    if (props[key] === prop) {
                        return true;
                    }
                }
                return false;
            }
        },
        /**
         * 判断feature是否存在propName这一属性
         * @param feature 点或线要素
         * @param propName 属性名
         * @returns {boolean}
         */
        isTypeOfFeatureByPropName: function (feature, propName) {
            if (feature !== undefined) {
                var props = feature.getProperties();
                console.log(props);
                for (var key in props) {
                    if (!props.hasOwnProperty(key)) continue;
                    if (key === propName) {
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
                case "10kv":
                    feature.getStyle().getStroke().setColor("#3ca945");
                    feature.getStyle().getStroke().setWidth(2);
                    feature.changed();
                    break;
                case "35kv":
                    feature.getStyle().getStroke().setColor("#0000CD");
                    feature.getStyle().getStroke().setWidth(2);
                    feature.changed();
                    break;
                case "110kv":
                    feature.getStyle().getStroke().setColor("#EE7600");
                    feature.getStyle().getStroke().setWidth(2);
                    feature.changed();
                    break;
                case "220kv":
                    feature.getStyle().getStroke().setColor("#4A4A4A");
                    feature.getStyle().getStroke().setWidth(2);
                    feature.changed();
                    break;
                case "专线":
                    feature.getStyle().getStroke().setColor("#3ca945");
                    feature.getStyle().getStroke().setWidth(2);
                    feature.changed();
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
        }
    };
    return mapTools;
})(window.mapTools || {});