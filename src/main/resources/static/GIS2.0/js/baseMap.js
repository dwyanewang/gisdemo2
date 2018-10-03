/**
 * FileName: baseMap.js
 * Author: Dwyanewang
 * CreateTime: 2018/8/30 15:31
 */
var baseMap = (function (baseMap) {
    "use strict";
    var tian_di_tu_road_layer = new ol.layer.Tile({
        projection: ol.proj.get('EPSG:4326'),
        name: "天地图路网",
        source: new ol.source.XYZ({
            url: "http://t5.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
        })
    });
    var tian_di_tu_annotation = new ol.layer.Tile({
        projection: ol.proj.get('EPSG:4326'),
        name: "底图标注",
        source: new ol.source.XYZ({
            url: 'http://t5.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
        })
    });
    var tian_di_tu_satellite_layer = new ol.layer.Tile({
        projection: ol.proj.get('EPSG:4326'),
        name: "天地图卫星图层",
        source: new ol.source.XYZ({
            url: 'http://t5.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}'
        })
    });
    // var temporaryVector = new ol.layer.Vector({
    //     name: "temporaryVector",
    //     source: new ol.source.Vector({})
    // });
    var baseLayers = new ol.Collection();
    var LayerGroup = new ol.layer.Group({
        name: "baseMap",
        extent: [113.70559639, 30.17421507, 114.14112340, 30.40094069]
    });
    baseMap = {
        map: function () {
            var defaultValues = {
                target: "mapCon",
                maxZoom: 19,
                minZoom: 13,
                zoom: 13,
                center: [113.92335990, 30.28757788],
                // center: [113.92689, 30.28773],
                // 是否显示卫星地图
                isLoadSatellite: false,
                // 是否显示全屏，默认显示全屏
                isFullScreen: true,
                // 是否显示复位，默认显示复位
                isZoomToExtent: true,
                // 是否显示比例尺，默认显示比例尺
                isScaleLine: true,
                //是否显示鹰眼，默认不显示鹰眼
                isOverviewMap: false,
                // 是否显示旋转，默认显示旋转，按下shift+鼠标左键，地图可旋转
                isRotate: true
            };
            var params = arguments[0];
            for (var prop in params) {
                if (!params.hasOwnProperty(prop)) continue;
                defaultValues[prop] = params[prop];
            }
            // 添加基本图层
            var map = new ol.Map({
                    target: defaultValues.target,
                    interactions: ol.interaction.defaults({
                        doubleClickZoom: false
                    }),
                    view: new ol.View({
                        projection: 'EPSG:4326',
                        maxZoom: defaultValues.maxZoom,
                        minZoom: defaultValues.minZoom,
                        zoom: defaultValues.zoom,
                        center: defaultValues.center
                    })
                })
            ;
            // 加载天地图
            defaultValues.isLoadSatellite ? baseLayers.push(tian_di_tu_satellite_layer) : baseLayers.push(tian_di_tu_road_layer);
            baseLayers.push(tian_di_tu_annotation);
            LayerGroup.setLayers(baseLayers);
            map.setLayerGroup(LayerGroup);

            // 添加临时图层
            // map.addLayer(temporaryVector);

            //添加基本控件
            map.getControls().clear();
            map.addControl(new ol.control.Zoom({
                zoomInTipLabel: "放大",
                zoomOutTipLabel: "缩小"
            }));
            defaultValues.isFullScreen && map.addControl(new ol.control.FullScreen({
                tipLabel: "全屏"
            }));
            defaultValues.isZoomToExtent && map.addControl(new ol.control.ZoomToExtent({
                tipLabel: "复位",
                extent: [113.70559639, 30.17421507, 114.14112340, 30.40094069]
            }));
            defaultValues.isScaleLine && map.addControl(new ol.control.ScaleLine());
            defaultValues.isOverviewMap && map.addControl(new ol.control.OverviewMap({
                tipLabel: "鹰眼"
            }));
            if (defaultValues.isRotate) {
                map.addControl(new ol.control.Rotate({
                    label: "\u2B99"
                }));
                map.addInteraction(new ol.interaction.DragRotateAndZoom());
            }
            // map.addControl(new ol.control.MousePosition());
            /**
             * 为map添加鼠标移动事件监听，当指向标注时改变鼠标光标状态
             */
            map.on('pointermove', function (e) {
                var pixel = map.getEventPixel(e.originalEvent);
                var hit = map.hasFeatureAtPixel(pixel,function (layer) {
                    // console.log(layer.getProperties());
                    return !mapTools.hasSimilarValue(layer, "变压器专线");

                });
                map.getTargetElement().style.cursor = hit ? 'pointer' : '';
            });
            return map;
        }
    };
    return baseMap;
})(window.baseMap || {});