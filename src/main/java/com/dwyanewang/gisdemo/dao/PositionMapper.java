package com.dwyanewang.gisdemo.dao;


import com.dwyanewang.gisdemo.entity.transformer;
import com.dwyanewang.gisdemo.entity.Point2Point;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.List;

@Mapper
public interface PositionMapper {
    //TODO  1、变压器相关SQL

    /**
     * 查询变压器所有信息
     *
     * @return List<transformer>
     */
    @Select("select\n" +
            "  EWMBH AS ewmbh,\n" +
            "  BYQBH AS byqbh,\n" +
            "  BYQMC AS byqmc,\n" +
            "  SBLX  AS sblx,\n" +
            "  BYQXZ AS byqxz,\n" +
            "  AZFS  AS azfs,\n" +
            "  SSGT  AS ssgt,\n" +
            "  SSXL  AS ssxl,\n" +
            "  XH AS xh,\n" +
            "  EDRL AS edrl,\n" +
            "  TQBH AS tqbh,\n" +
            "  DYDJ AS dydj,\n" +
            "  POS_X AS posX,\n" +
            "  POS_Y AS posY\n" +
            "from h_sb_byq")
    List<transformer> transformerList();

    /**
     * 查询变压器位置相关信息
     *
     * @return List<Point2Point>
     */
    @Select("select\n" +
            "  EWMBH AS number,\n" +
            "  BYQMC AS name,\n" +
            "  BYQXZ AS attr1,\n" +
            "  BYQBH AS attr2,\n" +
            "  SSXL AS attr3,\n" +
            "  SSGT  AS distnPos,\n" +
            "  POS_X AS pos_x,\n" +
            "  POS_Y AS pos_y\n" +
            "from h_sb_byq")
    List<Point2Point> transformerPosition();

    /**
     * 通过变压器的电源点编号查询该电源点的坐标
     *
     * @param number 电源点编号
     * @return Point2Point
     */
    @SelectProvider(type = SQLProvider.class, method = "select")
    Point2Point distnPos(String number);
}
