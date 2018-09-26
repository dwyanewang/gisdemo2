package com.dwyanewang.gisdemo.service;

import com.dwyanewang.gisdemo.entity.transformer;
import com.dwyanewang.gisdemo.entity.Point2Point;

import java.util.List;

public interface PositionService {
    List<transformer> transformerList();
    List<Point2Point> transformerPosition();
    Point2Point distnPos(String number);
}
