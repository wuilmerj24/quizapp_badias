import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Observable } from "tns-core-modules/data/observable";
import {Page } from "tns-core-modules/ui";
import { Utils } from '../../utils/utils';
const utils = new Utils();
import { SqliteControlador } from '../../sqlite_controler/sqlite_controler';
const dbapi = new SqliteControlador();
import { SyncController} from '../../sync_controller/sync_controller';
const syncapi= new SyncController();
const Sqlite = require('nativescript-sqlite');
import { Cache } from "tns-core-modules/ui/image-cache";
const cache = new Cache();
import { fromFile, fromNativeSource } from "tns-core-modules/image-source";

export class SesionPreviewViewModel extends Observable{
  constructor(){
    super();
    this.getMisDatos();
  }

  private async getMisDatos(){
    dbapi.getUusario().then(async (res) => {
      if (res != null || res != undefined) {
        //console.log(res)
        cache.enableDownload();
        let cachedImageSource;
        const url = res.foto;
        const myImage = cache.get(url);
        if (myImage) {
          // If present -- use it.
          cachedImageSource = fromNativeSource(myImage);
          this.set("foto", cachedImageSource);
        } else {
          // If not present -- request its download + put it in the cache.
          cache.push({
            key: url,
            url: url,
            completed: (image, key) => {
              if (url === key) {
                cachedImageSource = fromNativeSource(image);
                this.set("foto", cachedImageSource); // set the downloaded iamge
              }
            }
          });
        }
        this.set("nom_ape",res.nom_ape);
      } 
    });
  }
}