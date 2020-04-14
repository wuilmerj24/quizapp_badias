let Sqlite = require('nativescript-sqlite');
var db = null;

export class SqliteControlador{
  public setDatabase(db_tmp) {
    if (db == null) {
      db = db_tmp;
      this.createTables();
    }
    return db;
  }

  public createTables(){
    var sql_user = 'CREATE TABLE IF NOT EXISTS usuario(id INTEGER PRIMARY KEY,uid TEXT,correo TEXT,nom_ape TEXT,foto TEXT)';
    var sql_test = 'CREATE TABLE IF NOT EXISTS test(id INTEGER PRIMARY KEY,id_categoria TEXT,categoria TEXT, nivel_dificultad INTEGER, numero_preguntas INTEGER,duracion INTEGER,ambito INTEGER)';
    var sql_categorias = 'CREATE TABLE categorias(id INTEGER PRIMARY KEY,id_categoria INTEGER UNIQUE,name TEXT,ambito INTEGER)';
    db.execSQL(sql_user);
    db.execSQL(sql_test);
    db.execSQL(sql_categorias);
  }

  public insertUsuario(datos) {
    var sql = "INSERT INTO usuario(uid,correo,nom_ape,foto) VALUES (?,?,?,?)";
    var result = db.execSQL(sql, [datos.uid, datos.correo, datos.nom_ape, datos.foto]);
    return result;
  }

  public getUusario() {
    var sql = "SELECT * FROM usuario";
    var result = db.get(sql, []);
    return result;
  }

  deleteUsers() {
    var sql = "DELETE FROM usuario";
    var result = db.execSQL(sql, []);
    return result;
  }

  insertarCategorias(categorias){
    var sql="INSERT INTO categorias(id_categoria,name,ambito) VALUES (?,?,?)";
    var result=db.execSQL(sql,[categorias.id_categoria,categorias.name,categorias.ambito]);
    return result; 
  }

  public getCategorias() {
    var sql = "SELECT * FROM categorias";
    var result = db.all(sql, []);
    return result;
  }

  public deleteCategorias(){
    var sql = "DELETE FROM categorias";
    var result = db.execSQL(sql, []);
    return result;
  }

  public getMisTests(){
    var sql="SELECT * FROM test";
    var result =db.all(sql,[]);
    return result;
  }

  public insertMiTest(test) {
    var sql = "INSERT INTO test(id_categoria,categoria,nivel_dificultad,numero_preguntas,duracion,ambito) VALUES (?,?,?,?,?,?)";
    var result = db.execSQL(sql, [test.id_categoria, test.categoria, test.nivel_dificultad, test.numero_preguntas, test.duracion,test.ambito]);
    return result;
  }
}