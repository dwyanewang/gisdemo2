package com.dwyanewang.gisdemo.service.impl;

import com.dwyanewang.gisdemo.dao.PositionMapper;
import com.dwyanewang.gisdemo.entity.transformer;
import com.dwyanewang.gisdemo.entity.Point2Point;
import com.dwyanewang.gisdemo.service.PositionService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
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
}
