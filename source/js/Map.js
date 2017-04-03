var map,
    bounds,
    geocoder;

var FourSquareLocal = function(data) {

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

    self.placeName = data.venue.name;
    self.placeContact = data.venue.contact.formattedPhone;
    self.placeAddress = data.venue.location.formattedAddress[0];
    self.placeCategories = data.venue.categories[0].name;
    self.placeRating = data.venue.rating;
    //atualiza a posição de cada marker na variável bounds
    self.bounds = bounds.extend(self.marker.position);

    self.addInfoWindow = function(data) {
        self.infowindow = new google.maps.InfoWindow({
            content: data
        });

        google.maps.event.addListener(self.marker, "click", function() {
            self.infowindow.open(map, self.marker);
            self.marker.selected(true);
            self.addAnimationSelect();
        });
    };

    self.selectMarkerClickFilter = function() {
        self.addAnimationSelect();
        self.infowindow.open(map, self.marker);
    };

    self.addMarkers = function() {
        self.marker.setMap(map);
    };

    self.removeMarkers = function() {
        self.marker.setMap(null);
    };

    self.addAnimationSelect = function() {
        if (self.marker.selected(true)) {
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                self.marker.setAnimation(null);
                self.marker.selected(false);
            }, 2000);
        }
    };
};

var ViewModel = function() {
    var self = this;
    self.fourSquareAllLocals = ko.observableArray();
    self.fourSquareFilterAllLocals = ko.observableArray();
    self.showLoading = ko.observable(true);
    self.searchFieldValue = ko.observable();


    self.searchLocal = function() {
        geocoder.geocode({
            'address': self.searchFieldValue()
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                self.removeAllMarkes();
                self.makeRequestFourSquare();
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });

    };

    self.removeAllMarkes = function() {
        for (var i = 0, array = self.fourSquareAllLocals().length; i < array; i++) {
            self.fourSquareAllLocals()[i].removeMarkers();
        }
        self.fourSquareAllLocals.removeAll();
    };

    self.makeRequestFourSquare = function() {
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

        $.getJSON(fourSquareUrl, function(data) {
                var fourSquareData = data.response.groups[0].items;
                for (var i = 0, lengthFS = fourSquareData.length; i < lengthFS; i++) {
                    var fourSquareLocal = new FourSquareLocal(fourSquareData[i]);
                    ko.applyBindings(fourSquareLocal, $("#infoWindowMaster")[0]);
                    var informationPlace = $("#infoWindowMaster").html();
                    fourSquareLocal.addMarkers();
                    fourSquareLocal.addInfoWindow(informationPlace);
                    ko.cleanNode($("#infoWindowMaster")[0]);
                    self.fourSquareAllLocals.push(fourSquareLocal);
                    self.fourSquareFilterAllLocals.push(fourSquareLocal);
                }
                //depois que sair do looping, centraliza os markers achados na tela
                map.fitBounds(bounds);
                self.showLoading(false);
                console.log(self.fourSquareAllLocals().length)
                console.log(self.fourSquareFilterAllLocals())
            })
            .fail(function() {
                self.showLoading(false);
                console.log('deu ruim');
            });

    }
};

function initialize() {
    var mapOptions = {
        zoom: 18,
        disableDefaultUI: true,
        scaleControl: true
    };

    geocoder = new google.maps.Geocoder();

    bounds = new google.maps.LatLngBounds();

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // pega a geolocalização pela api do HTML5
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var initialPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(initialPosition);
            vm.makeRequestFourSquare();
        }, function() {
            // vm.showLoading(true);
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
