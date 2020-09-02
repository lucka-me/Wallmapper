/**
 * Created by lucka on 07/21/2018.
 * @author lucka-me
 */

const value = {
    string: {
        github: {
            releaseUrl: 'https://api.github.com/repos/lucka-me/mapler/releases/latest',
        },
        mapbox: {
            accessToken: 'pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2poa2xyN3J4MGJ0bTM3bjV5bjdvNDh3ZSJ9.QztckHrHyEuKp5_pVXmpIw',
            style: [
                { uri: 'mapbox://styles/mapbox/streets-v11'             , title: 'Streets' },
                { uri: 'mapbox://styles/mapbox/light-v10'               , title: 'Light' },
                { uri: 'mapbox://styles/mapbox/dark-v10'                , title: 'Dark' },
                { uri: 'mapbox://styles/mapbox/outdoors-v11'            , title: 'Outdoors' },
                { uri: 'mapbox://styles/mapbox/satellite-v9'            , title: 'Satellite' },
                { uri: 'mapbox://styles/mapbox/satellite-streets-v11'   , title: 'Satellite Streets' },

                { uri: 'mapbox://styles/mapbox/cjzoh882k2njo1crylb28iiz3'   , title: 'Pencil' },
                { uri: 'mapbox://styles/mapbox/cjvshts5l1et01coz11pa6jam'   , title: 'Frank' },
                { uri: 'mapbox://styles/mapbox/cjku6bhmo15oz2rs8p2n9s2hm'   , title: 'Minimo' },
                { uri: 'mapbox://styles/mapbox/cjcunv5ae262f2sm9tfwg8i0w'   , title: 'Lè Shine' },
                { uri: 'mapbox://styles/mapbox/cjerxnqt3cgvp2rmyuxbeqme7'   , title: 'Cali Terrain' },
                { uri: 'mapbox://styles/mapbox/cj7t3i5yj0unt2rmt3y4b5e32'   , title: 'Ice Cream' },
                { uri: 'mapbox://styles/mapbox/cj5l80zrp29942rmtg0zctjto'   , title: 'Decimal' },
                { uri: 'mapbox://styles/mapbox/cj44mfrt20f082snokim4ungi'   , title: 'North Star' },
                { uri: 'mapbox://styles/mapbox/cj3kbeqzo00022smj7akz3o1e'   , title: 'Moonlight' },
                { uri: 'mapbox://styles/mapbox/cjtep62gq54l21frr1whf27ak'   , title: 'Mineral' },
                { uri: 'mapbox://styles/mapbox/cj4k8wmwy5lbt2smsigkbh18e'   , title: 'Standard' },

                { uri: 'mapbox://styles/lucka-me/cjjvmr0mn5csl2rmx5cbgmb0y' , title: 'Dark' },
                { uri: 'mapbox://styles/lucka-me/cjjzm06vz0cwl2rnnzgdgkf7j' , title: 'Hack' },
            ],
        },
    },
    preference: {
        location: {
            lon: { key: 'mapler.location.lon', def: 108.9435278 },
            lat: { key: 'mapler.location.lat', def: 34.2651799 },
            zoom: { key: 'mapler.location.zoom', def: 12 },
            bearing: { key: 'mapler.location.bearing', def: 0 },
            tilt: { key: 'mapler.location.tilt', def: 0 },
        },
        display: {
            labels: { key: 'mapler.display.labels', def: true },
        },
        misc: {
            selectedStyle: { key: 'mapler.misc.selectedStyle', def: 0 },
        }
    },
};

