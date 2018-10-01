package com.dwyanewang.gisdemo.entity;


public class LineMap {

  private long id;
  private long lineMapNumber;
  private String lineMapName;
  private String distnPos;


  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public long getLineMapNumber() {
    return lineMapNumber;
  }

  public void setLineMapNumber(long lineMapNumber) {
    this.lineMapNumber = lineMapNumber;
  }

  public String getLineMapName() {
    return lineMapName;
  }

  public void setLineMapName(String lineMapName) {
    this.lineMapName = lineMapName;
  }

  public String getDistnPos() {
    return distnPos;
  }

  public void setDistnPos(String distnPos) {
    this.distnPos = distnPos;
  }
}
