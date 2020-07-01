function startMarker() {
  let appointmentLat = document.getElementById("appointment-lat").innerHTML;
  let appointmentLng = document.getElementById("appointment-lng").innerHTML;
  let vetTitle = document.getElementById("vet-title").innerHTML;
  let address = document.getElementById("complete-address").innerHTML;
  let infowindowContent = document.getElementById('infowindow-content');

  var myLatlng = new google.maps.LatLng(parseFloat(appointmentLat), parseFloat(appointmentLng));
  var mapOptions = {
    zoom: 16,
    center: myLatlng,
    disableDefaultUI: true,
    fullscreenControl: true,
  };
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var marker = new google.maps.Marker({
    position: myLatlng,
  });

  // To add the marker to the map, call setMap();
  marker.setMap(map);

  google.maps.event.addListener(marker , 'click', () => {
    let infowindow = new google.maps.InfoWindow({
      position: myLatlng
    });
    infowindow.setContent(infowindowContent);
    infowindowContent.children['place-name'].textContent = vetTitle;
    infowindowContent.children['place-address'].textContent = address;
    infowindow.open(map);
});
}

startMarker();
