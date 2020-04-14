import * as firebase from "nativescript-plugin-firebase";
import {firestore, push} from "nativescript-plugin-firebase";
import {SqliteControlador} from '../sqlite_controler/sqlite_controler';
import { device, screen, isAndroid, isIOS } from "tns-core-modules/platform";
const dbapi=new SqliteControlador();
import { SecureStorage } from "nativescript-secure-storage";

// instantiate the plugin
let secureStorage = new SecureStorage();

export class SyncController{
  public secureStorage=secureStorage;
  private preguntas:any[]=[];
  constructor(){
    
  }

  async getCategorias(){
    var categorias_coleccion = await firebase.firestore.collection("categorias").orderBy("id", "asc");
    await categorias_coleccion.get({ source: "server" }).then(async (querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        //console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        await dbapi.insertarCategorias({ id_categoria: doc.data().id, name: doc.data().name, ambito: doc.data().ambito}).then(async(result)=>{
        }).cath(async(err)=>{
          //console.log("Err inser categoria: ",JSON.stringify(err));
        })
      });
    });
  }
 
  async getPreguntas(){
    var preguntas:any=[];
    var preguntas_coleccion = await firebase.firestore.collection("preguntas").orderBy("id", "asc");
    await preguntas_coleccion.get({ source: "server" }).then(async (querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        //console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        preguntas.push({ 
          id: doc.data().id,
          ambito: doc.data().ambito,
          dificultad: doc.data().dificultad,
          incompatibilidad: doc.data().incompatibilidad,
          opciones: doc.data().opciones,
          respuesta: doc.data().respuesta,
          titulo: doc.data().titulo,
        });
      });
      secureStorage.set({
        key: "preguntas",
        value: JSON.stringify(preguntas),
      }).then(
        function (success) {
          //console.log("Successfully set a value? " + success);
        }
      );
    });
  }

  async getTotalPreguntas(){
    return secureStorage.get({
      key: "preguntas"
    }).then(
      function (value) {
        var preguntas=JSON.parse(value);
        return preguntas.length;
      }
    );
  }
  
  async getPreguntasLocalStorage(){
    return secureStorage.get({
      key: "preguntas"
    }).then(
      function (value) {
        var preguntas=JSON.parse(value);
        return preguntas;
      }
    );
  }

  public async generarPreguntas(dificultad:number,ambito:number,total:number){
    var preguntas=[];
    var total_rows=await this.getTotalPreguntas();
    var preguntas_storage=await this.getPreguntasLocalStorage();
    for (var i = 0; i < total_rows;i++){
      var isCompatible=await this.checkCompatibilidad(preguntas_storage, i, total_rows);
      if (preguntas_storage[i].dificultad == dificultad && preguntas_storage[i].ambito==ambito && !isCompatible){
        preguntas.push(preguntas_storage[i]);
      }
    }
    var lista=await this.listPreguntas(preguntas,total);
    return lista;
  }

  private async checkCompatibilidad(preguntas, i, total_rows){
    if (i <= total_rows){
      var cont = i + 1;
      if(preguntas[i].ambito==preguntas[1].incompatibilidad){
        return true;
      }
    }
    return false;
  }

  private async listPreguntas(lista, total){
    var preguntas=[];
    for (var i =0;i<total;i++){
      preguntas.push(lista[i]);
    }
    return preguntas;
  }

  public async getEnlaces(){
    var enlaces_coleccion = await firebase.firestore.collection("enlaces");
    await enlaces_coleccion.get({ source: "server" }).then(async (querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        //console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        
      });
    });
  }
}