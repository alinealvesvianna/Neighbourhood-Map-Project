var map,
    informationPlace,
    bounds;

var FourSquareLocal = function (data) {

    var self = this;

    self.marker = new google.maps.Marker({
        position: {
            lat: data.venue.location.lat,
            lng: data.venue.location.lng
        },
        icon: data.venue.categories[0].icon.prefix + "bg_44" + data.venue.categories[0].icon.suffix,
        animation: google.maps.Animation.DROP,
        title: data.venue.name,
        selected: ko.observable(false)
    });


    self.infowindow = new google.maps.InfoWindow({
        content: informationPlace
    });

    //self.infowindow.setContent(self.marker.informationPlace);

    self.placeName = data.venue.name;
    self.placeContact = data.venue.contact.formattedPhone;
    self.placeAddress = data.venue.location.formattedAddress[0];
    self.placeCategories = data.venue.categories[0].name;
    self.placeRating = data.venue.rating;

    //atualiza a posição de cada marker na variável bounds
    self.bounds = bounds.extend(self.marker.position);

    self.marker.addListener('click', function () {
        self.infowindow.open(map, self.marker);
    });

    self.marker.setMap(map);

};

var ViewModel = function () {
    var self = this;
    this.fourSquareAllLocals = ko.observableArray([]);
    self.makeRequestFourSquare = function () {

        var locationSearch = map.getCenter().toUrlValue();
        var fourSquareUrl = "https://api.foursquare.com/v2/venues/explore?";
        fourSquareUrl += $.param({
            'client_id': 'Y0KMJ2SSNWWUUYNWAFQ04EJAHGK3XJYJMLHCNVCJ4PVT5CEM',
            'client_secret': 'S4L0M0BTPHPMC0LY2R5JS22RIASITWR0VRV1LMKGP44HIM2O',
            'v': '20160328',
            'radius': '1000',
            'limit': '15'
        });
        fourSquareUrl += "&ll=" + locationSearch;

        $.getJSON(fourSquareUrl, function (data) {
            var fourSquareData = data.response.groups[0].items;
            for (var i = 0, lengthFS = fourSquareData.length; i < lengthFS; i++) {
                var fourSquareLocal = new FourSquareLocal(fourSquareData[i]);
                ko.applyBindings(fourSquareLocal, $("#infoWindowMaster")[0]);
                informationPlace = $("#infoWindowMaster").html();
                ko.cleanNode($("#infoWindowMaster")[0]);
                google.maps.event.addListener(fourSquareLocal.marker, "click", function () {
                    this.selected(true);
                })

                self.fourSquareAllLocals.push(fourSquareLocal);
            }
            //depois que sair do looping, centraliza os markers achados na tela
            map.fitBounds(bounds);
        })
            .fail(function () {
                console.log('deu ruim');
            });
    }
};

function initialize() {
    var mapOptions = {
        zoom: 18,
        disableDefaultUI: true,
        scaleControl: true
    }

    bounds = new google.maps.LatLngBounds();

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // pega a geolocalização pela api do HTML5
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var initialPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(initialPosition);
            vm.makeRequestFourSquare();
        }, function () {
            handleLocationError(true);
            vm.makeRequestFourSquare();
        });
    } else {
        handleLocationError(false);
    }

    //handle de erro
    function handleLocationError(browserHasGeolocation) {
        var error = browserHasGeolocation ? 'Error: Não aceitaram a permissão para pegar a localização' : 'Seu browser não suporta geolocalização.';
        map.setCenter(new google.maps.LatLng(-22.931827, -43.239654));
        console.log(error);
    };

    var vm = new ViewModel();
    ko.applyBindings(vm, $("#containerMaster")[0]);
};
