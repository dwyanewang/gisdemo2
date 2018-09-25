package com.dwyanewang.gisdemo.dao;

import org.apache.ibatis.jdbc.SQL;

public class SQLProvider {
    public String select(String number) {
        if (number.contains("HWX")) {
            return new SQL() {{
                SELECT("POS_X as distn_x", "POS_Y as distn_y");
                FROM("h_sb_hwx");
                WHERE("HWXBH =" + "'" + number + "'");
            }}.toString();
        } else if (number.contains("KBS")) {
            return new SQL() {{
                SELECT("POS_X as distn_x", "POS_Y as distn_y");
                FROM("h_sb_kbs");
                WHERE("KBSBH =" + "'" + number + "'");
            }}.toString();
        } else {
            return new SQL() {{
                SELECT("POS_X as distn_x", "POS_Y as distn_y");
                FROM("h_sb_gt");
                WHERE("GTBH =" + "'" + number + "'");
            }}.toString();
        }
    }
}