const ui = {
    appBar: {
        style: {
            menu: null,
            label: document.getElementById("label-button-appBar-style"),
            init: () => {
                ui.appBar.style.label.innerHTML = ui.map.getStyleFromPreference().title;
                const menuElement = document.querySelector("#menu-style");
                const menuList = menuElement.querySelector("ul");
                for (const index in value.string.mapbox.style) {
                    const menuItem = document.createElement("ul");
                    menuItem.className = "mdc-list-item";
                    menuItem.setAttribute("role", "menuitem");
                    menuItem.dataset.code = index;
                    const menuLabel = document.createElement("span");
                    menuLabel.className = "mdc-list-item__text";
                    menuLabel.innerHTML = value.string.mapbox.style[index].title;
                    menuItem.appendChild(menuLabel);
                    menuList.appendChild(menuItem);
                }
                ui.appBar.style.menu = new mdc.menu.MDCMenu(menuElement);
                ui.appBar.style.menu.listen("MDCMenu:selected", ui.appBar.style.onSelected);
                const menuButton = new mdc.ripple.MDCRipple(document.querySelector("#button-appBar-style"));
                menuButton.listen("click", () => ui.appBar.style.menu.open = true );
            },
            onSelected: (event) => {
                const index = event.detail.item.dataset.code;
                preference.set(value.preference.misc.selectedStyle, index);
                ui.appBar.style.label.innerHTML = value.string.mapbox.style[index].title;
                ui.map.setStyle(value.string.mapbox.style[index].uri);
            },
        },
        init: () => {
            ui.appBar.style.init();

            const buttonElementPref = document.querySelector('#button-appBar-preference');
            const buttonPref = new mdc.ripple.MDCRipple(buttonElementPref);
            buttonPref.unbounded = true;
            buttonPref.listen('click', () => ui.dialog.preference.ctrl.open());
        },
    },
    dialog: {
        preference: {
            ctrl: new mdc.dialog.MDCDialog(document.querySelector('#dialog-preference')),
            location: { lon: null, lat: null, zoom: null, bearing: null, tilt: null, },
            size: { width: null, height: null, pixelRadio: null, },
            display: { labels: null, },
            init: () => {
                const dialogPref = ui.dialog.preference;
                const dialogElement = dialogPref.ctrl.root_;
                fetch(value.string.github.releaseUrl)
                    .then(response => response.json())
                    .then(response => {
                        document.getElementById('link-version').innerHTML = response.name;
                    });                
                
                dialogPref.location.lon = new mdc.textField.MDCTextField(dialogElement.querySelector('#field-pref-location-lon'));
                dialogPref.location.lat = new mdc.textField.MDCTextField(dialogElement.querySelector('#field-pref-location-lat'));
                dialogPref.location.zoom = new mdc.textField.MDCTextField(dialogElement.querySelector('#field-pref-location-zoom'));
                dialogPref.location.bearing = new mdc.textField.MDCTextField(dialogElement.querySelector('#field-pref-location-bearing'));
                dialogPref.location.tilt = new mdc.textField.MDCTextField(dialogElement.querySelector('#field-pref-location-tilt'));
                dialogPref.location.lon.value = preference.get(value.preference.location.lon);
                dialogPref.location.lat.value = preference.get(value.preference.location.lat);
                dialogPref.location.zoom.value = preference.get(value.preference.location.zoom);
                dialogPref.location.bearing.value = preference.get(value.preference.location.bearing);
                dialogPref.location.tilt.value = preference.get(value.preference.location.tilt);

                const buttonLocationSet = new mdc.ripple.MDCRipple(dialogElement.querySelector("#button-pref-location-set"));
                buttonLocationSet.listen('click', _ => dialogPref.setLocation());

                dialogPref.size.width = new mdc.textField.MDCTextField(dialogElement.querySelector('#field-pref-size-width'));
                dialogPref.size.height = new mdc.textField.MDCTextField(dialogElement.querySelector('#field-pref-size-height'));
                dialogPref.size.pixelRadio = new mdc.textField.MDCTextField(dialogElement.querySelector('#field-pref-size-pixelRadio'));
                const pixelRadio = window.devicePixelRatio;
                dialogPref.size.width.value = window.screen.width * pixelRadio;
                dialogPref.size.height.value = window.screen.height * pixelRadio;
                dialogPref.size.pixelRadio.value = pixelRadio;

                dialogPref.display.labels = new mdc.switchControl.MDCSwitch(dialogElement.querySelector('#switch-pref-display-labels'));
                dialogPref.display.labels.checked = preference.get(value.preference.display.labels);
                dialogPref.display.labels.listen('change', _ => {
                    ui.map.setLabels(dialogPref.display.labels.checked);
                });

                dialogPref.ctrl.listen('MDCDialog:opened', dialogPref.onOpened);
            },
            onOpened: () => {
                const dialogPref = ui.dialog.preference;
                dialogPref.location.lon.layout();
                dialogPref.location.lat.layout();
                dialogPref.location.zoom.layout();

                dialogPref.size.width.layout();
                dialogPref.size.height.layout();
                dialogPref.size.pixelRadio.layout();

                dialogPref.ctrl.layout();
            },
            setLocation: () => {
                const dialogPref = ui.dialog.preference;
                const lon = parseFloat(dialogPref.location.lon.value);
                const lat = parseFloat(dialogPref.location.lat.value);
                const zoom = parseFloat(dialogPref.location.zoom.value);
                const bearing = parseFloat(dialogPref.location.bearing.value);
                const tilt = parseFloat(dialogPref.location.tilt.value);
                let inputError = false;
                if (isNaN(lon) || lon < -180 || lon > 180) {
                    dialogPref.location.lon.value = value.preference.location.lon.def;
                    inputError = true;
                }
                if (isNaN(lat) || lat < -90 || lat > 90) {
                    dialogPref.location.lat.value = value.preference.location.lat.def;
                    inputError = true;
                }
                if (isNaN(zoom) || zoom < 0 || zoom > 20) {
                    dialogPref.location.zoom.value = value.preference.location.zoom.def;
                    inputError = true;
                }
                if (isNaN(bearing) || bearing < 0 || bearing > 360) {
                    dialogPref.location.bearing.value = value.preference.location.bearing.def;
                    inputError = true;
                }
                if (isNaN(tilt) || tilt < 0 || tilt > 60) {
                    dialogPref.location.tilt.value = value.preference.location.tilt.def;
                    inputError = true;
                }
                if (inputError) {
                    return;
                }
                ui.map.setLocation(lon, lat, zoom, bearing, tilt);
            },
            updateLocation: (lon, lat, zoom, bearing, tilt) => {
                const dialogPref = ui.dialog.preference;
                dialogPref.location.lon.value = lon;
                dialogPref.location.lat.value = lat;
                dialogPref.location.zoom.value = zoom;
                dialogPref.location.bearing.value = bearing;
                dialogPref.location.tilt.value = tilt;
            },
        },
    },
    map: {
        ctrl: null,
        init: () => {
            mapboxgl.accessToken = value.string.mapbox.accessToken;
            ui.map.ctrl = new mapboxgl.Map({ 
                container: 'map-main',
                style: ui.map.getStyleFromPreference().uri,
                center: [
                    preference.get(value.preference.location.lon),
                    preference.get(value.preference.location.lat)
                ],
                zoom: preference.get(value.preference.location.zoom),
                bearing: preference.get(value.preference.location.bearing),
                pitch: preference.get(value.preference.location.tilt),
            });
            ui.map.ctrl.once('load', () => {
                if (!preference.get(value.preference.display.labels)) {
                    ui.map.setLabels(false);
                }
                ui.map.ctrl.resize();
            });
            ui.map.ctrl.addControl(new mapboxgl.NavigationControl());
            ui.map.ctrl.addControl(
                new mapboxgl.GeolocateControl({
                    positionOptions: { enableHighAccuracy: true },
                    showUserLocation: false
                })
            );
            ui.map.ctrl.on('idle', _ => ui.map.onIdle() );
        },
        onIdle: () => {
            const center = ui.map.ctrl.getCenter();
            const zoom = ui.map.ctrl.getZoom();
            const bearing = ui.map.ctrl.getBearing();
            const tilt = ui.map.ctrl.getPitch();

            ui.dialog.preference.updateLocation(center.lng, center.lat, zoom, bearing, tilt);

            preference.set(value.preference.location.lon, center.lng);
            preference.set(value.preference.location.lat, center.lat);
            preference.set(value.preference.location.zoom, zoom);
            preference.set(value.preference.location.bearing, bearing);
            preference.set(value.preference.location.tilt, tilt);
        },
        getStyleFromPreference: () => {
            let index = preference.get(value.preference.misc.selectedStyle);
            if (index < 0 || index > value.string.mapbox.style.length - 1) {
                index = 0;
                preference.set(value.preference.misc.selectedStyle, selectedStyle);
            }
            return value.string.mapbox.style[index];
        },
        setStyle: (uri) => {
            ui.map.ctrl.setStyle(uri);
            if (!ui.dialog.preference.display.labels.checked) {
                ui.map.ctrl.once('styledata', _ => {
                    ui.map.setLabels(false);
                });
            }
        },
        setLabels: (display) => {
            preference.set(value.preference.display.labels, display);
            ui.map.ctrl.getStyle().layers.forEach(layer => {
                if (layer.type === 'symbol') {
                    ui.map.ctrl.setLayoutProperty(layer.id, 'visibility', display ? 'visible' : 'none');
                }
            });
        },
        setLocation: (lon, lat, zoom, bearing, tilt) => {
            ui.map.ctrl.flyTo({ center: [lon, lat], zoom: zoom, bearing: bearing, pitch: tilt, });
        },
    },
    init: () => {
        ui.appBar.init();
        ui.dialog.preference.init();

        const fabSnapshot = new mdc.ripple.MDCRipple(document.querySelector('#fab-snapshot'));
        fabSnapshot.unbounded = true;
        fabSnapshot.listen('click', () => process.snapshot());
    }
};

