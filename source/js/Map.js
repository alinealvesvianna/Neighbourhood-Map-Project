var map,
    infowindow,
    searchBox;

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

    self.placeName = data.venue.name || "Sem Informação";
    self.placeContact = data.venue.contact.formattedPhone || "Sem Informação";
    self.placeAddress = data.venue.location.formattedAddress[0] || "Sem Informação";
    self.placeCategories = data.venue.categories[0].name || "Sem Informação";
    self.placeRating = data.venue.rating || "Sem Informação";

    var contentInfowindow = '<ul class="infoWindow__list">'
    contentInfowindow += '<li class="infoWindow__name">' + self.placeName + '</li>'
    contentInfowindow += '<li class="infoWindow__name">' + self.placeContact + '</li>'
    contentInfowindow += '<li class="infoWindow__name">' + self.placeAddress + '</li>'
    contentInfowindow += '<li class="infoWindow__name">' + self.placeCategories + '</li>'
    contentInfowindow += '<li class="infoWindow__name">' + self.placeRating + '</li>'
    contentInfowindow += '</ul>'

    self.addInfoWindow = function() {
        google.maps.event.addListener(self.marker, "click", function() {
            infowindow.setContent(contentInfowindow);
            infowindow.open(map, self.marker);
            self.marker.selected(true);
            self.addAnimationSelect();
        });

        google.maps.event.addListener(infowindow, 'closeclick', function() {
            self.decreaseZoom();
        });
    };

    self.selectMarkerClickFilter = function() {
        infowindow.setContent(contentInfowindow);
        self.addAnimationSelect();
        infowindow.open(map, self.marker);
    };

    self.addMarkers = function() {
        self.marker.setMap(map);
    };

    self.removeMarkers = function() {
        self.marker.setMap(null);
    };

    self.showMarker = function() {
        self.marker.setVisible(true);
    };

    self.hideMarker = function() {
        self.marker.setVisible(false);
    };

    self.addAnimationSelect = function() {
        if (self.marker.selected(true)) {
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            map.setZoom(18);
            // map.setCenter(self.marker.getPosition());
            map.panTo(self.marker.getPosition());
            setTimeout(function() {
                self.marker.setAnimation(null);
                self.marker.selected(false);
            }, 1400);
        }
    };

    self.decreaseZoom = function() {
        map.setZoom(16);
    };
};

