var map,
    bounds;

var FourSquareLocal = function (data) {
    this.marker = new google.maps.Marker({
        position: {
            lat: data.venue.location.lat,
            lng: data.venue.location.lng
        },
        icon: data.venue.categories[0].icon.prefix + "bg_44" + data.venue.categories[0].icon.suffix,
        animation: google.maps.Animation.DROP,
        // selected: ko.observable(false)
    });

    this.placeName = data.venue.name;
    this.placeContact = data.venue.contact.formattedPhone;
    this.placeAdress = data.venue.location.formattedAddress[0];
    this.placeCategories = data.venue.categories[0].name;

    //atualiza a posição de cada marker na variável bounds
    this.bounds = bounds.extend(this.marker.position);
    this.marker.setMap(map);

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
    ko.applyBindings(vm);
};
