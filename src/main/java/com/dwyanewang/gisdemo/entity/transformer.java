package com.dwyanewang.gisdemo.entity;


import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;

public class transformer {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String ewmbh;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String byqbh;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String byqmc;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String sblx;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String byqxz;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String azfs;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String ssgt;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private long ssxl;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String xh;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private long edrl;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String tqbh;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String dydj;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal posX;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BigDecimal posY;

    @JsonInclude(JsonInclude.Include.NON_NULL)


    public String getEwmbh() {
        return ewmbh;
    }

    public void setEwmbh(String ewmbh) {
        this.ewmbh = ewmbh;
    }


    public String getByqbh() {
        return byqbh;
    }

    public void setByqbh(String byqbh) {
        this.byqbh = byqbh;
    }


    public String getByqmc() {
        return byqmc;
    }

    public void setByqmc(String byqmc) {
        this.byqmc = byqmc;
    }


    public String getSblx() {
        return sblx;
    }

    public void setSblx(String sblx) {
        this.sblx = sblx;
    }


    public String getByqxz() {
        return byqxz;
    }

    public void setByqxz(String byqxz) {
        this.byqxz = byqxz;
    }


    public String getAzfs() {
        return azfs;
    }

    public void setAzfs(String azfs) {
        this.azfs = azfs;
    }


    public String getSsgt() {
        return ssgt;
    }

    public void setSsgt(String ssgt) {
        this.ssgt = ssgt;
    }


    public long getSsxl() {
        return ssxl;
    }

    public void setSsxl(long ssxl) {
        this.ssxl = ssxl;
    }


    public String getXh() {
        return xh;
    }

    public void setXh(String xh) {
        this.xh = xh;
    }


    public long getEdrl() {
        return edrl;
    }

    public void setEdrl(long edrl) {
        this.edrl = edrl;
    }


    public String getTqbh() {
        return tqbh;
    }

    public void setTqbh(String tqbh) {
        this.tqbh = tqbh;
    }


    public String getDydj() {
        return dydj;
    }

    public void setDydj(String dydj) {
        this.dydj = dydj;
    }


    public BigDecimal getPosX() {
        return posX;
    }

    public void setPosX(BigDecimal posX) {
        this.posX = posX;
    }

    public BigDecimal getPosY() {
        return posY;
    }

    public void setPosY(BigDecimal posY) {
        this.posY = posY;
    }
}
