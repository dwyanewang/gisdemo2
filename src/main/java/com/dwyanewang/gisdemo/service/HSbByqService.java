package com.dwyanewang.gisdemo.service;

import com.dwyanewang.gisdemo.entity.HSbByq;
import com.dwyanewang.gisdemo.entity.Point2Point;

import java.util.List;

public interface HSbByqService {
    List<HSbByq> list();
    List<Point2Point> subList();
    Point2Point distnPos(String number);
}
