var server = (function(){
  var _items = [];

  function init(){
    var itmRequest = new XMLHttpRequest();
    itmRequest.open('GET', 'melb_toilets.json', true);

    itmRequest.onload = function(){
      if (itmRequest.status >= 200 && itmRequest.status < 400){
        _items = JSON.parse(itmRequest.responseText);
      } else {
        console.log('Could not retrieve items');
      }
    };

    itmRequest.onerror = function() {
      console.log('Could not retrieve items');
    };

    itmRequest.send();
  }

  function getItems(minLat, maxLat, minLong, maxLong){
    var filteredItms = [];
    for (var i=0; i < _items.length; i++) {
      if (_items[i].latitude >= minLat && _items[i].latitude <= maxLat &&
        _items[i].longitude >= minLong && _items[i].longitude <= maxLong) {
          filteredItms.push(_items[i]);
      }
    }
    return filteredItms;
  }

  init();

  return {
    getItems: getItems
  };

})();