var ViewModel = function() {
    var self = this;
    self.fourSquareAllLocals = ko.observableArray();
    self.currentFilter = ko.observable();
    self.showLoading = ko.observable(true);
    self.showHowManyPlaces = ko.observable();
    self.clearFilter = ko.observable(false);
    self.showError = ko.observable(false);
    self.textError = ko.observable();
    self.showAside = ko.observable(false);
    self.textShowAside = ko.observable(false);
    self.classShowAside = ko.observable(false);


    var bounds = new google.maps.LatLngBounds(),
        //variável usada pela busca quando posta a o termo digitado no input
        geocoder = new google.maps.Geocoder();

    //quando posta a localização pelo input de busca
    self.postLocation = function(address) {
        self.searchLocal(geocoder, map, address);
    };

    self.searchLocal = function(geocoder, resultsMap, address) {
        self.showLoading(true);
        self.showError(false);
        self.textError("");
        geocoder.geocode({
            'address': address
        }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                resultsMap.setCenter(results[0].geometry.location);
                resultsMap.setZoom(14);
                self.removeAllMarkes();
                self.makeRequestFourSquare();
            } else {
                self.showLoading(false);
                self.showError(true);
                //alert("Geocode was not successful for the following reason: " + status);
                self.textError("Geocode não teve sucesso pelo seguinte motivo: " + status);
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
                    self.currentFilter(null);
                    var fourSquareLocal = new FourSquareLocal(fourSquareData[i]);
                    fourSquareLocal.addMarkers();
                    fourSquareLocal.addInfoWindow();
                    self.fourSquareAllLocals.push(fourSquareLocal);
                    //atualiza a posição de cada marker na variável bounds
                    bounds.extend(fourSquareLocal.marker.position);
                }
                //depois que sair do looping, centraliza os markers achados na tela
                self.fitBoundsMap();
                self.showError(false);
                self.textError("");
                self.showLoading(false);
            })
            .fail(function(jqXHR, textStatus) {
                self.showLoading(false);
                //console.log('deu ruim');
                self.showError(true);
                self.textError("deu ruim na solicitação de dados para o foursquare pelo seguinte motivo: " + textStatus);
            });
    };

    self.fitBoundsMap = function() {
        map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
    };

    //get a list of used categories http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    //monta o filtro de categorias com o array do four square
    self.justCategories = ko.computed(function() {
        var categories = ko.utils.arrayMap(self.fourSquareAllLocals(), function(fourSquareLocal) {
            return fourSquareLocal.placeCategories;
        });
        if (self.currentFilter() === undefined || self.currentFilter() === null || self.currentFilter() === "") {
            self.clearFilter(false);
            return categories;
        } else {
            return ko.utils.arrayFilter(self.justCategories(), function(category) {
                return category == self.currentFilter();
            });
        }
    });

    //get a unique list of used categories http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    //Não repetir categorias ao fazer bind do filtro
    self.uniqueCategories = ko.computed(function() {
        return ko.utils.arrayGetDistinctValues(self.justCategories()).sort();
    });

    //monta o aside com resultados da busca
    self.filterCategories = ko.computed(function() {
        if (self.currentFilter() === undefined || self.currentFilter() === null || self.currentFilter() === "") {
            self.clearFilter(false);
            return self.fourSquareAllLocals();
        } else {
            return ko.utils.arrayFilter(self.fourSquareAllLocals(), function(fourSquareLocal) {
                self.clearFilter(true);
                if (fourSquareLocal.placeCategories !== self.currentFilter()) {
                    fourSquareLocal.hideMarker();
                } else {
                    fourSquareLocal.showMarker();
                }
                return fourSquareLocal.placeCategories == self.currentFilter();
            });
        }
    });

    self.toggleAside = function() {
        var currentShow = self.showAside();
        var currentText = self.textShowAside();
        var currentClass = self.classShowAside();
        self.showAside(!currentShow);
        self.textShowAside(!currentText);
        self.classShowAside(!currentClass);
    };

    self.filter = function(category) {
        self.currentFilter(category);
    };

    self.clearFilterAction = function() {
        self.currentFilter('');
        self.fourSquareAllLocals().forEach(function(fourSquareLocal) {
            fourSquareLocal.showMarker();
        });
    };

    self.numberOfPlaces = ko.pureComputed(function() {
        return self.fourSquareAllLocals().length;
    });
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
    infowindow = new google.maps.InfoWindow();

    searchBox = new google.maps.places.SearchBox(inputSearch);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputSearch);

    // pega a geolocalização pela api do HTML5
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var initialPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(initialPosition);
            vm.makeRequestFourSquare();
            vm.showHowManyPlaces(true);
            setTimeout(function() {
                vm.showHowManyPlaces(false);
            }, 3100);
        }, function() {
            handleLocationError(true);
            vm.makeRequestFourSquare();
            vm.showHowManyPlaces(true);
            setTimeout(function() {
                vm.showHowManyPlaces(false);
            }, 3100);
        });
    } else {
        handleLocationError(false);
    }

    //handle de erro
    function handleLocationError(browserHasGeolocation) {
        var error = browserHasGeolocation ? 'Error: Não aceitaram a permissão para pegar a localização' : 'Seu browser não suporta geolocalização.';
        map.setCenter(new google.maps.LatLng(-22.931827, -43.239654));
        vm.showError(true);
        vm.textError(error);
    }

    //adiciona listener no mapa para quando a geolocalização mudar, atulizar a posição no search box
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    google.maps.event.addDomListener(window, 'resize', function() {
        vm.fitBoundsMap();
    });

    // evento que monitora quando o usuário escolher um endereço do autocomplete
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        vm.postLocation(places["0"].formatted_address);
    });

    var vm = new ViewModel();
    ko.applyBindings(vm, $("#containerMaster")[0]);
};

var ErrorGoogleMaps = function() {
    var self = this;
    self.showErrorLoadMaps = ko.observable(true);
    self.textErrorLoadMaps = ko.observable("Tivemos algum problema para carregar o google maps... Por favor, verifique a sua conexão.");
};

function errorGoogleApi() {
    var errorMaps = new ErrorGoogleMaps();
    ko.applyBindings(errorMaps, $("#messageError")[0]);
}
