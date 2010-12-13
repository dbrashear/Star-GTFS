// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

jQuery.Star = {};

(function($) {
    var map;
    var markers = [];
    var current_marker = null;

    var greenIcon = "http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png";
    var redIcon = "http://www.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png";

    function onStopGet( d, s, x ) {
        
    }
    function onMarkerClick() {
        if ( this.times === undefined || this.times.length == 0 ) {
            return;
        }
        var content = $("<div></div>").append(
            $("<h2></h2>").append(this.getTitle())
        ).addClass( 'time_display');
        for( var i = 0; i < this.times.length; ++i ) {
            content.append( $("<h3></h3>").append( this.times[i].direction ) );
            var ul = $("<ul></ul>");
            for( var j = 0; j < this.times[i].times.length; ++j ) {
                ul.append( $("<li></li>").append( this.times[i].times[j] ) );              
            }
            content.append( ul ).append( $("<div></div>").addClass("clear") );
        }
        var infow = new google.maps.InfoWindow({
            content: content[0]
        });
        infow.open( map, this );
    }
    function onLineGet( d, s, x) {
        $.each( d, function( idx, point ) {
            var myLatlng = new google.maps.LatLng( point.lat, point.lon );
            var icon;
            if( point.times.length > 0 ) {
                icon = greenIcon;
            } else {
                icon = redIcon;
            }
            var marker = new google.maps.Marker( {
                position: myLatlng,
                map: map,
                title: point.name,
                icon: icon
            });
            marker.stop_id = point.id;
            marker.times = point.times;
            markers.push( marker );
            google.maps.event.addListener( marker, 'click', onMarkerClick );
        });
    }
    function onSelectLine() {
        $.each( markers, function( idx, marker ) {
            marker.setMap( null );
        });
        markers = [];
        var url = $('#info select').data('line-url');
        $.get( url, { id: $(this).val() }, onLineGet, "json" );
    }
    $.Star.init= function() {
        map = new google.maps.Map($('#map')[0], {
            'zoom': 13,
            'center': new google.maps.LatLng( 48.11, -1.63 ),
            'mapTypeId': google.maps.MapTypeId.ROADMAP
        });
        $('#info select').change(onSelectLine);
    };
})(jQuery);