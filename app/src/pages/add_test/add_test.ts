import { AddTestViewModel} from "./add_test_view_model";
import { Button, ShowModalOptions, Page, TextField } from "tns-core-modules/ui";
import { action, ActionOptions } from "tns-core-modules/ui/dialogs";
import * as app from "tns-core-modules/application";
const Color = require("tns-core-modules/color").Color;
let id_categoria_selected=null;
let ambito_categoria_selected=null;
let nivel_dificultad_selected=null;
let pagina=null;
import { Utils } from '../../utils/utils';
const utils = new Utils();
import { SqliteControlador } from '../../sqlite_controler/sqlite_controler';
import { LoadingIndicator, Mode, OptionsCommon } from '@nstudio/nativescript-loading-indicator';
const indicator = new LoadingIndicator();
const dbapi = new SqliteControlador();
import { SnackBar, SnackBarOptions } from "@nstudio/nativescript-snackbar";
import { fromObject } from "tns-core-modules/data/observable/observable";
const snackbar = new SnackBar();
let actualFrame = null;

export function onLoaded(args) {
  const page:Page =<Page> args.object;
  let viewModel = new AddTestViewModel();
  page.bindingContext = viewModel;
  pagina=page;
  actualFrame = page.frame.bindingContext;
  if (app.android) {
    app.android.on(app.AndroidApplication.activityBackPressedEvent, backEvent);
  }
  page.bindingContext.set("pagina", actualFrame.get("pagina"))
}

export function regresar(args){
  args.object.closeModal({ result:null});
}

export function onFocus(args){
  const parent = args.object.parent;
  const label = parent.getChildAt(0);
  const textField = parent.getChildAt(1);
  label.animate({
    translate: { x: 0, y: - 25 },
    opacity: 1,
  }).then(() => { }, () => { });

  textField.borderBottomColor = new Color('#00007f');
}

export function onBlur(args){
  const parent = args.object.parent;
  const label = parent.getChildAt(0);
  const textField = parent.getChildAt(1);

  // if there is text in our input then don't move the label back to its initial position.
  if (!textField.text) {
    label.animate({
      translate: { x: 0, y: 0 },
      opacity: 0.4
    }).then(() => { }, () => { });
  }
  // reset border bottom color.
  textField.borderBottomColor = new Color('#fe0000');
}

export function openCategorias(args) {
  const mainView: Button = <Button>args.object;
  const option: ShowModalOptions = {
    context: { categorias: mainView.bindingContext.get("categorias") },
    closeCallback: (opcion) => {
      // Receive data from the modal view. e.g. username & password
      if (opcion != null || opcion != undefined) {
        if (opcion.code_error == 0) {
          mainView.bindingContext.set("value_categoria_selected", opcion.data.name);
          id_categoria_selected = opcion.data.id_categoria;
          mainView.bindingContext.set("id_categoria_selected", opcion.data.id_categoria);
          ambito_categoria_selected = opcion.data.ambito;
          mainView.bindingContext.set("ambito_categoria_selected", opcion.data.ambito);
          mainView.bindingContext.set("ambito", opcion.data.ambito);
          cheFormStatus();
        }
      }
    },
    fullscreen: false,
    animated: true,
    stretched: false,
  }
  mainView.showModal("src/modales/modal_list_categorias/modal_list_categorias", option);
}

export function openDificultad(args) {
  const mainView: Button = <Button>args.object;
  const actionOptions: ActionOptions = {
    title: "Seleccione nivel de dificultad",
    cancelButtonText: "Cancelar",
    actions: ["Facil", "Medio", "Dificil"],
    cancelable: true // Android only
  };

  action(actionOptions).then((result) => {
    if (result === "Facil") {
      mainView.bindingContext.set("value_dificultad_selected", result);
      mainView.bindingContext.set("nivel_dificultad_selected", 1);
      nivel_dificultad_selected = 1;
    } else if (result === "Medio") {
      mainView.bindingContext.set("nivel_dificultad_selected", 2);
      mainView.bindingContext.set("value_dificultad_selected", result);
      nivel_dificultad_selected = 2;
    } else if (result === "Dificil") {
      mainView.bindingContext.set("nivel_dificultad_selected", 3);
      mainView.bindingContext.set("value_dificultad_selected", result);
      nivel_dificultad_selected = 3;
    }
    cheFormStatus();
  });
}

export function numeroPreguntasChange(args) {
  const txt = args.object;
  if (txt.text.length > 0) {
    txt.bindingContext.set("show_error_num_preguntas", false);
  } else {
    txt.bindingContext.set("show_error_num_preguntas", true);
  }
  cheFormStatus();
}

export function nombreChange(args) {
  const txt = args.object;
  if (txt.text.length > 0) {
    txt.bindingContext.set("show_error_nombre", false);
  } else {
    txt.bindingContext.set("show_error_nombre", true);
  }
  cheFormStatus();
}

export function tiempoChange(args) {
  const txt = args.object;
  if (txt.text.length > 0) {
    txt.bindingContext.set("show_error_num_preguntas", false);
  } else {
    txt.bindingContext.set("show_error_num_preguntas", true);
  }
  cheFormStatus();
}

export function cheFormStatus() {
  //const page = args.object;
  var nombre_text = pagina.getViewById("nombre_id");
  var numero_preguntas_text = pagina.getViewById("numer_preguntas_id");
  var tiempo_id_text = pagina.getViewById("tiempo_id");
  if (nombre_text.text.length > 0 && id_categoria_selected != null && nivel_dificultad_selected >= 1 && numero_preguntas_text.text.length > 0 && tiempo_id_text.text.length > 0) {
    pagina.bindingContext.set("btn_enabled", true);
  } else {
    pagina.bindingContext.set("btn_enabled", false);
  }
}

export function backEvent(args) {
  //if (iRefuseToGoBack) { args.cancel = true; }
  args.object.closeModal({result:null});
}