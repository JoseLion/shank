/* global malarkey:false, moment:false */
(function() {
  'use strict';

  var Host = "";
  var ApiHost = Host + "api/";
  
  if (location.hostname === 'localhost') {
    Host = "http://localhost:3010/";
    ApiHost = Host + "admin/api/";
  }
  
  angular
    .module('durallantaAdmin')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('Host', Host)
    .constant('ApiHost', ApiHost)
    .constant('Catalog', { //Validate with table catalog on server
      local_type: 'TIPO-LOCALIDAD',
      list_countries: 'PAISES',
      ec_country: 'EC',
      page_type: 'PAGINA-BANNER',
      categories_type: 'BANNER-CATEGORIA',
      home_type: 'BANNER-HOME',
      brand_type: 'BANNER-MARCA',
      advertisements_type: 'PUBLICIDAD-BANNER',
      car_brand: 'MARCA-AUTO',
      type_measurement_tire: 'TIPOS-MEDIDA-LLANTA',
      document_type_banner: 'DOCUMENTO-BANNER',
      document_type_brand: 'DOCUMENTO-MARCA',
      document_type_shop: 'DOCUMENTO-TIENDA',
      document_type_promotion: 'DOCUMENTO-PROMOCION',
      promotion_types: 'TIPO-PROMOCIONES',
      promotion_type_category: 'TIPO-PROMOCION-CATEGORIA',
      promotion_type_brand: 'TIPO-PROMOCION-MARCA',
      promotion_type_measure: 'TIPO-PROMOCION-MEDIDA',      
      file_size: 'TAMANIO-ARCHIVO'
    });

})();
