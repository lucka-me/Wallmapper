import { MDCRipple } from "@material/ripple";
import { MDCTopAppBar } from "@material/top-app-bar";

import { base } from "ui/base";
import { eli } from 'ui/eli';
import { service } from 'service';

import StyleMenu from './style-menu';

/**
 * Events for {@link AppBar}
 */
interface AppBarEvent {
    /**
     * Triggered when click the preference button
     */
    openPreference: () => void,
    /**
     * Triggered when style selected
     * @param index The index of selected style
     */
    selectStyle: (index: number) => void,
}

/**
 * The app bar component
 */
export default class AppBar extends base.Prototype {

    menu = new StyleMenu();
    
    elementPreference: HTMLButtonElement = null;
    elementMenu: HTMLButtonElement = null;

    events: AppBarEvent = {
        openPreference: () => { },
        selectStyle:    () => { },
    };

    init(parent: HTMLElement) {
        super.init(parent);
        this.render();
    }

    render() {
        const sectionActions = eli.build('section', {
            className: [
                'mdc-top-app-bar__section',
                'mdc-top-app-bar__section--align-end'
            ].join(' '),
        });

        // Action: Preference
        this.elementPreference = eli.build('button', {
            className: 'mdc-icon-button fa',
            title: 'Preference',
            innerHTML: '&#xf013',
        });
        sectionActions.append(this.elementPreference);
        const ripplePreference = new MDCRipple(this.elementPreference);
        ripplePreference.unbounded = true;
        ripplePreference.listen('click', () => this.events.openPreference());

        // Button: Style
        const elementMenuLabel = eli.build('span', {
            className: 'mdc-button__label',
            innerHTML: service.style.selectedStyle.title
        });
        this.elementMenu = eli.build('button', {
            className: 'mdc-button mdc-button--unelevated',
        }, [ elementMenuLabel ]);
        sectionActions.append(this.elementMenu);
        const rippleMenu = new MDCRipple(this.elementMenu);

        // StyleMenu
        this.menu.init(sectionActions);
        this.menu.events.selectStyle = (index, title) => {
            elementMenuLabel.innerHTML = title;
            this.events.selectStyle(index);
        };
        rippleMenu.listen('click', () => this.menu.open() );

        // App bar
        const elementAppBar = eli.build('header', {
            className: 'mdc-top-app-bar',
        }, [
            eli.build('div', {
                className: 'mdc-top-app-bar__row',
            }, [
                eli.build('section', {
                    className: [
                        'mdc-top-app-bar__section',
                        'mdc-top-app-bar__section--align-start'
                    ].join(' '),
                }, [
                    eli.build('span', {
                        className: 'mdc-top-app-bar__title',
                        innerHTML: 'Mapler',
                    }),
                ]),
                sectionActions,
            ]),
        ]);

        this.parent.append(elementAppBar);
        this.parent.append(eli.build('div', {
            className: 'mdc-top-app-bar--fixed-adjust'
        }));
        new MDCTopAppBar(elementAppBar);
    }

    /**
     * Enable the actions in app bar
     */
    enable() {
        this.elementPreference.disabled = false;
        this.elementMenu.disabled = false;
    }

    /**
     * Disable the actions in app bar
     */
    disable() {
        this.elementPreference.disabled = true;
        this.elementMenu.disabled = true;
    }
}