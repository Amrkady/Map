var Temples = [{
    title: "Luxor Temple",
    lat: 25.699502,
    lng: 32.6390509
  },
  {
    title: "Karnak temple complex",
    lat: 25.7174778,
    lng: 32.6559704
  },
  {
    title: "Mortuary Temple of Hatshepsut",
    lat: 25.7379736,
    lng:32.6063226
  },
  {
    title: "Valley of the Kings",
    lat: 25.7401643,
    lng: 32.601411
  },
  {
    title: "Luxor Museum",
    lat: 25.7076132,
    lng: 32.6423604
  },
  {
    title: "Colossi of Memnon",
    lat: 25.7205975,
    lng: 32.6082669
  },
  {
    title: "Ramesseum",
    lat: 25.7279952,
    lng:32.6104602
  },
];

function Error() {
  alert("failed to get map resources");
}
function ViewModel() {
  var self = this;
  self.Visible = ko.observableArray([]);
  self.MyMap = ko.observableArray([]);

  function built() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 25.7279952,
        lng: 32.6104602
      },
      zoom: 11
    });
    var infowindow = new google.maps.InfoWindow({});
    //Ajax request wikipedia Api
    Temples.forEach(function (Temple) {
      $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=wikiCallBack&search=',
        data: {
          action: 'opensearch',
          search: Temple.title,
          format: 'json'
        },
        dataType: 'jsonp'
      }).done(
        function (data) {
          marker.content = '<h3>' + data[1][0] + '</h3>' + '<div>' + '<p>' + data[2][0] + '</p>' + '</div>' + '<a href="' + data[3][0] + '">wikipedia</a>';
        }).fail(function (jqXHR, textStatus) {
             alert('failed to get wikipedia resources');
      });
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(Temple.lat, Temple.lng),
        map: map,
        title: Temple.title,
        description: Temple.description,
        URL: Temple.URL,
        TemplesList: function (thisMarker) {
          infowindow.setContent(marker.content);
          infowindow.open(map, thisMarker);
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function () {
            marker.setAnimation(null);
          }, 2222);
        }
      });
      self.Visible.push(marker);
      self.MyMap.push(marker);
      marker.addListener('click', function () {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function () {
            marker.setAnimation(null);
          }, 2222);

        }
        infowindow.setContent(marker.content);
        infowindow.open(map, marker);
      });
    });
  }
  self.Searchquery = ko.observable('');
  self.error = ko.observable('');

  self.Searchquery.subscribe(function (item) {
    for (var k = 0; k < self.MyMap().length; k++) {

      self.MyMap()[k].setVisible(false);
      self.Visible.remove(self.MyMap()[k]);

    }
    for (var i = 0; i < self.MyMap().length; i++) {
      if (self.MyMap()[i].title.toLowerCase().indexOf(item.toLowerCase()) >= 0) {
        self.MyMap()[i].setVisible(true);
        self.Visible.push(self.MyMap()[i]);

      }
    }
  });

  google.maps.event.addDomListener(window, 'load', built);

}