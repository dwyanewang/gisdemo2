package com.dwyanewang.gisdemo.dao;


import com.dwyanewang.gisdemo.entity.HSbByq;
import com.dwyanewang.gisdemo.entity.Point2Point;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.List;

@Mapper
public interface HSbByqMapper {
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
    List<HSbByq> list();

    @Select("select\n" +
            "  EWMBH AS number,\n" +
            "  BYQMC AS name,\n" +
            "  BYQXZ AS attr1,\n" +
            "  BYQBH AS attr2,\n" +
            "  SSGT  AS distnPos,\n" +
            "  POS_X AS pos_x,\n" +
            "  POS_Y AS pos_y\n" +
            "from h_sb_byq")
    List<Point2Point> subList();

    @SelectProvider(type = SQLProvider.class,method = "select")
    Point2Point distnPos(String number);
}
