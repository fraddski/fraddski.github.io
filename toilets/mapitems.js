var melbLatitude = -37.8136;
var melbLongitude = 144.9631;
var currentLocation = { latitude: melbLatitude, longitude: melbLongitude };
var isUserLocation = false;
var isFirstLoad = true;
var mapCtl = document.getElementById('map');
var map;
var items = [];
var itemIndex = [];

function onPositionFound(position){
  isUserLocation = true;
  currentLocation.latitude = position.coords.latitude;
  currentLocation.longitude = position.coords.longitude;
  mapCtl.classList.remove('locating');
  initialiseMap();
}

function initialiseMap(){
  // Create new map centred on current location
  var location = new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
  var mapOptions = {
    center: location,
    zoom: 16,
    minZoom: 13,
    maxZoom: 20,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    panControl: true,
    zoomControl: true,
    styles: [
      {
        featureType: "all",
        elementType: "all",
        stylers:[{hue: "#dc1e8d"}, {saturation: -60}, {lightness: 60}]
      },
      {
        featureType: "road",
        elementType: "labels.text",
        stylers: [{ gamma: 0.5 }]
      },
      {
        featureType: "transit.station",
        elementType: "labels",
        stylers: [{ saturation: -100 }]
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      },
      {
        featureType: "water",
        elementType: "fill",
        stylers: [{ hue: "#2783e1" }, {saturation: 0}, {lightness: -10}]
      }
    ]
  };
  map = new google.maps.Map(mapCtl, mapOptions);

  if (isUserLocation) {
    // Add marker for current location
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Your location',
        icon: 'location.png'
    });
  }

  google.maps.event.addListener(map, 'bounds_changed', function(event) {
    getItems();
  });
}

function getItems(){
  var mapBounds = map.getBounds();
  var neCorner = mapBounds.getNorthEast();
  var swCorner = mapBounds.getSouthWest();

  var itms = server.getItems(swCorner.lat(), neCorner.lat(), swCorner.lng(), neCorner.lng());
  var additionalItems = [];
  for (var i=0; i < itms.length; i++) {
    if (itemIndex.indexOf(itms[i].id) === -1) {
      items.push(itms[i]);
      itemIndex.push(itms[i].id);
      additionalItems.push(itms[i]);
    }
  }

  plotItems(additionalItems);

  if (isFirstLoad && itms.length === 0) {
    offerRelocation();
    isFirstLoad = false;
  }
}

function plotItems(itms) {
  for (var i=0; i < itms.length; i++) {
    var itmLocation = new google.maps.LatLng(itms[i].latitude, itms[i].longitude);
    var itmMarker = new google.maps.Marker({
      position: itmLocation,
      map: map,
      title: itms[i].name,
      icon: 'marker.png',
      animation: google.maps.Animation.DROP
    });
    setupClickHandler(itmMarker, itms[i].id);
  }
}

function setupClickHandler(marker, id) {
  google.maps.event.addListener(marker, 'click', function() {
    showDialog(items[itemIndex.indexOf(id)]);
  });
}

function offerRelocation() {
  var relocateDialog = document.getElementById('relocateDialog');
  relocateDialog.style.display = 'block';
  relocateDialog.focus();
}

function relocate() {
  hideRelocationOffer();
  map.panTo(new google.maps.LatLng(melbLatitude, melbLongitude));
}

function hideRelocationOffer() {
  var relocateDialog = document.getElementById('relocateDialog');
  relocateDialog.style.display = 'none';
}

function onPositionError(error) {
  console.log('ERROR(' + error.code + '): ' + error.message);
  mapCtl.classList.remove('locating');
  initialiseMap();
};


function showDialog(item) {
  var contentWrap = document.getElementById('itemContent');
  while (contentWrap.firstChild) {
    contentWrap.removeChild(contentWrap.firstChild);
  }

  var itmName = document.createElement('h2');
  itmName.innerHTML = item.name;
  contentWrap.appendChild(itmName);

  var itmType = document.createElement('p');
  itmType.classList.add('notes');
  itmType.innerHTML = item.type;
  contentWrap.appendChild(itmType);

  if (item.notes && item.notes !== '') {
    var itmNotes = document.createElement('p');
    itmNotes.classList.add('notes');
    itmNotes.innerHTML = item.notes;
    contentWrap.appendChild(itmNotes);
  }

  var iconTemplate = '<li><svg class="{0}" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#male"></use></svg><p>{1}ale toilet</p></li><li><svg class="{2}" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#female"></use></svg><p>{3}emale toilet</p></li><li><svg class="{4}" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#disabled"></use></svg><p>{5}isabled access</p></li><li><svg class="{6}" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#babychange"></use></svg><p>{7}aby change facilities</p></li>';

  iconTemplate = iconTemplate.replace('{0}', item.male ? 'yes' : 'no');
  iconTemplate = iconTemplate.replace('{1}', item.male ? ' M' : 'No m');
  iconTemplate = iconTemplate.replace('{2}', item.female ? 'yes' : 'no');
  iconTemplate = iconTemplate.replace('{3}', item.female ? 'F' : 'No f');
  iconTemplate = iconTemplate.replace('{4}', item.disabled ? 'yes' : 'no');
  iconTemplate = iconTemplate.replace('{5}', item.disabled ? 'D' : 'No d');
  iconTemplate = iconTemplate.replace('{6}', item.babychange ? 'yes' : 'no');
  iconTemplate = iconTemplate.replace('{7}', item.babychange ? 'B' : 'No b');

  var icons = document.createElement('ul');
  icons.classList.add('icons');
  icons.innerHTML = iconTemplate;
  contentWrap.appendChild(icons);

  var dialog = document.getElementById('infoDialog');
  dialog.classList.add('showing');
  dialog.style.display = 'block';
}

function closeDialog() {
  var dialog = document.getElementById('infoDialog');
  dialog.classList.remove('showing');
  dialog.classList.add('hiding');
  setTimeout(function() {
    var dialog = document.getElementById('infoDialog');
    dialog.style.display = 'none';
    dialog.classList.remove('hiding');
  }, 300);
}

function handleKeyup(e) {
  if (e.keyCode === 27) {
    closeDialog();
  }
}


if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(onPositionFound, onPositionError);
} else {
  mapCtl.classList.remove('locating');
  initialiseMap();
}

document.getElementById('btnCloseDialog').addEventListener('click', closeDialog, false);
document.addEventListener('keyup', handleKeyup, false);
document.getElementById('btnRelocateClose').addEventListener('click', hideRelocationOffer, false);
document.getElementById('btnRelocateNo').addEventListener('click', hideRelocationOffer, false);
document.getElementById('btnRelocateYes').addEventListener('click', relocate, false);
