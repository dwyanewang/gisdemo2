package com.dwyanewang.gisdemo.dao;


import com.dwyanewang.gisdemo.entity.Line;
import com.dwyanewang.gisdemo.entity.LineMap;
import com.dwyanewang.gisdemo.entity.transformer;
import com.dwyanewang.gisdemo.entity.Point2Point;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.LinkedList;
import java.util.List;

@Mapper
public interface PositionMapper {
    /**
     * 通过器件的电源点编号查询该电源点的坐标
     *
     * @param number 电源点编号
     * @return Point2Point
     */
    @SelectProvider(type = SQLProvider.class, method = "select")
    Point2Point distnPos(String number);

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
            "  BYQBH AS name,\n" +
            "  BYQXZ AS attr1,\n" +
            "  BYQMC AS attr2,\n" +
            "  SSXL AS attr3,\n" +
            "  SSGT  AS distnPos,\n" +
            "  POS_X AS pos_x,\n" +
            "  POS_Y AS pos_y\n" +
            "from h_sb_byq")
    List<Point2Point> transformerPosition();


    //TODO 2、环网箱相关SQL
    @Select("select\n" +
            "  HWXBH as number,\n" +
            "  HWXMC as name,\n" +
            "  ZFLX  as type,\n" +
            "  DYD   as distnPos,\n" +
            "  SSXL as attr3,\n" +
            "  POS_X as pos_x,\n" +
            "  POS_Y as pos_y\n" +
            "from h_sb_hwx")
    List<Point2Point> ringMainUnitPosition();

    //TODO 3、配电房相关SQL
    @Select("select\n" +
            "  PDFBH as number,\n" +
            "  PDFMC as name,\n" +
            "  ZFLX  as type,\n" +
            "  DYD   as distnPos,\n" +
            "  SSXL as attr3,\n" +
            "  POS_X as pos_x,\n" +
            "  POS_Y as pos_y\n" +
            "from h_sb_pdf")
    List<Point2Point> powerDistributionRoomPosition();

    //TODO 4、开闭所相关SQL
    @Select("select\n" +
            "  KBSBH as number,\n" +
            "  KBSMC as name,\n" +
            "  ZFLX  as type,\n" +
            "  DYD   as distnPos,\n" +
            "  SSXL as attr3,\n" +
            "  POS_X as pos_x,\n" +
            "  POS_Y as pos_y\n" +
            "from h_sb_kbs")
    List<Point2Point> subSectionPostPosition();

    //TODO 5、开关相关SQL
    @Select("select\n" +
            "  KGBH as number,\n" +
            "  KGMC as name,\n" +
            "  KGZT  as status,\n" +
            "  KGLX  as attr1,\n" +
            "  SSXL as attr3,\n" +
            "  POS_X as pos_x,\n" +
            "  POS_Y as pos_y\n" +
            "from h_sb_kg")
    List<Point2Point> switchPosition();

    //TODO 6、线路相关SQL
    @Select("select\n" +
            "  XLTID as lineMapNumber,\n" +
            "  XLTMC as lineMapName,\n" +
            "  DYD as distnPos\n" +
            "from h_xlt")
    List<LineMap> linemapList();

    @Select("select\n" +
            "  XLID   as number,\n" +
            "  XLMC   as name,\n" +
            "  XLLX   as attr1,\n" +
            "  SSXLID as attr3,\n" +
            "  DYDJ   as type,\n" +
            "  QSGT   as startTower\n" +
            "from h_xl\n" +
            "where SSXLTID = #{lineMapNumber}")
    List<Line> getlineListByLineMapNumber(long lineMapNumber);

    @Select("select\n" +
            "  GTBH as number,\n" +
            "  GTMC as name,\n" +
            "  SSXL as attr3,\n" +
            "  POS_X as pos_x,\n" +
            "  POS_Y as pos_y\n" +
            "from h_sb_gt")
    List<Point2Point> towerPosition();

    @Select("select\n" +
            "  POS_X as pos_x,\n" +
            "  POS_Y as pos_y\n" +
            "from h_sb_gt\n" +
            "where SSXL = #{lineNumber}")
    LinkedList<Point2Point> getTowerPositionByLineNumber(long lineNumber);

    //TODO 7、变电站相关SQL

}
