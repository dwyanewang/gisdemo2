package com.dwyanewang.gisdemo.entity;


import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

public class Line {
    /**
     * 线路编号
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long number;
    /**
     * 线路名称
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String name;
    /**
     * 线路状态
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long status;
    /**
     * 线路类型，有10kV、35kV、110kV、220kV
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String type;
    /**
     * 线路属性一，可选
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String attr1;
    /**
     * 线路属性二，可选
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String attr2;
    /**
     * 线路属性三，可选（所属线路）
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long attr3;
    /**
     * 线路所包含坐标
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List coordinates;

    /**
     * 线路所包含坐标
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String startTower;

    public Long getNumber() {
        return number;
    }

    public void setNumber(Long number) {
        this.number = number;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAttr1() {
        return attr1;
    }

    public void setAttr1(String attr1) {
        this.attr1 = attr1;
    }

    public String getAttr2() {
        return attr2;
    }

    public void setAttr2(String attr2) {
        this.attr2 = attr2;
    }

    public Long getAttr3() {
        return attr3;
    }

    public void setAttr3(Long attr3) {
        this.attr3 = attr3;
    }

    public List getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List coordinates) {
        this.coordinates = coordinates;
    }

    public String getStartTower() {
        return startTower;
    }

    public void setStartTower(String startTower) {
        this.startTower = startTower;
    }
}
