import { MDCDialog } from '@material/dialog';
import { MDCRipple } from '@material/ripple';
import { MDCSwitch } from '@material/switch';
import { MDCTextField } from '@material/textfield';

import { base } from 'ui/base';
import { eli } from 'eli/eli';
import { eliButton } from 'eli/button';
import { eliDialog } from 'eli/dialog';
import { eliSwitch } from 'eli/switch';
import { service } from 'service';
import { version } from 'root/package.json';

import './styles.scss';

/**
 * Events for {@link PanelDialog}
 */
interface PanelEvents {
    /**
     * Triggered when click the set button
     */
    setCamera: (camera: base.Camera) => void;

    /**
     * Triggered when switch the Labels switcher
     */
    setLabels: (display: boolean) => void;
}

/**
 * The preference dialog component
 */
export default class Panel extends base.Prototype {

    private ctrl: MDCDialog = null;
    private items = {
        camera: {
            longitude:  null as MDCTextField,
            latitude:   null as MDCTextField,
            zoom:       null as MDCTextField,
            bearing:    null as MDCTextField,
            tilt:       null as MDCTextField,
        },
    
        size: {
            width:      null as MDCTextField,
            height:     null as MDCTextField,
            pixelRatio: null as MDCTextField,
        },
    
        display: {
            labels: null as MDCSwitch,
        },
    };

    events: PanelEvents = {
        setCamera: () => { },
        setLabels: () => { },
    };

    render() {
        // Contents
        const contents: Array<HTMLElement> = [];

        // Preference: Camera
        contents.push(eli('span', { className: 'headline', innerHTML: 'Camera' }));
        const contentsCamera: Array<HTMLElement> = [];
        // Preference: Camera - Location
        const elementCameraLongitude = this.buildTextfield('text', 'decimal', 'Longitude', 'input-pref-camera-lon');
        this.items.camera.longitude = new MDCTextField(elementCameraLongitude);
        this.items.camera.longitude.value = service.preference.get('mapler.camera.lon');

        const elementCameraLatitude = this.buildTextfield('text', 'decimal', 'Latitude ', 'input-pref-camera-lat');
        this.items.camera.latitude = new MDCTextField(elementCameraLatitude);
        this.items.camera.latitude.value = service.preference.get('mapler.camera.lat');

        contentsCamera.push(eli('div', {
            className: 'location'
        }, [
            elementCameraLongitude, elementCameraLatitude
        ]));

        // Preference: Camera - Others
        const elementCameraZoom = this.buildTextfield('text', 'decimal', 'Zoom', 'input-pref-camera-zoom');
        this.items.camera.zoom = new MDCTextField(elementCameraZoom);
        this.items.camera.zoom.value = service.preference.get('mapler.camera.zoom');

        const elementCameraBearing = this.buildTextfield('text', 'decimal', 'Bearing', 'input-pref-camera-bearing');
        this.items.camera.bearing = new MDCTextField(elementCameraBearing);
        this.items.camera.bearing.value = service.preference.get('mapler.camera.bearing');

        const elementCameraTilt = this.buildTextfield('text', 'decimal', 'Tilt', 'input-pref-camera-tilt');
        this.items.camera.tilt = new MDCTextField(elementCameraTilt);
        this.items.camera.tilt.value = service.preference.get('mapler.camera.tilt');

        contentsCamera.push(
            elementCameraZoom, elementCameraBearing, elementCameraTilt
        );

        // Preference: Camera - Set
        const elementSet = eliButton('Set');
        contentsCamera.push(elementSet);

        // Build Preference: Camera
        contents.push(eli('div', { className: 'camera' }, contentsCamera));

        // Preference: Size
        contents.push(eli('span', { className: 'headline', innerHTML: 'Size' }));
        const pixelRatio = window.devicePixelRatio;

        // Preference: Size - Width
        const elementSizeWidth = this.buildTextfield('number', 'numeric', 'Width', 'input-pref-size-width');
        
        this.items.size.width = new MDCTextField(elementSizeWidth);
        this.items.size.width.value = `${window.screen.width * pixelRatio}`;

        // Preference: Size - Height
        const elementSizeHeight = this.buildTextfield('number', 'numeric', 'Height', 'input-pref-size-height');
        this.items.size.height = new MDCTextField(elementSizeHeight);
        this.items.size.height.value = `${window.screen.height * pixelRatio}`;

        // Preference: Size - Pixel Ratio
        const elementSizePixelRatio = this.buildTextfield('number', 'numeric', 'Pixel Ratio', 'input-pref-size-pixelRatio');
        this.items.size.pixelRatio = new MDCTextField(elementSizePixelRatio);
        this.items.size.pixelRatio.value = `${pixelRatio}`;

        contents.push(elementSizeWidth, elementSizeHeight, elementSizePixelRatio);

        // Preference: Display
        contents.push(eli('span', { className: 'headline', innerHTML: 'Display' }));

        // Preference: Display - Labels
        const elementDisplayLabels = eliSwitch('input-panel-display-labels');
        contents.push(eli('div', {
            className: 'switch',
        }, [
            elementDisplayLabels,
            eli('label', {
                for: 'nput-panel-display-labels',
                innerHTML: 'Labels',
            })
        ]));

        // About
        contents.push(eli('span', { className: 'headline', innerHTML: 'About' }));
        contents.push(eli('span', { className: 'about' }, [
            eliDialog.link(
                version,
                'https://github.com/lucka-me/mapler/blob/master/CHANGELOG.md',
                'Changelog'
            )
        ]));
        contents.push(eli('span', { className: 'about' }, [
            eliDialog.link(
                'Repository',
                'https://github.com/lucka-me/mapler',
            )
        ]));

        // Build dialog
        const elementDialog = eliDialog('panel', {
            title: 'Panel',
            contents: contents,
            actions: [ { action: 'close', text: 'Close' } ],
        });

        this.parent.append(elementDialog);
        this.ctrl = new MDCDialog(elementDialog);

        const rippleSet = new MDCRipple(elementSet);
        rippleSet.listen('click', () => this.onSetCamera());

        this.items.display.labels = new MDCSwitch(elementDisplayLabels);
        this.items.display.labels.checked = service.preference.get('mapler.display.labels');
        this.items.display.labels.listen('change', () => {
            this.events.setLabels(this.items.display.labels.checked)
        });
    }

