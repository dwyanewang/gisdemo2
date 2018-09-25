package com.dwyanewang.gisdemo.controller;

import com.dwyanewang.gisdemo.entity.HSbByq;
import com.dwyanewang.gisdemo.entity.Point2Point;
import com.dwyanewang.gisdemo.service.HSbByqService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
public class HSbByqController {
    @Resource
    private HSbByqService hSbByqService;


    @GetMapping("/api/list")
    public List<HSbByq> list(){
        return hSbByqService.list();
    }

    @GetMapping("/api/sublist")
    public List<Point2Point> subList(){
        List<Point2Point> list = hSbByqService.subList();
        for (Point2Point point : list) {
            point.setDistn_x(hSbByqService.distnPos(point.getDistnPos()).getDistn_x());
            point.setDistn_y(hSbByqService.distnPos(point.getDistnPos()).getDistn_y());
            point.setDistnPos(null);
        }
        return list;
    }

    @GetMapping("/api/get")
    public Point2Point distnPos(String number){
        return hSbByqService.distnPos(number);
    }
}
