import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Observable } from "tns-core-modules/data/observable";
import { SelectedPageService } from "../../../shared/selected-page-service";
import { ObservableProperty } from "../../../shared/observable-property-decorator";
import { Page, ItemEventData } from "tns-core-modules/ui";
import { Utils } from '../../utils/utils';
const utils = new Utils();
import { SqliteControlador } from '../../sqlite_controler/sqlite_controler';
const dbapi = new SqliteControlador();
const Sqlite = require('nativescript-sqlite');
import { Cache } from "tns-core-modules/ui/image-cache";
const cache = new Cache();
import { fromFile, fromNativeSource } from "tns-core-modules/image-source";
import { confirm, ConfirmOptions } from "tns-core-modules/ui/dialogs";
import * as app from "tns-core-modules/application";
const firebaseWebApi = require("nativescript-plugin-firebase/app");
import * as firebase from "nativescript-plugin-firebase";
import { SyncController} from '../../sync_controller/sync_controller';
const syncapi = new SyncController();
import InAppBrowser from 'nativescript-inappbrowser';
import { openUrl } from 'tns-core-modules/utils/utils'

export class SideMenuModel extends Observable{
  private loading:any;
  private snackbar:any;
  public enlaces_db=[];
  @ObservableProperty() selectedPage: string;
  constructor(){
    super();
    SelectedPageService.getInstance().updateSelectedPage("Test");
    SelectedPageService.getInstance().selectedPage$
    .subscribe((selectedPage: string) => this.selectedPage = selectedPage);
    this.getMisDatos();
    let PackageManager=android.content.pm.PackageManager;
    var pkg = app.android.context.getPackageManager().getPackageInfo(app.android.context.getPackageName(), PackageManager.GET_META_DATA);
    this.set("version_code", pkg.versionName);
  }

  public async getMisDatos() {
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
        this.set("nom_ape", res.nom_ape);
        this.set("correo", res.correo);
      }
    });
    await this.getEnlaces();
  }

  private salir(args) {
    const confirmOptions: ConfirmOptions = {
      title: "Cerrar sesión",
      message: "Quiere cerrar la sesión?",
      okButtonText: "Si",
      cancelButtonText: "No",
      neutralButtonText: " "
    };
    confirm(confirmOptions).then(async(result) => {
      //console.log(result);
      if (result) {
        this.loading = utils.showLoadingSimple("Cerrando sesión", "Por favor espere...", "#FFFFFF", "#ccc", null);
        this.cerrarSesion();
      }
    });
  }

  private cerrarSesion() {
    var navigationOptions = {
      moduleName: 'app-root',
      navigationTransition: {
        duration: 2000,
        curve: "linear",
        name: "flipRight"
      },
      transition: {
        name: "fade"
      },
      //animated: true,
    }
    firebase.logout().then(() => {
      dbapi.deleteUsers();
      this.snackbar = utils.showSnackSimple("Se ha cerrado la sesión correctamente.", "#FFFFFF", "#32db64");
      this.loading.hide();
      setTimeout(()=>{
        this.snackbar.dismiss().then(async () => {
          app._resetRootView(navigationOptions);
        })
      },2000)
    }).catch(error => {
      this.snackbar = utils.showSnackSimple("Se ha generado un error", "#FFFFFF", "#f53d3d");
      this.loading.hide();
    });
  }

  async getEnlaces(){
    var enlaces=[];
    var enlaces_coleccion = await firebase.firestore.collection("enlaces");
    await enlaces_coleccion.get({ source: "server" }).then(async (querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        //enlaces.push()
        enlaces.push({enlace:doc.data().enlace,titulo:doc.data().titulo.toUpperCase()});
        this.enlaces_db.push({enlace:doc.data().enlace,titulo:doc.data().titulo});
      });
      this.set("enlaces", enlaces);
    });
  }

  public async onItemTap(args: ItemEventData) {
    const index = args.index;
    //console.log(`Second ListView item tap ${JSON.stringify(this.enlaces_db[index])}`);
    try{
      var url = this.enlaces_db[index].enlace;
      if(await InAppBrowser.isAvailable()){
        const result = await InAppBrowser.open("http://" + url,{
          showTitle:true,
          toolbarColor:"#00007f",
          secondaryToolbarColor:"black",
          enableUrlBarHiding:true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right'
          }
        })
      } else {
        openUrl(url);
      }
    }catch(err){
      alert({
        title: 'Error',
        message: err.message,
        okButtonText: 'Ok'
      })
    }
  }

}