    open() {
        if (!this.ctrl) this.render();
        this.ctrl.open();
    }

    /**
     * Get the size values in `[width, height, pixelRatio]`
     */
    get size(): [number, number, number] {
        let pixelRatio = window.devicePixelRatio;
        let width   = pixelRatio * window.screen.width;
        let height  = pixelRatio * window.screen.height;

        if (this.ctrl) {
            pixelRatio = parseFloat(this.items.size.pixelRatio.value);
            if (isNaN(pixelRatio)) {
                pixelRatio = window.devicePixelRatio;
                this.items.size.pixelRatio.value = `${pixelRatio}`;
            }

            width = parseInt(this.items.size.width.value);
            if (isNaN(width) || width < 1) {
                width = pixelRatio * window.screen.width;
                this.items.size.width.value = `${width}`;
            }

            height = parseInt(this.items.size.height.value);
            if (isNaN(height) || height < 1) {
                height = pixelRatio * window.screen.height;
                this.items.size.height.value = `${height}`;
            }
        }

        return [width, height, pixelRatio];
    }

    /**
     * Update camera values
     * @param lon Longitude
     * @param lat Latitude
     * @param zoom Zoom
     * @param bearing Bearing
     * @param tilt Tile
     */
    updateCamera(
        lon: number, lat: number,
        zoom: number, bearing: number, tilt: number
    ) {
        if (!this.ctrl) return;

        this.items.camera.longitude.value   = `${lon}`;
        this.items.camera.latitude.value    = `${lat}`;

        this.items.camera.zoom.value        = `${zoom}`;
        this.items.camera.bearing.value     = `${bearing}`;
        this.items.camera.tilt.value        = `${tilt}`;
    }

    /**
     * Check the value and pass to event if all correct
     */
    private onSetCamera() {
        let correct = true;

        let longitude = parseFloat(this.items.camera.longitude.value);
        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            longitude = service.preference.get('mapler.camera.lon');;
            this.items.camera.longitude.value = `${longitude}`;
            correct = false;
        }

        let latitude = parseFloat(this.items.camera.latitude.value);
        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            latitude = service.preference.get('mapler.camera.lat');;
            this.items.camera.latitude.value = `${latitude}`;
            correct = false;
        }

        let zoom = parseFloat(this.items.camera.zoom.value);
        if (isNaN(zoom) || zoom < 0 || zoom > 20) {
            zoom = service.preference.get('mapler.camera.zoom');;
            this.items.camera.zoom.value = `${zoom}`;
            correct = false;
        }

        let bearing = parseFloat(this.items.camera.bearing.value);
        if (isNaN(bearing) || bearing < 0 || bearing > 360) {
            bearing = service.preference.get('mapler.camera.bearing');;
            this.items.camera.bearing.value = `${bearing}`;
            correct = false;
        }

        let tilt = parseFloat(this.items.camera.tilt.value);
        if (isNaN(tilt) || tilt < 0 || tilt > 60) {
            tilt = service.preference.get('mapler.camera.tilt');;
            this.items.camera.tilt.value = `${tilt}`;
            correct = false;
        }

        if (correct) {
            this.events.setCamera({
                lon: longitude,
                lat: latitude,
                zoom: zoom,
                bearing: bearing,
                tilt: tilt
            });
        }
    }

    /**
     * Build a MDC textfield element
     * @param type Type of the `<input>`, like `text` or `number`
     * @param inputmode Input mode of the `<input>`, like `decimal` or `number`
     * @param label Text displayed in label
     * @param id Id for `<input>` and `<label>`
     * @returns The headline element
     */
    private buildTextfield(type: string, inputmode: string, label: string, id: string): HTMLDivElement {
        return eli('div', {
            className: 'mdc-text-field mdc-text-field--outlined margin-v--8 margin-h--4'
        }, [
            eli('input', {
                type: type, inputmode: inputmode, id: id,
                className: 'mdc-text-field__input'
            }),
            eli('div', { className: 'mdc-notched-outline' }, [
                eli('div', { className: 'mdc-notched-outline__leading' }),
                eli('div', { className: 'mdc-notched-outline__notch' }, [
                    eli('label', {
                        for: id, innerHTML: label,
                        className: 'mdc-floating-label'
                    })
                ]),
                eli('div', { className: 'mdc-notched-outline__trailing' }),
            ])
        ]);
    }
}