import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Observable, EventData } from "tns-core-modules/data/observable";
import { SelectedPageService } from "../../../shared/selected-page-service";
import { ObservableProperty } from "../../../shared/observable-property-decorator";
import { Page, Button, ShowModalOptions } from "tns-core-modules/ui";
import { Utils } from '../../utils/utils';
const utils = new Utils();
import { SqliteControlador } from '../../sqlite_controler/sqlite_controler';
const dbapi = new SqliteControlador();
import { SyncController } from '../../sync_controller/sync_controller';
const syncapi = new SyncController();
const Sqlite = require('nativescript-sqlite');
import { device, screen, isAndroid, isIOS } from "tns-core-modules/platform";

export class MisTestViewModel extends Observable{
  constructor() {
    super();
    this.categorias = new ObservableArray<MisTestModel>();
    SelectedPageService.getInstance().updateSelectedPage("Mis tests");
    dbapi.getMisTests().then(async (categorias_db) => {
      for (var i = 0; i < categorias_db.length; i++) {
        //console.log(JSON.stringify(categorias_db[i]));
        this.categorias.push(new MisTestModel(categorias_db[i].id_categoria, categorias_db[i].categoria, categorias_db[i].nivel_dificultad, categorias_db[i].numero_preguntas, categorias_db[i].duracion, categorias_db[i].ambito));
      }
    })
  }

  get categorias(): ObservableArray<MisTestModel> {
    return this.get("_categorias");
  }

  set categorias(value: ObservableArray<MisTestModel>) {
    this.set("_categorias", value);
  }

  openSheet(args: EventData) {
    const mainView: Button = <Button>args.object;
    const option: ShowModalOptions = {
      context: {},
      closeCallback: () => {
        while (this.categorias.length > 0) this.categorias.pop();
        dbapi.getMisTests().then(async (categorias_db) => {
          for (var i = 0; i < categorias_db.length; i++) {
            //console.log(JSON.stringify(categorias_db[i]));
            this.categorias.push(new MisTestModel(categorias_db[i].id_categoria, categorias_db[i].categoria, categorias_db[i].nivel_dificultad, categorias_db[i].numero_preguntas, categorias_db[i].duracion, categorias_db[i].ambito));
          }
        })
      },
      fullscreen: true,
      animated: true,
      stretched: true,
    };
    mainView.showModal("src/modales/modal_root_add_test/modal_root_add_test", option);
  }
}

export class MisTestModel {
  public id_categoria: string;
  public categoria:string;
  public nivel_dificultad:number;
  public numero_preguntas:number;
  public duracion:number;
  public ambito:number;

  constructor(id_categoria: string, categoria: string, nivel_dificultad: number, numero_preguntas: number, duracion: number, ambito: number) {
    this.id_categoria = id_categoria;
    this.categoria = categoria;
    this.nivel_dificultad = nivel_dificultad;
    this.numero_preguntas = numero_preguntas;
    this.duracion = duracion;
    this.ambito = ambito;
  }
}