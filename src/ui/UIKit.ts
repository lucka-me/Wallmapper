import ShotAction from "./ShotAction";

class UIKit {

    shotAction = new ShotAction();
    
    init() {

        const body = document.body;
        body.className = 'mdc-typography fullheight flex-box-col';

        // ShotAction
        this.shotAction.init(body);
    }
}