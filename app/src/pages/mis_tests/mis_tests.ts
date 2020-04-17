import { Page } from "tns-core-modules/ui/page";
import { Observable, EventData } from "tns-core-modules/data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Frame, View } from "tns-core-modules/ui/frame";
import * as app from "tns-core-modules/application";
import { MisTestViewModel} from './mis_tests_view_model';
import { Button } from "tns-core-modules/ui";
var pagina = null;
import { SyncController } from '../../sync_controller/sync_controller';
import { ShowModalOptions } from "tns-core-modules/ui/core/view";
import { Utils } from '../../utils/utils';
const utils = new Utils();
const syncapi = new SyncController();
let listView;
let lblSelection;
let lbl_preguntas_ant_selected;
let lbl_dificultad_ant_selected;
let num_preguntas = 0;
let dificultad_selected = null;
let ambito_selected = 0;

export function onLoaded(args) {
  const page = args.object;
  page.bindingContext = new MisTestViewModel();
  listView = page.getViewById("listView");
  page.bindingContext.set("name_selected", "TITULO");
  page.bindingContext.set("pregunta_selected", 0);
  pagina = page;
}

export function openMenu(args) {
  const menu = args.object;
  const page = menu.page;
  let sideDrawer = <RadSideDrawer><unknown>app.getRootView();
  sideDrawer.showDrawer();
}

export function onDrawerOpening(args) {
  const drawer = args.object;
  const page = drawer.page;
  if (page.bindingContext.get("name_selected") == "TITULO") {
    let drawer_sheet = <RadSideDrawer>pagina.getViewById("sideDrawer_b");
    drawer_sheet.closeDrawer();
    page.bindingContext.set("show_sheet", false);
    return;
  }
  page.bindingContext.set("show_sheet", true);
}

export function onDrawerClosing(args) {
  const lbl = args.object;
  const page = lbl.page;
  page.bindingContext.set("show_sheet", false);

}

export function onItemSelected(args: EventData) {
  const page = <Page>args.object;
  const selectedItems = listView.getSelectedItems();
  let selectedTitles = [];
  for (let i = 0; i < selectedItems.length; i++) {
    selectedTitles.push(selectedItems[i]);
  }
  page.bindingContext.set("name_selected", selectedTitles[0].categoria);
  ambito_selected = selectedTitles[0].ambito;
  syncapi.generarPreguntas(selectedTitles[0].nivel_dificultad, selectedTitles[0].ambito, selectedTitles[0].numero_preguntas).then(async (preguntas) => {
    var v = await preguntas.filter(utils.filterArray);
    if (v.length > 0) {
      openQuizPage(args, preguntas);
    } else {
      await utils.showSnackSimple("No se pudo generar el test. Intentalo mas tarde", "#FFFFFF", "#f53d3d");
    }
  })
  //let drawer_sheet = <RadSideDrawer>pagina.getViewById("sideDrawer_b");
  //drawer_sheet.showDrawer();
}

export function numPreguntasSelectes(args) {
  const lbl = args.object;
  if (lbl_preguntas_ant_selected != null) {
    lbl_preguntas_ant_selected.backgroundColor = "#e6e6e6";
    lbl_preguntas_ant_selected.color = "#000000";
  }
  lbl_preguntas_ant_selected = lbl;
  lbl.backgroundColor = "#fe0000";
  lbl.color = "#FFFFFF";
  num_preguntas = lbl.text;
}

export function dificultadSelected(args) {
  const lbl = args.object;
  if (lbl_dificultad_ant_selected != null) {
    lbl_dificultad_ant_selected.backgroundColor = "#e6e6e6";
    lbl_dificultad_ant_selected.color = "#000000";
  }
  lbl_dificultad_ant_selected = lbl;
  lbl.backgroundColor = "#fe0000";
  lbl.color = "#FFFFFF";
  if (lbl.text == "Cualquiera") {
    dificultad_selected = 1;
  } else if (lbl.text == "Facil") {
    dificultad_selected = 1;
  } else if (lbl.text == "Medio") {
    dificultad_selected = 2;
  } else if (lbl.text == "Dificil") {
    dificultad_selected = 3;
  }
}

export async function iniciar(args) {
  let drawer_sheet = <RadSideDrawer>pagina.getViewById("sideDrawer_b");
  drawer_sheet.closeDrawer();
  if (num_preguntas > 0 && dificultad_selected != null || dificultad_selected != undefined && ambito_selected > 0) {
    syncapi.generarPreguntas(dificultad_selected, ambito_selected, num_preguntas).then(async (preguntas) => {  
      var v = await preguntas.filter(utils.filterArray);
      if (v.length > 0) {
        openQuizPage(args, preguntas);
      } else {
        await utils.showSnackSimple("No se pudo generar el test. Intentalo mas tarde", "#FFFFFF", "#f53d3d");
      }
    })
  }else{
    await utils.showSnackSimple("Debes seleccionar las opciones para poder generar un test.", "#FFFFFF", "#f53d3d");
  }
}

export function openQuizPage(args, preguntas) {
  const mainView: Button = <Button>args.object;
  const option: ShowModalOptions = {
    context: { preguntas: preguntas, categoria: mainView.bindingContext.get("name_selected") },
    closeCallback: (opcion) => {
    },
    fullscreen: true,
    animated: true,
    stretched: true,
  };
  mainView.showModal("src/modales/modal_root_quiz_page/modal_root_quiz_page", option);
  //mainView.showModal("src/pages/resultado_quiz_page/resultado_quiz_page", option);
}