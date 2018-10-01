package com.dwyanewang.gisdemo.controller;

import com.dwyanewang.gisdemo.entity.Line;
import com.dwyanewang.gisdemo.entity.LineMap;
import com.dwyanewang.gisdemo.entity.transformer;
import com.dwyanewang.gisdemo.entity.Point2Point;
import com.dwyanewang.gisdemo.service.PositionService;
import com.sun.org.apache.bcel.internal.generic.IF_ACMPEQ;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.*;

@RestController
public class PositionController {
    @Resource
    private PositionService positionService;


    @GetMapping("/api/list")
    public List<transformer> transformerList() {
        return positionService.transformerList();
    }

    /**
     * 变压器的相关位置信息
     *
     * @return List<Point2Point>
     */
    @GetMapping("/api/position/transformer")
    public List<Point2Point> transformerPosition() {
        List<Point2Point> list = positionService.transformerPosition();
        for (Point2Point point : list) {
            point.setDistn_x(positionService.distnPos(point.getDistnPos()).getDistn_x());
            point.setDistn_y(positionService.distnPos(point.getDistnPos()).getDistn_y());
            point.setDistnPos(null);
            point.setStatus(0);
            point.setType("变压器");
        }
        return list;
    }

    /**
     * 环网箱的相关位置信息
     *
     * @return List<Point2Point>
     */
    @GetMapping("/api/position/ringMainUnit")
    public List<Point2Point> ringMainUnitPosition() {
        List<Point2Point> list = positionService.ringMainUnitPosition();
        positionList(list);
        return list;
    }

    @GetMapping("/api/position/powerDistributionRoom")
    public List<Point2Point> powerDistributionRoomPosition() {
        List<Point2Point> list = positionService.powerDistributionRoomPosition();
        positionList(list);
        return list;
    }

    @GetMapping("/api/position/subSectionPostPosition")
    public List<Point2Point> subSectionPostPosition() {
        List<Point2Point> list = positionService.subSectionPostPosition();
        positionList(list);
        return list;
    }

    private void positionList(List<Point2Point> list) {
        for (Point2Point point : list) {
            Point2Point distnPos = positionService.distnPos(point.getDistnPos());
            point.setDistn_x(distnPos.getDistn_x());
            point.setDistn_y(distnPos.getDistn_y());
            point.setDistnPos(null);
            point.setStatus(0);
        }
    }

    @GetMapping("/api/position/switchPosition")
    public List<Point2Point> switchPosition() {
        List<Point2Point> list = positionService.switchPosition();
        for (Point2Point point : list) {
            point.setType("开关");
        }
        return list;
    }

    @GetMapping("/api/position/towerPosition")
    public List<Point2Point> towerPosition() {
        List<Point2Point> list = positionService.towerPosition();
        for (Point2Point point : list) {
            point.setType("杆塔");
            point.setStatus(0);
        }
        return list;
    }

    @GetMapping("/api/get")
    public Point2Point distnPos(String number) {
        return positionService.distnPos(number);
    }

    @GetMapping("/api/position/allLinePosition")
    public List<Object> allLinePosition() {
        List<Object> list = new ArrayList<>();
        List<LineMap> lineMapList = positionService.linemapList();
        for (LineMap lineMap : lineMapList) {
            Map<String, Object> map = new HashMap<>();
            map.put("lineMapName", lineMap.getLineMapName());
            map.put("lineMapNumber", lineMap.getLineMapNumber());
            List<Line> lineList = positionService.getlineListByLineMapNumber(lineMap.getLineMapNumber());
            for (Line line : lineList) {
                LinkedList<Point2Point> towersPosition = positionService.getTowerPositionByLineNumber(line.getNumber());
                LinkedList<Object> list1 = new LinkedList<>();
                for (Point2Point point : towersPosition) {
                    LinkedList<Object> list2 = new LinkedList<>();
                    list2.add(point.getPos_x());
                    list2.add(point.getPos_y());
                    list1.add(list2);
                }

                Point2Point startTower = positionService.distnPos(line.getStartTower());
                System.out.println("[" + startTower.getDistn_x() + "," + startTower.getDistn_y() + "]");
                LinkedList<Object> list3 = new LinkedList<>();
                list3.add(startTower.getDistn_x());
                list3.add(startTower.getDistn_y());
                list1.addFirst(list3);
                if (line.getAttr1().equals("2") && line.getStartTower().substring(line.getStartTower().length() - 4).equals("D001")) {
                    Point2Point distnPos = positionService.distnPos(lineMap.getDistnPos());
                    System.out.println("[" + distnPos.getDistn_x() + "," + distnPos.getDistn_y() + "]");
                    LinkedList<Object> list4 = new LinkedList<>();
                    list4.add(distnPos.getDistn_x());
                    list4.add(distnPos.getDistn_y());
                    list1.addFirst(list4);
                }
                line.setCoordinates(list1);
            }
            map.put("sectionLine", lineList);
            list.add(map);
        }
        return list;
    }
}
