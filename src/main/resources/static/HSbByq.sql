-- auto Generated on 2018-09-25 14:44:41 
-- DROP TABLE IF EXISTS `h_sb_byq`; 
CREATE TABLE h_sb_byq(
    `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'id',
    `ewmbh` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'ewmbh',
    `byqbh` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'byqbh',
    `byqmc` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'byqmc',
    `sblx` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'sblx',
    `byqxz` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'byqxz',
    `azfs` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'azfs',
    `ssgt` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'ssgt',
    `ssxl` BIGINT NOT NULL DEFAULT -1 COMMENT 'ssxl',
    `xh` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'xh',
    `edrl` BIGINT NOT NULL DEFAULT -1 COMMENT 'edrl',
    `tqbh` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'tqbh',
    `dydj` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'dydj',
    `pos_x` DECIMAL(14,4) NOT NULL DEFAULT 0 COMMENT 'posX',
    `pos_y` DECIMAL(14,4) NOT NULL DEFAULT 0 COMMENT 'posY',
    PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT 'h_sb_byq';