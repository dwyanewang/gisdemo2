package com.dwyanewang.gisdemo.service.impl;

import com.dwyanewang.gisdemo.dao.HSbByqMapper;
import com.dwyanewang.gisdemo.entity.HSbByq;
import com.dwyanewang.gisdemo.entity.Point2Point;
import com.dwyanewang.gisdemo.service.HSbByqService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class HSbByqServiceImpl implements HSbByqService {
    @Resource
    private HSbByqMapper hSbByqMapper;

    @Override
    public List<HSbByq> list() {
        return hSbByqMapper.list();
    }

    @Override
    public List<Point2Point> subList() {
        return hSbByqMapper.subList();
    }

    @Override
    public Point2Point distnPos(String number) {
        return hSbByqMapper.distnPos(number);
    }
}
