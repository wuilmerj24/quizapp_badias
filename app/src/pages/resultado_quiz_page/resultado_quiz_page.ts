import { ResultadoQuizViewModel} from "./resultado_quiz_page_view_model";
import * as app from "tns-core-modules/application";
import { Observable, EventData, fromObject } from "tns-core-modules/data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Frame, View, Page } from "tns-core-modules/ui/frame";
import { SyncController } from '../../sync_controller/sync_controller';
const syncapi = new SyncController();
import { Utils } from '../../utils/utils';
const utils = new Utils();
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import { ShowModalOptions } from "tns-core-modules/ui/core/view";

let actualFrame=null;
let correctas=0;
export function onLoaded(args){
  let viewModel = new ResultadoQuizViewModel();
  const page = args.object;
  page.bindingContext = viewModel;
  
  if (app.android) {
    app.android.on(app.AndroidApplication.activityBackPressedEvent, backEvent);
  }
  actualFrame = page.frame.bindingContext;
  var contador:number = actualFrame.get("respuestas").length;
  for (var i = 0; i < actualFrame.get("respuestas").length;i++){
    //console.log(JSON.stringify(actualFrame.get("respuestas")[i]));
    if (actualFrame.get("respuestas")[i].respuesta_correcta == actualFrame.get("respuestas")[i].opcion_seleccionada){
      correctas++;
    }
  }
  var puntuacion = correctas / actualFrame.get("respuestas").length * 100;
  let vm = fromObject({
    total_preguntas: actualFrame.get("respuestas").length+1,
    puntuacion: puntuacion.toFixed(2)+"%",
    respuestas_correctas: correctas + "/" + actualFrame.get("respuestas").length + 1,
    respuestas_incorrectas: (actualFrame.get("respuestas").length+1)-correctas,
  });
  page.bindingContext=vm;
  //alert(JSON.stringify(actualFrame.get("respuestas")));
}

export function regresar(args) {
  args.object.closeModal();
}

export function backEvent(args) {
  args.object.closeModal();
}

export function pageUnloaded(args) {
  if (app.android) {
    app.android.off(app.AndroidApplication.activityBackPressedEvent, backEvent);
  }
}

export function revisar(args){
  const mainView = args.object;
  const option: ShowModalOptions = {
    context: { respuestas: actualFrame.get("respuestas") },
    closeCallback: () => {

    },
    fullscreen: true
  };
  mainView.showModal("src/modales/modal_root_revisar_respuestas/modal_root_revisar_respuestas", option);
  setTimeout(() => {
    args.object.closeModal();
  }, 50)
}