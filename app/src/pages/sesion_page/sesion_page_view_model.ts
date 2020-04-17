import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Observable } from "tns-core-modules/data/observable";
import { SelectedPageService } from "../../../shared/selected-page-service";
import { ObservableProperty } from "../../../shared/observable-property-decorator";
import { Page } from "tns-core-modules/ui";
import { Utils } from '../../utils/utils';
const utils = new Utils();
import { SqliteControlador } from '../../sqlite_controler/sqlite_controler';
const dbapi = new SqliteControlador();
import { SyncController} from '../../sync_controller/sync_controller';
const syncapi = new SyncController();
const Sqlite = require('nativescript-sqlite');
import { device, screen, isAndroid, isIOS } from "tns-core-modules/platform";

export class SesionPageViewModel extends Observable{
  
  constructor(){
    super();
    this.categorias = new ObservableArray<CategoriaModel>();
    dbapi.getCategorias().then(async (categorias_db) => {
      for (var i = 0; i < categorias_db.length; i++) {
        //console.log(JSON.stringify(categorias_db[i]));
        this.categorias.push(new CategoriaModel(categorias_db[i].id_categoria, categorias_db[i].name, categorias_db[i].ambito));
      }
    })
    SelectedPageService.getInstance().updateSelectedPage("Test");
  }
  
  get categorias(): ObservableArray<CategoriaModel> {
    return this.get("_categorias");
  }

  set categorias(value: ObservableArray<CategoriaModel>) {
    this.set("_categorias", value);
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
