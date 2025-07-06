// let mapToken = mapToken we need to get the token from the map
mapboxgl.accessToken = mapToken//we will take from here
console.log(mapToken)
const map = new mapboxgl.Map({
   container: 'map', // container ID
   style: 'mapbox://styles/mapbox/streets-v11', // style URL
   center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
   zoom: 9 // starting zoom
});
//    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90


// Create the marker using that element
const marker = new mapboxgl.Marker({ color:"red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset:25})
   .setHTML(`<h4>${listing.title}</h4><p>Exact location after booking</p>`)
)
  .addTo(map);




 

        