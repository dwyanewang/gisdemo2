package com.dwyanewang.gisdemo.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;

/**
 * 器件实体类
 */
public class Point2Point {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String distnPos;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal distn_x;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal distn_y;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal pos_x;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal pos_y;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String number;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String name;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer status;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String attr1;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String attr2;
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
