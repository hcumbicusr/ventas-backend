/*
Navicat MySQL Data Transfer

Source Server         : LOCALHOST:3306
Source Server Version : 50731
Source Host           : localhost:3306
Source Database       : nodejs_ventas

Target Server Type    : MYSQL
Target Server Version : 50731
File Encoding         : 65001

Date: 2022-03-21 11:58:53
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for api_permisos
-- ----------------------------
DROP TABLE IF EXISTS `api_permisos`;
CREATE TABLE `api_permisos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `permiso` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_permiso` (`permiso`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of api_permisos
-- ----------------------------
INSERT INTO `api_permisos` VALUES ('1', 'create');
INSERT INTO `api_permisos` VALUES ('4', 'delete');
INSERT INTO `api_permisos` VALUES ('2', 'read');
INSERT INTO `api_permisos` VALUES ('3', 'update');

-- ----------------------------
-- Table structure for api_privilegios
-- ----------------------------
DROP TABLE IF EXISTS `api_privilegios`;
CREATE TABLE `api_privilegios` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rol_id` int(11) unsigned NOT NULL,
  `ruta_id` int(11) unsigned NOT NULL,
  `permiso_id` int(11) unsigned NOT NULL,
  `sucursal_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_rol` (`rol_id`),
  KEY `fk_ruta` (`ruta_id`),
  KEY `fk_permiso` (`permiso_id`),
  KEY `fk_sucursal` (`sucursal_id`),
  CONSTRAINT `fk_api_privilegios_permiso_id` FOREIGN KEY (`permiso_id`) REFERENCES `api_permisos` (`id`),
  CONSTRAINT `fk_api_privilegios_rol_id` FOREIGN KEY (`rol_id`) REFERENCES `api_roles` (`id`),
  CONSTRAINT `fk_api_privilegios_ruta_id` FOREIGN KEY (`ruta_id`) REFERENCES `api_rutas` (`id`),
  CONSTRAINT `fk_api_privilegios_sucursal_id` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of api_privilegios
-- ----------------------------
INSERT INTO `api_privilegios` VALUES ('1', '1', '1', '1', '1');
INSERT INTO `api_privilegios` VALUES ('2', '1', '1', '2', '1');
INSERT INTO `api_privilegios` VALUES ('3', '1', '1', '3', '1');
INSERT INTO `api_privilegios` VALUES ('4', '1', '1', '4', '1');

-- ----------------------------
-- Table structure for api_roles
-- ----------------------------
DROP TABLE IF EXISTS `api_roles`;
CREATE TABLE `api_roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rol` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_rol` (`rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of api_roles
-- ----------------------------
INSERT INTO `api_roles` VALUES ('1', 'Administrador');
INSERT INTO `api_roles` VALUES ('3', 'Invitado');
INSERT INTO `api_roles` VALUES ('2', 'Usuario');

-- ----------------------------
-- Table structure for api_rutas
-- ----------------------------
DROP TABLE IF EXISTS `api_rutas`;
CREATE TABLE `api_rutas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ruta` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_ruta` (`ruta`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of api_rutas
-- ----------------------------
INSERT INTO `api_rutas` VALUES ('2', '/almacen');
INSERT INTO `api_rutas` VALUES ('5', '/comprobante');
INSERT INTO `api_rutas` VALUES ('3', '/producto');
INSERT INTO `api_rutas` VALUES ('1', '/user');
INSERT INTO `api_rutas` VALUES ('4', '/venta');

-- ----------------------------
-- Table structure for auth
-- ----------------------------
DROP TABLE IF EXISTS `auth`;
CREATE TABLE `auth` (
  `user_id` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `rol` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  UNIQUE KEY `user_id` (`user_id`) USING BTREE,
  KEY `rol` (`rol`),
  CONSTRAINT `auth_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `auth_ibfk_2` FOREIGN KEY (`rol`) REFERENCES `api_roles` (`rol`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of auth
-- ----------------------------
INSERT INTO `auth` VALUES ('85rulh8MWwMs3oMcVT6M8', 'admin', 'Administrador', '$2b$05$d9mb2mNZLd5PPEWqUyuIEOlq8cduYui3fFDgRd3PpVb11dGDTVlCi');

-- ----------------------------
-- Table structure for cajas
-- ----------------------------
DROP TABLE IF EXISTS `cajas`;
CREATE TABLE `cajas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `caja` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `sucursal_id` int(11) unsigned NOT NULL,
  `active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `sucursal_id` (`sucursal_id`),
  CONSTRAINT `cajas_ibfk_1` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of cajas
-- ----------------------------
INSERT INTO `cajas` VALUES ('1', 'Caja 1', '1', '1');

-- ----------------------------
-- Table structure for clientes
-- ----------------------------
DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `tipo_documento` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'DNI',
  `numero_documento` varchar(20) COLLATE utf8_unicode_ci NOT NULL DEFAULT '00000000',
  `telefono` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `direccion` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tipo_num_doc` (`tipo_documento`,`numero_documento`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of clientes
-- ----------------------------

-- ----------------------------
-- Table structure for empresa
-- ----------------------------
DROP TABLE IF EXISTS `empresa`;
CREATE TABLE `empresa` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ruc` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `razon_social` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  `representante_legal` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of empresa
-- ----------------------------
INSERT INTO `empresa` VALUES ('1', '10703536064', 'Henry C', 'Henry Cumbicus', '1');

-- ----------------------------
-- Table structure for jornada
-- ----------------------------
DROP TABLE IF EXISTS `jornada`;
CREATE TABLE `jornada` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fechahora_inicio` datetime(6) NOT NULL,
  `fechahora_fin` datetime(6) DEFAULT NULL,
  `monto_apertura` decimal(8,2) NOT NULL,
  `monto_cierre` decimal(8,2) DEFAULT NULL,
  `user_id_inicio` varchar(32) NOT NULL,
  `user_id_fin` varchar(32) DEFAULT NULL,
  `caja_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `caja_id` (`caja_id`),
  CONSTRAINT `jornada_ibfk_1` FOREIGN KEY (`caja_id`) REFERENCES `cajas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of jornada
-- ----------------------------

-- ----------------------------
-- Table structure for jornada_detalle
-- ----------------------------
DROP TABLE IF EXISTS `jornada_detalle`;
CREATE TABLE `jornada_detalle` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `venta_id` int(11) DEFAULT NULL,
  `egreso_id` int(11) DEFAULT NULL,
  `monto` decimal(10,4) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `descripcion` varchar(250) DEFAULT NULL,
  `user_id` varchar(32) NOT NULL,
  `jornada_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jornada_id` (`jornada_id`),
  CONSTRAINT `jornada_detalle_ibfk_1` FOREIGN KEY (`jornada_id`) REFERENCES `jornada` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of jornada_detalle
-- ----------------------------

-- ----------------------------
-- Table structure for productos
-- ----------------------------
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `serie` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nombre` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8_unicode_ci,
  `img_portada` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `precio_compra` decimal(10,4) DEFAULT NULL,
  `precio_venta` decimal(10,4) DEFAULT NULL,
  `active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of productos
-- ----------------------------

-- ----------------------------
-- Table structure for sucursal
-- ----------------------------
DROP TABLE IF EXISTS `sucursal`;
CREATE TABLE `sucursal` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `empresa_id` int(10) unsigned NOT NULL,
  `sucursal` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  `encargado` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `empresa_id` (`empresa_id`),
  CONSTRAINT `sucursal_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sucursal
-- ----------------------------
INSERT INTO `sucursal` VALUES ('1', '1', 'Henry C', 'HCR', '1');

-- ----------------------------
-- Table structure for tipo_comprobante
-- ----------------------------
DROP TABLE IF EXISTS `tipo_comprobante`;
CREATE TABLE `tipo_comprobante` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `letra_inicial` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `codigo_sunat` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `descripcion` (`descripcion`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of tipo_comprobante
-- ----------------------------
INSERT INTO `tipo_comprobante` VALUES ('1', 'TICKET', 'T', null);
INSERT INTO `tipo_comprobante` VALUES ('2', 'BOLETA', 'B', '003');
INSERT INTO `tipo_comprobante` VALUES ('3', 'FACTURA', 'F', '001');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastname` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `active` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('85rulh8MWwMs3oMcVT6M8', 'admin', 'admin', 'Administrador', '', '', '1', '2022-03-21 16:53:44', null);

-- ----------------------------
-- Table structure for venta
-- ----------------------------
DROP TABLE IF EXISTS `venta`;
CREATE TABLE `venta` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sub_total` decimal(10,4) DEFAULT NULL,
  `descuento_porcentual` decimal(10,4) DEFAULT NULL,
  `descuento_monto` decimal(10,4) DEFAULT NULL,
  `total_con_descuento` decimal(10,4) NOT NULL,
  `igv` decimal(10,4) NOT NULL,
  `igv_monto` decimal(10,4) NOT NULL,
  `total_con_igv` decimal(10,4) NOT NULL,
  `tipo_pago` varchar(50) NOT NULL,
  `cliente_id` int(11) unsigned NOT NULL,
  `sucursal_id` int(11) unsigned NOT NULL,
  `fecha_hora_inicio` datetime DEFAULT NULL,
  `fecha_hora_fin` datetime DEFAULT NULL,
  `letra_serie_comprobante` varchar(4) DEFAULT NULL,
  `numero_serie_comprobante` varchar(10) DEFAULT NULL,
  `user_id` varchar(32) NOT NULL,
  `tipo_comprobante_id` int(11) unsigned DEFAULT NULL,
  `total_en_letras` text,
  `activo` int(10) NOT NULL DEFAULT '1',
  `pagado` int(11) NOT NULL DEFAULT '0',
  `monto_de_pago` decimal(10,4) DEFAULT NULL,
  `vuelto` decimal(10,4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sucursal_id` (`sucursal_id`),
  KEY `tipo_comprobante_id` (`tipo_comprobante_id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursal` (`id`),
  CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`tipo_comprobante_id`) REFERENCES `tipo_comprobante` (`id`),
  CONSTRAINT `venta_ibfk_3` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of venta
-- ----------------------------

-- ----------------------------
-- Table structure for venta_detalle
-- ----------------------------
DROP TABLE IF EXISTS `venta_detalle`;
CREATE TABLE `venta_detalle` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `venta_id` int(11) unsigned NOT NULL,
  `producto_id` int(11) unsigned NOT NULL,
  `cantidad` decimal(10,4) NOT NULL,
  `precio_con_igv` decimal(10,4) NOT NULL,
  `precio_sin_igv` decimal(10,4) NOT NULL,
  `sub_total` decimal(10,4) NOT NULL,
  `descuento` decimal(10,4) NOT NULL,
  `total_con_descuento` decimal(10,4) NOT NULL,
  `igv_monto` decimal(10,4) NOT NULL,
  `total_final` decimal(10,4) NOT NULL,
  `is_oferta` int(11) NOT NULL DEFAULT '0',
  `oferta_id` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `venta_id` (`venta_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `venta_detalle_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id`),
  CONSTRAINT `venta_detalle_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of venta_detalle
-- ----------------------------
