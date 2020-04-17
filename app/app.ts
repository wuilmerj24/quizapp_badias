import * as application from "tns-core-modules/application";
import * as firebase from "nativescript-plugin-firebase";
import { Utils} from './src/utils/utils';
const utils = new Utils();
import {SqliteControlador} from './src/sqlite_controler/sqlite_controler';
const dbapi=new SqliteControlador();
const Sqlite = require('nativescript-sqlite');

firebase.init({
  persist: false,
}).then(
  function () {
    console.log("firebase.init done");
  },
  function (error) {
    console.log("firebase.init error: " + error);
  }
);

//Sqlite.deleteDatabase("dexamen.db");
new Sqlite("dexamen.db").then(async (db_tmp) => {
  db_tmp.resultType(Sqlite.RESULTSASOBJECT);
  dbapi.setDatabase(db_tmp);
  dbapi.getUusario().then(async (res) => {
    //console.log(res)
    if (res != null || res != undefined) {
      application.run({ moduleName: "./src/pages/sesion_preview/sesion_preview" });
    } else {
      application.run({ moduleName: "app-root" });
    }
  });
}, error => {
  console.log("error create data: ", error);
});