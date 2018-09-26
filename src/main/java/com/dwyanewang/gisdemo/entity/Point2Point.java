package com.dwyanewang.gisdemo.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;

/**
 * 器件实体类
 */
public class Point2Point {
    /**
     * 电源点二维码编号
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String distnPos;
    /**
     * 电源点经度坐标
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal distn_x;
    /**
     * 电源点纬度坐标
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal distn_y;
    /**
     * 器件经度坐标
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal pos_x;
    /**
     * 器件纬度坐标
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal pos_y;
    /**
     * 器件二维码编号
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String number;
    /**
     * 器件名称
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String name;
    /**
     * 器件状态
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer status;
    /**
     * 器件类型，有变电站、开关、变压器、故障指示器、配电房、环网箱、开闭所、杆塔
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String type;
    /**
     * 器件属性一,开关（联络开关，分段开关、分支开关），变压器（公变、专变），其他为null
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String attr1;
    /**
     * 器件属性二，可选（器件自己的编号）
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String attr2;
    /**
     * 器件属性三,可选（所属线路）
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String attr3;

    public String getDistnPos() {
        return distnPos;
    }

    public void setDistnPos(String distnPos) {
        this.distnPos = distnPos;
    }

    public BigDecimal getDistn_x() {
        return distn_x;
    }

    public void setDistn_x(BigDecimal distn_x) {
        this.distn_x = distn_x;
    }

    public BigDecimal getDistn_y() {
        return distn_y;
    }

    public void setDistn_y(BigDecimal distn_y) {
        this.distn_y = distn_y;
    }

    public BigDecimal getPos_x() {
        return pos_x;
    }

    public void setPos_x(BigDecimal pos_x) {
        this.pos_x = pos_x;
    }

    public BigDecimal getPos_y() {
        return pos_y;
    }

    public void setPos_y(BigDecimal pos_y) {
        this.pos_y = pos_y;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
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

    public String getAttr3() {
        return attr3;
    }

    public void setAttr3(String attr3) {
        this.attr3 = attr3;
    }
}
