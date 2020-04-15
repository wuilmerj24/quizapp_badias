import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Observable } from "tns-core-modules/data/observable";
import { Utils } from '../../utils/utils';
const utils = new Utils();
import { SqliteControlador } from '../../sqlite_controler/sqlite_controler';
const dbapi = new SqliteControlador();
import { SyncController } from '../../sync_controller/sync_controller';
const syncapi = new SyncController();
import { ShowModalOptions } from "tns-core-modules/ui/core/view";
import { Button, TextField, Page } from "tns-core-modules/ui";
import { action, ActionOptions } from "tns-core-modules/ui/dialogs";
import { LoadingIndicator, Mode, OptionsCommon } from '@nstudio/nativescript-loading-indicator';
const indicator = new LoadingIndicator();
import { SnackBar, SnackBarOptions } from "@nstudio/nativescript-snackbar";
const snackbar = new SnackBar();

export class AddTestViewModel extends Observable {
  private id_categoria_selected=null;
  private ambito_categoria_selected=null;
  private nivel_dificultad_selected=null;
  constructor() {
    super();
    this.categorias = new ObservableArray<CategoriaModel>();
    dbapi.getCategorias().then(async (categorias_db) => {
      for (var i = 0; i < categorias_db.length; i++) {
        //console.log(JSON.stringify(categorias_db[i]));
        this.categorias.push(new CategoriaModel(categorias_db[i].id_categoria, categorias_db[i].name, categorias_db[i].ambito));
      }
    }) 
    this.set("show_error_categoria",false);  
    this.set("show_error_dificultad",false);  
    this.set("show_error_num_preguntas",false);  
    this.set("show_error_tiempo",false);  
    this.set("btn_enabled",false);  
    this.set("pagina",null);  
    
  }

  get categorias(): ObservableArray<CategoriaModel> {
    return this.get("_categorias");
  }

  set categorias(value: ObservableArray<CategoriaModel>) {
    this.set("_categorias", value);
  }

  public async guardar(args){
    const btn: Button = <Button>args.object;
    const page: Page = <Page>btn.page;
    const options = {
      message: "Guardando test",
      details: "Por favor espere...",
      progress: 0.65,
      margin: 0,
      dimBackground: true,
      color: "#FFFFFF",
      backgroundColor: "#000000",
      userInteractionEnabled: false,
      hideBezel: true,
      mode: Mode.Indeterminate,
      android: {
        //view: view,
        cancelable: false,
      },
      ios: {
        //view: view,
        square: false,
      }
    };
    var loading=await indicator.show(options);
    //var loading = await utils.showLoadingSimple("Guardando test", "Por favor espere...", "#FFFFFF", "#000000",null);
    var nombre_text: TextField = <TextField>page.getViewById("nombre_id");
    var numero_preguntas_text: TextField = <TextField>page.getViewById("numer_preguntas_id");
    var tiempo_id_text: TextField =<TextField> page.getViewById("tiempo_id");
    tiempo_id_text.dismissSoftInput();
    dbapi.insertMiTest({ id_categoria: this.get("id_categoria_selected"), categoria: this.get("value_categoria_selected"), nivel_dificultad: this.get("nivel_dificultad_selected"), numero_preguntas: numero_preguntas_text.text, duracion: tiempo_id_text.text, ambito: this.get("ambito"), titulo_nombre_categoria: nombre_text.text}).then(async(result)=>{
      indicator.hide();
      args.object.closeModal({result:true});
    }).catch(async(err)=>{
      indicator.hide();
      args.object.closeModal({result:false});
      console.log(err);
    })
  }
}

export class CategoriaModel {
  public id_categoria: number;
  public name;
  public ambito;

  constructor(id_categoria: number, name: string, ambito: number) {
    this.id_categoria = id_categoria;
    this.name = name;
    this.ambito = ambito;
  }
}