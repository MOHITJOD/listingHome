
    let token = mapToken;
	mapboxgl.accessToken = token ;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center :cordinate.geometry.coordinates, // starting position [lng, lat]. 
        zoom: 10, // starting zoom
        pitch: 80,
        bearing: 41,
        style: 'mapbox://styles/mapbox/satellite-streets-v12'
    });
    map.on('style.load', () => {
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    });
    
    const marker1 = new mapboxgl.Marker({ color: 'red'})
    .setLngLat(cordinate.geometry.coordinates)
    .setPopup (new mapboxgl.Popup({ offset: 20 })
    .setHTML( `<h4> ${cordinate.title}</h4> <p>you will be here</p> `)
    .setMaxWidth("300px"))
    .addTo(map);