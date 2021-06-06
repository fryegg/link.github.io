//import { db } from 'db.js'
//import { insert_tx } from 'db.js';
//import { read_tx } from './db.js';
//button click
import { CRUD } from './server.js';
function isURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  var pattern = new RegExp(regex); 
return pattern.test(str);
}

function random_word(callback) {
  var request = new XMLHttpRequest()
  fetch("https://random-word-api.herokuapp.com/word?number=1")
    .then((response) => response.json())
    .then((data) => {
      callback(data[0]);
    });
}

function search(id, url) {
  var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
  var msg;
  var ids = "" + id;
  var len;
  var wordnum;
  var word = ""
  random_word(function (word) {
    num = Math.floor(Math.random() * 100);
    wordnum = word + num.toString()
    db.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, url, wordnum, time)');
      tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) {
        var rows = results.rows;
        len = rows.length;
        msg = "<p>Found rows: " + len + "</p>";
        //document.querySelector('#status').innerHTML += msg;
        if (len == 0) {
          tx.executeSql("INSERT INTO LOGS values(?,?,?,?)", [0, url, wordnum, Date.now()]);
        }
        else {
          tx.executeSql("INSERT INTO LOGS values(?,?,?,?)", [rows[len - 1].id + 1, url, wordnum, Date.now()]);
        }
        //tx.executeSql('UPDATE LOGS SET log = (?) WHERE id = (?)',[url,0]);
      }, null);
      //msg = '<p>Log message created and row inserted.</p>';
      document.querySelector('#status').innerHTML = wordnum;
    });
  });
}

function delete_by_time() {
  var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, url, wordnum, time)');
    tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) {
      var rows = results.rows;
      var len = rows.length;
      for (var i = 0; i < len; i++) {
        var cur_item = rows[i]; // or u can use the item methid ---> var cur_item = rows.item(i);
        var lapse = (Date.now() - cur_item.time) / 1000
        // over 30 seconds
        if (lapse > 300) {
          console.log("hey bye!!!");
          tx.executeSql('DELETE FROM LOGS WHERE id=?', [cur_item.id]);
        }
        //console.log("the id is : " + cur_item.id + " the data is : " + cur_item.url);
      }
      //tx.executeSql('UPDATE LOGS SET log = (?) WHERE id = (?)',[url,0]);
    }, null);
  });
  setTimeout(delete_by_time, 10000);
}

function wordnum_to_url(id, url) {
  var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
  db.transaction(function (tx) {
    tx.executeSql('SELECT url FROM LOGS WHERE wordnum LIKE ?', [url], function (tx, results) {
      console.log(results);
      var rows = results.rows;
      document.querySelector('#status2').innerHTML = rows[0].url;
    }, null);
  });
}

function listen() {
  //press enter
  var id = 0;
  var input = document.getElementById("myInput");
  var input2 = document.getElementById("myInput2");
  input.addEventListener("keyup", function (event) {
    //console.log(event.key)
    if (event.key === 'Enter') {
      event.preventDefault();
      search(id, input.value);
      id = id + 1;
    }
  });
  input2.addEventListener("keyup", function (event) {
    //console.log(event.key)
    if (event.key === 'Enter') {
      event.preventDefault();
      wordnum_to_url(id, input2.value);
      id = id + 1;
    }
  });
}

function button1() {
  var id = 0;
  var input = document.getElementById("myInput");
  search(id, input.value);
  id = id + 1;
}
function button2() {
  var id = 0;
  var input2 = document.getElementById("myInput2");
  wordnum_to_url(id, input2.value);
  id = id + 1;
}
//crud = new CRUD('./nomad_project.db');
//crud.created();
//crud.inserted('naver.com', 'helloworld02');
//crud.readed('helloworld02')
listen();
delete_by_time();
server();