const process = {
    snapshot: () => {
        const mapDiv = document.createElement('div');
        // Modify size for HiDPI devices
        const pixelRadio = ui.dialog.preference.size.pixelRadio.value;
        const width  = ui.dialog.preference.size.width.value  / pixelRadio;
        const height = ui.dialog.preference.size.height.value / pixelRadio;
        mapDiv.style = `width:${width}px;height:${height}px;position:fixed;top:0;left:0;`;
        document.body.appendChild(mapDiv);
        const map = new mapboxgl.Map({
            container: mapDiv,
            style: ui.map.ctrl.getStyle(),
            bounds: ui.map.ctrl.getBounds(),
            preserveDrawingBuffer: true
        });
        map.once('idle', () => {
            // Save png from canvas
            //   Ref: https://stackoverflow.com/a/49521638
            map.getCanvas().toBlob((blob) => {
                const element = document.createElement('a');
                element.href = URL.createObjectURL(blob);
                element.download = 'Mapler.png';
                element.style.display = "none";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                map.remove();
                document.body.removeChild(mapDiv);
            });
        });
    },
};

const preference = {
    set: (item, value) => localStorage.setItem(item.key, JSON.stringify(value)),
    get: (item) => {
        const value = localStorage.getItem(item.key);
        return (value === null) ? item.def : JSON.parse(value);
    }
}

// For Edge and IE which don't support toBlob()
//   Ref: https://stackoverflow.com/a/47487073
if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
            var canvas = this;
            setTimeout(function() {
                var binStr = atob( canvas.toDataURL(type, quality).split(',')[1] ),
                len = binStr.length,
                arr = new Uint8Array(len);

                for (var i = 0; i < len; i++ ) {
                    arr[i] = binStr.charCodeAt(i);
                }

                callback( new Blob( [arr], {type: type || 'image/png'} ) );
            });
        }
    });
}