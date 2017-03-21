var initialData = [{
    messagePickLocation: false,
    messageTxtPopup: "Você é bananinha!",
    // cidade: "rio de janeiro",
    // bairro: "tijuca"
    endereco: "Tijuca, Rio de Janeiro - Rj"
}];

var MessagePopUp = function(data) {
    this.messagePickLocation = ko.observable(data.messagePickLocation);
    this.messageTxtPopup = ko.observable(data.messageTxtPopup);
    // this.cidade = ko.observable(data.cidade);
    // this.bairro = ko.observable(data.bairro);
    this.endereco = ko.observable(data.endereco);
};

var ViewModel = function() {
    var self = this;
    this.popUps = ko.observableArray([]);

    initialData.forEach(function(popUpItem) {
        self.popUps.push(new MessagePopUp(popUpItem));
    });

    this.popUpLocationMessage = ko.observable(this.popUps()[0]);

    this.setPopUp = function(data) {
        self.popUpLocationMessage(data);
    };

    // this.sendTypeLocation = function(formElement) {
    //     // this.addressSet = this.cidade() + " " + this.bairro();
    //     this.addressSet = this.endereco();
    //     initMap.findLocation(this.addressSet);
    // };
};






var initMap = function() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 6
    });

    var zoomAutocomplete = new google.maps.places.Autocomplete(document.getElementById('testete'));
    // Bias the boundaries within the map for the zoom to area text.
    zoomAutocomplete.bindTo('bounds', map);


    var infoWindow = new google.maps.InfoWindow({
        map: map
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
        }, function() {
            // handleLocationError(true, infoWindow, map.getCenter());
            handleLocationError(true);
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation) {
        var error = browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.';
        vm.popUpLocationMessage().messagePickLocation(true);
        vm.popUpLocationMessage().messageTxtPopup(error);

    };

    document.getElementById("bananada").addEventListener("click", function() {
        findLocation();
    });

    // This function takes the input value in the find nearby area text input
    // locates it, and then zooms into that area. This is so that the user can
    // show all listings, then decide to focus on one area of the map.
    function findLocation() {

        // Initialize the geocoder.
        var geocoder = new google.maps.Geocoder();
        // Get the address or place that the user entered.
        // var address = vm.endereco();

        var address = document.getElementById("testete").value;

        // Make sure the address isn't blank.
        if (address == '') {
            window.alert('You must enter an area, or address.');
        } else {
            // Geocode the address/area entered to get the center. Then, center the map
            // on it and zoom in
            geocoder.geocode({
                address: address,
                // componentRestrictions: {
                //     locality: 'New York'
                // }
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(15);
                } else {
                    window.alert('We could not find that location - try entering a more' +
                        ' specific place.');
                }
            });
        }


        console.log("achou!!")
    };

};









var vm = new ViewModel();


ko.applyBindings(vm);
