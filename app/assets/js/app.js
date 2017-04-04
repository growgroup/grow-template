import $ from "./app/jquery-shim.js"

import Utils from "./app/utils.js"
import Accordion from "./app/accordion.js"
import Anchor from "./app/anchor.js"
// import FixedHeader from "./app/fixedheader.js"
import HeightLine from "./app/heightline.js"
import ResponsiveTable from "./app/responsive-table.js"
import Slidebar from "./app/slidebar.js"
import Tab from "./app/tab.js"
// import Slider from "./app/slider.js"


class App {
    constructor() {
        this.Utils = new Utils();
        this.Accordion = new Accordion();
        this.Anchor = new Anchor();
        // this.FixedHeader = new FixedHeader();
        this.HeightLine = new HeightLine();
        this.ResponsiveTable = new ResponsiveTable();
        this.Slidebar = new Slidebar();
        this.Tab = new Tab();
        // this.Slider = new Slider();
    }
}

window.GApp = new App()
