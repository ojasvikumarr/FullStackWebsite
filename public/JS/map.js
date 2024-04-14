
const [lng, lat] = listing.geometry.coordinates;
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/light-v11",
// satellite-street-v12 light-v11 dark-v11 streets-v12 outdoors-v12
    center: [lng, lat], // starting position [lng, lat]
    zoom: 2 // starting zoom
});

// console.log(coordinates);

const marker = new mapboxgl.Marker({ color: "red", draggable: true })
    .setLngLat([lng, lat])
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h5>${listing.title}</h5><p>Exact Location will be provided after booking</p>`
        )
    )
    .addTo(map);


// const nav2 = new mapboxgl.NavigationControl({
//     visualizePitch: true
// });
// map.addControl(nav2, 'bottom-right');

// map.addControl(new mapboxgl.NavigationControl());
// map.on('load', () => {
//     // Load an image from an external URL.
//     map.loadImage(
//         'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',
//         (error, image) => {
//             if (error) throw error;

//             // Add the image to the map style.
//             map.addImage('cat', image);

//             // Add a data source containing one point feature.
//             map.addSource('point', {
//                 'type': 'geojson',
//                 'data': {
//                     'type': 'FeatureCollection',
//                     'features': [
//                         {
//                             'type': 'Feature',
//                             'geometry': {
//                                 'type': 'Point',
//                                 'coordinates': [-77.4144, 25.0759]
//                             }
//                         }
//                     ]
//                 }
//             });
//             map.addLayer({
//                 'id': 'points',
//                 'type': 'symbol',
//                 'source': 'point', // reference the data source
//                 'layout': {
//                     'icon-image': 'cat', // reference the image
//                     'icon-size': 0.25
//                 }
//             });
//         }
//     );
// });
