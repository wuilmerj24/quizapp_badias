import { RevisarRespViewModel} from "./revisar_respuestas_pages_view_model";
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

export function onLoaded(args) {
  let viewModel = new RevisarRespViewModel();
  const page = args.object;
  page.bindingContext = viewModel;
  if (app.android) {
    app.android.on(app.AndroidApplication.activityBackPressedEvent, backEvent);
  }
  actualFrame = page.frame.bindingContext;
  var vm=fromObject({
    respuestas: actualFrame.get("respuestas"),
  })  
  page.bindingContext=vm;
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