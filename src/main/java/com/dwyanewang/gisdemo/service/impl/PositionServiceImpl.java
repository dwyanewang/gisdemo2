package com.dwyanewang.gisdemo.service.impl;

import com.dwyanewang.gisdemo.dao.PositionMapper;
import com.dwyanewang.gisdemo.entity.Line;
import com.dwyanewang.gisdemo.entity.LineMap;
import com.dwyanewang.gisdemo.entity.transformer;
import com.dwyanewang.gisdemo.entity.Point2Point;
import com.dwyanewang.gisdemo.service.PositionService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.LinkedList;
import java.util.List;

@Service
public class PositionServiceImpl implements PositionService {
    @Resource
    private PositionMapper positionMapper;


    @Override
    public List<transformer> transformerList() {
        return positionMapper.transformerList();
    }

    @Override
    public List<Point2Point> transformerPosition() {
        return positionMapper.transformerPosition();
    }

    @Override
    public Point2Point distnPos(String number) {
        return positionMapper.distnPos(number);
    }

    @Override
    public List<Point2Point> ringMainUnitPosition() {
        return positionMapper.ringMainUnitPosition();
    }

    @Override
    public List<Point2Point> powerDistributionRoomPosition() {
        return positionMapper.powerDistributionRoomPosition();
    }

    @Override
    public List<Point2Point> subSectionPostPosition() {
        return positionMapper.subSectionPostPosition();
    }

    @Override
    public List<Point2Point> switchPosition() {
        return positionMapper.switchPosition();
    }

    @Override
    public List<LineMap> linemapList() {
        return positionMapper.linemapList();
    }

    @Override
    public List<Line> getlineListByLineMapNumber(long lineMapNumber) {
        return positionMapper.getlineListByLineMapNumber(lineMapNumber);
    }

    @Override
    public LinkedList<Point2Point> getTowerPositionByLineNumber(long lineNumber) {
        return positionMapper.getTowerPositionByLineNumber(lineNumber);
    }

    @Override
    public List<Point2Point> towerPosition() {
        return positionMapper.towerPosition();
    }
}
