(function() {
  var control, currentPlanarGraphId, destIcon, destMarker, fromMarker, loadPlanarGraph, locationProvider, mapStyle, markers, navi, navigationProvider, routineLayer, startIcon;

  window.map = new NGR.View('map', {
    appKey: "c7bc846ea1a14e7dad270c979888e4a3"
  });

  window.res = new NGR.DataSource({
    appKey: "c7bc846ea1a14e7dad270c979888e4a3"
  });

  window.layers = {};

  markers = {};

  currentPlanarGraphId = -1;

  mapStyle = null;

  control = NGR.control.floor();

  control.on('change', function(e) {
    return loadPlanarGraph(e.to);
  });

  map.addControl(control);

  navigationProvider = new NGR.NavigationProvider({
    appKey: "c7bc846ea1a14e7dad270c979888e4a3"
  });

  navi = function() {
    navigationProvider.setFrom(fromMarker.getLatLng(), currentPlanarGraphId);
    navigationProvider.setDestination(destMarker.getLatLng(), currentPlanarGraphId);
    return navigationProvider.navigate().then(function() {
      var distance, layer, routines;
      routineLayer.clearLayers();
      distance = navigationProvider.getNaviLineDistance();
      routines = navigationProvider.getRoutinesOnPlanarGraph(currentPlanarGraphId);
      layer = NGR.featureLayer(routines, {
        layerType: "Navi",
        styleConfig: mapStyle
      });
      return routineLayer.addLayer(layer);
    }).fail(function(e) {
      return console.error(e, e.stack);
    });
  };

  startIcon = NGR.icon({
    iconUrl: '../../resources/images/marker_start@2x.png',
    iconSize: [25, 32]
  });

  destIcon = NGR.icon({
    iconUrl: '../../resources/images/marker_dest@2x.png',
    iconSize: [25, 32]
  });

  fromMarker = null;

  destMarker = null;

  routineLayer = NGR.layerGroup();

  map.on('click', function(e) {
    if (!fromMarker) {
      fromMarker = NGR.marker(e.latlng, {
        icon: startIcon,
        draggable: true
      });
      return fromMarker.addTo(map);
    } else if (!destMarker) {
      destMarker = NGR.marker(e.latlng, {
        icon: destIcon,
        draggable: true
      });
      destMarker.addTo(map);
      fromMarker.on('dragend', function() {
        return navi();
      });
      destMarker.on('dragend', function() {
        return navi();
      });
      navi();
      return routineLayer.addTo(map);
    }
  });

  locationProvider = new NGR.LocationProvider({
    appKey: "c7bc846ea1a14e7dad270c979888e4a3"
  });

  locationProvider.watch(NGR.LocationProvider.MAC, '50:06:04:A6:5F:00');

  locationProvider.start();

  locationProvider.on('enter', function(feature) {
    var MAC, floorId, renderMarker;
    MAC = feature.properties.id_data;
    floorId = feature.properties.floor_id;
    renderMarker = function() {
      if (!markers[mac]) {
        markers[mac] = NGR.canvasmarker(feature.geometry.coordinates, options);
        return map.addLayer(markers[mac]);
      } else {
        return markers[mac].setLatLng(feature.geometry.coordinates);
      }
    };
    return renderMarker();
  });

  locationProvider.on('move', function(feature) {
    var marker;
    marker = markers[feature.properties.id_data];
    return marker.animateMove(feature.geometry.coordinates);
  });

  res.requestMaps().then(function(maps) {
    return res.requestPOIChildren(maps.list[0].poi).then(function(floors) {
      control.setFloorList(floors);
      return loadPlanarGraph(floors[0].id);
    }).fail(function(e) {
      return console.error(e, e.stack);
    });
  }).fail(function(e) {
    return console.error(e, e.stack);
  });

  loadPlanarGraph = function(planarGraphId) {
    return res.requestPlanarGraph(planarGraphId).then(function(layerInfo) {
      return NGR.IO.fetch({
        url: './style.json',
        onsuccess: JSON.parse
      }).then(function(style) {
        return NGR.IO.fetch({
          url: './heatmap.json',
          onsuccess: JSON.parse
        }).then(function(heatmap) {
          mapStyle = style;
          map.clear();
          fromMarker = null;
          destMarker = null;
          routineLayer = NGR.layerGroup();
          currentPlanarGraphId = planarGraphId;
          control.setCurrentFloor(planarGraphId);
          layers.frame = NGR.featureLayer(layerInfo, {
            layerType: 'Frame',
            styleConfig: style
          });
          layers.area = NGR.featureLayer(layerInfo, {
            layerType: 'Area',
            styleConfig: style
          });
          layers.annotation = NGR.featureLayer(layerInfo.Area, {
            layerType: 'LogoLabel',
            styleConfig: style
          });
          layers.facility = NGR.featureLayer(layerInfo.Facility, {
            layerType: 'Facility',
            styleConfig: style
          });
          layers.collision = NGR.layerGroup.collision({
            margin: 3
          });
          layers.collision.addLayer(layers.annotation);
          layers.collision.addLayer(layers.facility);
          map.addLayer(layers.frame);
          map.addLayer(layers.area);
          map.addLayer(layers.collision);
          return map.render();
        }).fail(function(e) {
          return console.error(e, e.stack);
        });
      }).fail(function(e) {
        return console.error(e, e.stack);
      });
    }).fail(function(e) {
      return console.error(e, e.stack);
    });
  };

}).call(this);
