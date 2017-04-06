var map,
    searchBox;

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

    self.placeName = data.venue.name;
    self.placeContact = data.venue.contact.formattedPhone;
    self.placeAddress = data.venue.location.formattedAddress[0];
    self.placeCategories = data.venue.categories[0].name;
    //self.placeCategories = ko.observable(data.venue.categories[0].name);
    self.placeRating = data.venue.rating;


    self.addInfoWindow = function (data) {
        self.infowindow = new google.maps.InfoWindow({
            content: data
        });

        google.maps.event.addListener(self.marker, "click", function () {
            self.infowindow.open(map, self.marker);
            self.marker.selected(true);
            self.addAnimationSelect();
        });

        google.maps.event.addListener(self.infowindow, 'closeclick', function () {
            self.decreaseZoom();
        });
    };

    self.selectMarkerClickFilter = function () {
        self.addAnimationSelect();
        self.infowindow.open(map, self.marker);
    };

    self.addMarkers = function () {
        self.marker.setMap(map);
    };

    self.removeMarkers = function () {
        self.marker.setMap(null);
    };

    self.addAnimationSelect = function () {
        if (self.marker.selected(true)) {
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            map.setCenter(self.marker.position);
            map.setZoom(18);
            setTimeout(function () {
                self.marker.setAnimation(null);
                self.marker.selected(false);
            }, 2000);
        }
    };

    self.decreaseZoom = function () {
        map.setZoom(16);
    };

    //self.visibleFilterCategory = ko.observable(true);

};

var ViewModel = function () {
    var self = this;
    self.fourSquareAllLocals = ko.observableArray();
    //self.fourSquareFilterAllLocals = ko.observableArray();
    //self.filterCategories = ko.observableArray();
    self.currentFilter = ko.observable();
    self.showLoading = ko.observable(true);

    var bounds = new google.maps.LatLngBounds(),
    //variável usada pela busca quando posta a o termo digitado no input
    geocoder = new google.maps.Geocoder();

    //quando posta a localização pelo input de busca
    self.postLocation = function (address) {
        self.searchLocal(geocoder, map, address)
    };

    self.searchLocal = function (geocoder, resultsMap, address) {
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                resultsMap.setCenter(results[0].geometry.location);
                resultsMap.setZoom(14);
                self.removeAllMarkes();
                self.removeAllFilterLocals();
                self.makeRequestFourSquare();
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    };

    self.removeAllMarkes = function () {
        for (var i = 0, array = self.fourSquareAllLocals().length; i < array; i++) {
            self.fourSquareAllLocals()[i].removeMarkers();
        }
        self.fourSquareAllLocals.removeAll();
    };

    //self.removeAllFilterLocals = function () {
    //    self.fourSquareFilterAllLocals.removeAll();
    //};

    //filtro
    //self.showInformationsWithSameCategorie = function (data) {
    //    //console.log(data);

    //    for (var i = 0, arrayFilter = self.fourSquareFilterAllLocals().length; i < arrayFilter; i++) {
    //        console.log(self.fourSquareFilterAllLocals()[i]);
    //    }

    //    //if (self.fourSquareFilterAllLocals().indexOf(data) !== -1) {
    //    //    console.log(self.fourSquareFilterAllLocals().indexOf(data))
    //    //}
    //};

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
                var informationPlace = $("#infoWindowMaster").html();
                fourSquareLocal.addMarkers();
                fourSquareLocal.addInfoWindow(informationPlace);
                ko.cleanNode($("#infoWindowMaster")[0]);
                self.fourSquareAllLocals.push(fourSquareLocal);
                //self.fourSquareFilterAllLocals.push(fourSquareLocal);
                //self.filterCategories.push(fourSquareLocal.placeCategories());
                //console.log(fourSquareLocal);
                //console.log(fourSquareLocal.placeCategories);
                //atualiza a posição de cada marker na variável bounds
                bounds.extend(fourSquareLocal.marker.position);
            }
            //self.filterCategories();
            //depois que sair do looping, centraliza os markers achados na tela
            map.fitBounds(bounds);
            self.showLoading(false);
            //console.log(self.filterCategories())
            //console.log(self.fourSquareFilterAllLocals())
            //console.log("filtro locais:" + self.fourSquareFilterAllLocals().length)
        })
            .fail(function () {
                self.showLoading(false);
                console.log('deu ruim');
            });
    };


    //self.filterCategory = function (data) {
    //    console.log(data)
    //}

    self.filterCategories = ko.computed(function () {
        if (self.currentFilter() == undefined) {
            return self.fourSquareAllLocals();
        } else {
            return ko.utils.arrayFilter(self.fourSquareAllLocals(), function (fourSquareLocal) {
                return fourSquareLocal.placeCategories == self.currentFilter();
            });
        }
    });

    self.filter = function (category) {
        self.currentFilter(category.placeCategories);
    };

};

function initialize() {
    var mapOptions = {
        zoom: 18,
        disableDefaultUI: true,
        scaleControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    },
        inputSearch = document.getElementById('field-search');

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    searchBox = new google.maps.places.SearchBox(inputSearch);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputSearch);

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

    //adiciona listener no mapa para quando a geolocalização mudar, atulizar a posição no search box
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    // evento que monitora quando o usuário escolher um endereço do autocomplete
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        vm.postLocation(places["0"].formatted_address);
    });

    var vm = new ViewModel();
    ko.applyBindings(vm, $("#containerMaster")[0]);
};
