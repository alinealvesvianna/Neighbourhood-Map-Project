// var initialData = [{
//     messagePickLocation: false,
//     messageTxtPopup: "Você é bananinha!",
//     // cidade: "rio de janeiro",
//     // bairro: "tijuca"
//     endereco: "Tijuca, Rio de Janeiro - Rj"
// }];
//
// var MessagePopUp = function(data) {
//     this.messagePickLocation = ko.observable(data.messagePickLocation);
//     this.messageTxtPopup = ko.observable(data.messageTxtPopup);
//     // this.cidade = ko.observable(data.cidade);
//     // this.bairro = ko.observable(data.bairro);
//     this.endereco = ko.observable(data.endereco);
// };
//
// var ViewModel = function() {
//     var self = this;
//     this.popUps = ko.observableArray([]);
//
//     initialData.forEach(function(popUpItem) {
//         self.popUps.push(new MessagePopUp(popUpItem));
//     });
//
//     this.popUpLocationMessage = ko.observable(this.popUps()[0]);
//
//     // this.setPopUp = function(data) {
//     //     self.popUpLocationMessage(data);
//     // };
//
//     // this.sendTypeLocation = function(formElement) {
//     //     // this.addressSet = this.cidade() + " " + this.bairro();
//     //     this.addressSet = this.endereco();
//     //     initMap.findLocation(this.addressSet);
//     // };
// };
//

