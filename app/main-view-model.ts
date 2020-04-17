import { Observable } from "tns-core-modules/data/observable";
import * as app from "tns-core-modules/application";
import * as firebase from "nativescript-plugin-firebase";
import {User} from 'nativescript-plugin-firebase';
import { Utils } from './src/utils/utils';
const utils = new Utils();
import { SqliteControlador } from './src/sqlite_controler/sqlite_controler';
const dbapi = new SqliteControlador();
const Sqlite = require('nativescript-sqlite');
const firebaseWebApi = require("nativescript-plugin-firebase/app");
import { SyncController } from './src/sync_controller/sync_controller';
const syncapi = new SyncController();

export class MainViewModel extends Observable {
    private loading:any;
    private snackbar:any;
    constructor() {
        super();
        syncapi.getCategorias();
        syncapi.getPreguntas();
    }

    public async login() {
        this.loading = utils.showLoadingSimple("Buscando cuentas.", "Por favor espere...", "#FFFFFF", "#ccc", null)
        firebase.login({
            type: firebase.LoginType.GOOGLE,
        }).then(async (result?: User) => {
            dbapi.insertUsuario({ uid: result.uid, correo: result.email, foto: result.photoURL, nom_ape: result.displayName }).then(async (result_insert) => {
                //console.log(JSON.stringify(result_insert));
                this.changePage();
            }).catch(async (err) => {
                //console.log("Error insert user: ", JSON.stringify(err));
            })  
        }, async (err) => {
            this.loading.hide();
            this.snackbar = await utils.showSnackSimple("Se ha generado un error", "#FFFFFF", "#f53d3d");
            //console.log(JSON.stringify(err));
        })
    }

    async changePage() {
        var navigationOptions = {
            moduleName: './src/pages/sesion_preview/sesion_preview',
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
        //frameModule.topmost().navigate(navigationOptions);
        this.snackbar = await utils.showSnackSimple("Iniciando sesion espere", "#FFFFFF", "#32db64");
        this.loading.hide();
        setTimeout(() => {
            this.snackbar.dismiss().then(async () => {
                app._resetRootView(navigationOptions);
            })
        }, 2500);
    }
}
