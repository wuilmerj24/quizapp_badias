import { QuizPageViewModel} from "./quiz_page_view_model";
import * as app from "tns-core-modules/application";
import { Observable, EventData, fromObject } from "tns-core-modules/data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Frame, View, Page } from "tns-core-modules/ui/frame";
import { SyncController } from '../../sync_controller/sync_controller';
const syncapi = new SyncController();
import { Utils } from '../../utils/utils';
const utils = new Utils();
import { CheckBox } from '@nstudio/nativescript-checkbox';
import { topmost } from 'tns-core-modules/ui/frame';
import { Button, StackLayout } from "tns-core-modules/ui";
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import { ShowModalOptions } from "tns-core-modules/ui/core/view";
import { Color } from "tns-core-modules/color";
import { AnimationCurve } from "tns-core-modules/ui/enums";

let actualFrame=null;
let respuesta_ant_selected=null;
let respuesta_selected=[];
let selecciono_respuesta=false;
let vm=null;
let position_pregunta=0;
let preguntas;
export function onLoaded(args) {
  let viewModel = new QuizPageViewModel();
  const page = args.object;
  page.bindingContext = viewModel;
  if (app.android) {
    app.android.on(app.AndroidApplication.activityBackPressedEvent, backEvent);
  }
  actualFrame = page.frame.bindingContext;
  preguntas=actualFrame.get("preguntas");
  console.log(preguntas[0].opciones.A);
  vm=fromObject({
    titulo_categoria: actualFrame.get("categoria"),
    titulo_pregunta:preguntas[position_pregunta].titulo,
    opcion_a: preguntas[position_pregunta].opciones.A,
    opcion_b: preguntas[position_pregunta].opciones.B,
    opcion_c: preguntas[position_pregunta].opciones.C,
    opcion_d: preguntas[position_pregunta].opciones.D,
    numero_pregunta:position_pregunta+1,
    titulo_btn:"Continuar",
  });
  page.bindingContext=vm;
}

export function regresar(args) {
  //args.object.closeModal();
  const confirmOptions: ConfirmOptions = {
    message: "Quieres abandonar el test?",
    okButtonText: "Si",
    cancelButtonText: "No",
    neutralButtonText: " "
  };
  confirm(confirmOptions).then((result) => {
    //console.log(result);
    if (result) {
      args.object.closeModal();
    }
  });
}

export function backEvent(args) {
  args.cancel=true;
  const confirmOptions: ConfirmOptions = {
    message: "Quieres abandonar el test?",
    okButtonText: "Si",
    cancelButtonText: "No",
    neutralButtonText: " "
  };
  confirm(confirmOptions).then((result) => {
    //console.log(result);
    if (result){
      args.object.closeModal();
    }
  });

}

export function pageUnloaded(args) {
  actualFrame = null;
  respuesta_ant_selected = null;
  respuesta_selected = [];
  selecciono_respuesta = false;
  vm = null;
  position_pregunta = 0;
  preguntas;
  if (app.android) {
    app.android.off(app.AndroidApplication.activityBackPressedEvent, backEvent);
  }
}

export function toggleCheck(args) {
  const btn=args.object;
  const page=btn.page;
  const toggleTest = page.getViewById(btn.id);
  if (respuesta_ant_selected!=null){
    const toggleTest_ant = page.getViewById(respuesta_ant_selected);
    toggleTest_ant.checked=false;
  }
  respuesta_ant_selected=btn.id;
  selecciono_respuesta=true;
}


export async function continuar(args){
  const btn=args.object;
  const page=btn.page;
  const container_card =<StackLayout>page.getViewById("container_card");
  const toggleTest = page.getViewById(respuesta_ant_selected);
  toggleTest.android.setChecked(false);
  container_card.animate({
    opacity: 0,
    duration: 500
  }).then(async()=>{
    container_card.opacity=1;
    if (!selecciono_respuesta){
    utils.showSnakcView("Debes seleccionar una respuesta", "#FFFFFF", "#f53d3d",page.layoutView);
    return null;
  }
  //await removeCheckSelected(page);
  //toggleTest.checked =  false;
  if (position_pregunta < (preguntas.length-1)){
    selecciono_respuesta=false;
    //se debe sumar y actualizar las preguntas
    let res = await getRespuestaCorrecta(toggleTest);
    respuesta_selected.push({
      titulo: preguntas[position_pregunta].titulo,
      respuesta_correcta: preguntas[position_pregunta].respuesta,
      opcion_seleccionada: res,
      titulo_respuesta_seleccionada:toggleTest.text,
    });
    position_pregunta++;
    page.bindingContext.set("numero_pregunta",position_pregunta+1);
    page.bindingContext.set("titulo_pregunta", preguntas[position_pregunta].titulo);
    page.bindingContext.set("opcion_a", preguntas[position_pregunta].opciones.A);
    page.bindingContext.set("opcion_b", preguntas[position_pregunta].opciones.B);
    page.bindingContext.set("opcion_c", preguntas[position_pregunta].opciones.C);
    page.bindingContext.set("opcion_d", preguntas[position_pregunta].opciones.D);
    
    //console.log(JSON.stringify(preguntas[position_pregunta]));
  }else{
    //se debe pasar a la pagina de resultados
    //console.log(position_pregunta + " es mayor " + (preguntas.length-1));
    const mainView=args.object;
    const option: ShowModalOptions = {
      context: {respuestas:respuesta_selected },
      closeCallback: () => {
        
      },
      fullscreen: true
    };
    mainView.showModal("src/modales/modal_root_resultado_quiz/modal_root_resultado_quiz", option);
    setTimeout(()=>{
      args.object.closeModal();
    },50)
  }
  })

  if (position_pregunta == (preguntas.length - 1)) {
    page.bindingContext.set("titulo_btn", "Enviar");
  }
}

function removeCheckSelected(page) {
  const toggleTest_ant = page.getViewById(respuesta_ant_selected);
  toggleTest_ant.checked = false;
}

function getRespuestaCorrecta(toggleTest){
  if(toggleTest.id=="opcion_a"){
    return "A";
  } else if (toggleTest.id=="opcion_b"){
    return "B";
  } else if (toggleTest.id=="opcion_c"){
    return "C";
  } else if (toggleTest.id=="opcion_d"){
    return "D";
  }
}


export function onCheckLoaded(args:EventData){
  const view=args.object as View;
  const androidCheckbox=view.android as android.widget.CheckBox;
  const context =app.android.context;
  // const res=context.getResources().getIdentifier('my_checkbox','layout',context.getPackageName());
  // androidCheckbox.setBackgroundResource(res);
  //setTimeout(async()=>{
    //androidCheckbox.setTextSize
    //const text = androidCheckbox.getText();
    //const texto=await wordWrap(text,40);
    //\androidCheckbox.setText(texto);
  //},20)
}

function wordWrap(str, maxWidth) {
  var newLineStr = "\n";
  var done = false; 
  var res = '';
  while (str.length > maxWidth) {
    var found = false;
    // Inserts new line at first whitespace of the line
    for (var i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join('');
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }
    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res += [str.slice(0, maxWidth), newLineStr].join('');
      str = str.slice(maxWidth);
    }

  }

  return res + str;
}

function testWhite(x) {
  var white = new RegExp(/^\s$/);
  return white.test(x.charAt(0));
};