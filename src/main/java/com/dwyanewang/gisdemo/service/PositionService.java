package com.dwyanewang.gisdemo.service;

import com.dwyanewang.gisdemo.entity.Line;
import com.dwyanewang.gisdemo.entity.LineMap;
import com.dwyanewang.gisdemo.entity.transformer;
import com.dwyanewang.gisdemo.entity.Point2Point;

import java.util.LinkedList;
import java.util.List;

public interface PositionService {
    List<transformer> transformerList();
    List<Point2Point> transformerPosition();
    Point2Point distnPos(String number);
    List<Point2Point> ringMainUnitPosition();
    List<Point2Point> powerDistributionRoomPosition();
    List<Point2Point> subSectionPostPosition();
    List<Point2Point> switchPosition();
    List<LineMap> linemapList();
    List<Line> getlineListByLineMapNumber(long lineMapNumber);
    LinkedList<Point2Point> getTowerPositionByLineNumber(long lineNumber);
    List<Point2Point> towerPosition();
}
