import $ from "jquery"
import Utils from "./app/utils.js"
import Accordion from "./app/accordion.js"
import Anchor from "./app/anchor.js"
import FixedHeader from "./app/fixedheader.js"
import HeightLine from "./app/heightline.js"
import ResponsiveTable from "./app/responsive-table.js"
import Slidebar from "./app/slidebar.js"
import Tab from "./app/tab.js"
import CurrentNav from "./app/current-nav.js"
import OwlCarousel from "owl.carousel"

import fontAwesome from "font-awesome/scss/font-awesome.scss"
import OwlCss from "owl.carousel/dist/assets/owl.carousel.css"
import OwlThemeCss from "owl.carousel/dist/assets/owl.theme.default.css"

class App {
  constructor() {
    this.Utils = new Utils();
    this.Accordion = new Accordion();
    this.Anchor = new Anchor();
    this.FixedHeader = new FixedHeader();
    this.HeightLine = new HeightLine();
    this.ResponsiveTable = new ResponsiveTable();
    this.Slidebar = new Slidebar();
    this.CurrentNav = new CurrentNav();
    this.Tab = new Tab();
    $(function(){
      $(".c-mainvisual").owlCarousel({
        items: 1
      })
    })
  }
}

window.GApp = new App()
