package com.dwyanewang.gisdemo.controller;

import com.dwyanewang.gisdemo.entity.transformer;
import com.dwyanewang.gisdemo.entity.Point2Point;
import com.dwyanewang.gisdemo.service.PositionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
public class PositionController {
    @Resource
    private PositionService positionService;


    @GetMapping("/api/list")
    public List<transformer> transformerList(){
        return positionService.transformerList();
    }

    @GetMapping("/api/position/transformer")
    public List<Point2Point> transformerPosition(){
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

    @GetMapping("/api/get")
    public Point2Point distnPos(String number){
        return positionService.distnPos(number);
    }
}