//
//
//
//
// var initMap = function() {
//     var map = new google.maps.Map(document.getElementById('map'), {
//         center: {
//             lat: -34.397,
//             lng: 150.644
//         },
//         zoom: 6
//     });
//
//     var zoomAutocomplete = new google.maps.places.Autocomplete(document.getElementById('field-search'));
//     // Bias the boundaries within the map for the zoom to area text.
//     zoomAutocomplete.bindTo('bounds', map);
//
//
//     var infoWindow = new google.maps.InfoWindow({
//         map: map
//     });
//
//     // Try HTML5 geolocation.
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function(position) {
//             var pos = {
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude
//             };
//
//             infoWindow.setPosition(pos);
//             infoWindow.setContent('Location found.');
//             map.setCenter(pos);
//         }, function() {
//             handleLocationError(true, infoWindow, map.getCenter());
//             // handleLocationError(true);
//         });
//     } else {
//         handleLocationError(false, infoWindow, map.getCenter());
//     }
//
//     function handleLocationError(browserHasGeolocation) {
//         var error = browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.';
//         vm.popUpLocationMessage().messagePickLocation(true);
//         vm.popUpLocationMessage().messageTxtPopup(error);
//         findLocation();
//     };
//
//     document.getElementById("button-search").addEventListener("click", function() {
//         findLocation();
//     });
//
//     // This function takes the input value in the find nearby area text input
//     // locates it, and then zooms into that area. This is so that the user can
//     // show all listings, then decide to focus on one area of the map.
//     function findLocation() {
//
//         // Initialize the geocoder.
//         var geocoder = new google.maps.Geocoder();
//         // Get the address or place that the user entered.
//         // var address = vm.endereco();
//
//         var address = document.getElementById("field-search").value;
//
//         // Make sure the address isn't blank.
//         if (address == '') {
//             window.alert('You must enter an area, or address.');
//         } else {
//             // Geocode the address/area entered to get the center. Then, center the map
//             // on it and zoom in
//             geocoder.geocode({
//                 address: address,
//                 // componentRestrictions: {
//                 //     locality: 'New York'
//                 // }
//             }, function(results, status) {
//                 if (status == google.maps.GeocoderStatus.OK) {
//                     map.setCenter(results[0].geometry.location);
//                     map.setZoom(15);
//                 } else {
//                     window.alert('We could not find that location - try entering a more' +
//                         ' specific place.');
//                 }
//             });
//         }
//
//
//         console.log("achou!!")
//     };
//
// };
//
// var vm = new ViewModel();
// ko.applyBindings(vm);
//client_id FOURSQAURE
//Y0KMJ2SSNWWUUYNWAFQ04EJAHGK3XJYJMLHCNVCJ4PVT5CEM

//client_secret FOURSQAURE
//S4L0M0BTPHPMC0LY2R5JS22RIASITWR0VRV1LMKGP44HIM2O

//url json exemplo foursquare
// https://api.foursquare.com/v2/venues/explore?client_id=Y0KMJ2SSNWWUUYNWAFQ04EJAHGK3XJYJMLHCNVCJ4PVT5CEM&client_secret=S4L0M0BTPHPMC0LY2R5JS22RIASITWR0VRV1LMKGP44HIM2O&v=20160328&radius=1000&limit=15&ll=43.2633,%20-79.9189

//var dataJson = {

//    locationSearch: map.getCenter().toUrlValue(),

//    fourSquareUrl: "https://api.foursquare.com/v2/venues/explore?",

//    fourSquareUrlParams: function () {
//        fourSquareUrl += $.param({
//            'client_id': 'Y0KMJ2SSNWWUUYNWAFQ04EJAHGK3XJYJMLHCNVCJ4PVT5CEM',
//            'client_secret': 'S4L0M0BTPHPMC0LY2R5JS22RIASITWR0VRV1LMKGP44HIM2O',
//            'v': '20160328',
//            'radius': '1000',
//            'limit': '15'
//        });
//    },

//    fourSquareUrlComplete: function () {
//        fourSquareUrl += "&ll=" + locationSearch;
//    },


//    fourSquareRequest: function () {
//        $.getJSON(fourSquareUrl, function (data) {
//            //this.fourSquareData = data.response.groups[0].items;
//            var vm = new ViewModel();
//            ko.applyBindings(vm);
//        })
//        .fail(function () {
//            console.log('deu ruim');
//        });
//    }

//}


var map;


//var dataJson = function () {

//    var locationSearch = map.getCenter().toUrlValue();

//    var fourSquareUrl = "https://api.foursquare.com/v2/venues/explore?"

//    fourSquareUrl += $.param({
//        'client_id': 'Y0KMJ2SSNWWUUYNWAFQ04EJAHGK3XJYJMLHCNVCJ4PVT5CEM',
//        'client_secret': 'S4L0M0BTPHPMC0LY2R5JS22RIASITWR0VRV1LMKGP44HIM2O',
//        'v': '20160328',
//        'radius': '1000',
//        'limit': '15'
//    })

//    fourSquareUrl += "&ll=" + locationSearch;

//    // var urlRequest = fourSquareUrl + "ll=" + locationSearch;

//    var fourSquareRequest = $.getJSON(fourSquareUrl, function (data) {
//        //console.log(data)
//        // var articles = data.response.docs;

//        //this.fourSquareData = data.response.groups[0].items;
//    });


//    // if (typeof fourSquareRequest == 'object') {
//    //        console.log("É UM OBJETO, NÃO PRECISA DE PARSE!!!!")
//    // }
//    // else {
//    //     console.log("chupa que é de uva!")
//    // }

//    //var fourSquareData = JSON.parse(fourSquareRequest);
//    //console.log(fourSquareData);

//    fourSquareRequest.fail(function () {
//        console.log('deu ruim');
//    });
//};






var FourSquareLocal = function (data) {

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(
            data.venue.location.lat,
            data.venue.location.lng
        ),
        icon: data.venue.categories[0].icon.prefix + "bg_44" + data.venue.categories[0].icon.suffix,
        animation: google.maps.Animation.DROP,
        // selected: ko.observable(false)
    });

    this.placeName = data.venue.name;
    this.placeContact = data.venue.contact.formattedPhone;
    this.placeAdress = data.venue.location.formattedAddress[0];
    this.placeCategories = data.venue.categories[0].name;

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
                //fourSquareDataLength = data.response.groups[0].items.length;

            console.log(fourSquareData);

            //for (var i = 0; i < fourSquareDataLength; i++) {

            for (var i = 0, lengthFS = fourSquareData.length; i < lengthFS; i++) {
                var fourSquareLocal = new FourSquareLocal(fourSquareData[i]);
                self.fourSquareAllLocals.push(fourSquareLocal);
            }

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
