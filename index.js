//import { db } from 'db.js'
//import { insert_tx } from 'db.js';
//import { read_tx } from './db.js';
//button click
function search(id, text) {
  var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
  var msg;
  var ids = "" + id;
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)');
    console.log(ids);
    tx.executeSql("INSERT INTO LOGS values(?,?)",[ids,text]);
    msg = '<p>Log message created and row inserted.</p>';
    document.querySelector('#status').innerHTML = text;
  });
}


function listen() {
  //press enter
  var id = 0;
  var input = document.getElementById("myInput");
  input.addEventListener("keyup", function (event) {
    //console.log(event.key)
    if (event.key === 'Enter') {
      event.preventDefault();
      search(id ,input.value);
      id = id+1;
    }
  });
}

listen();