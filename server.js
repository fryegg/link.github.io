export class CRUD {
    constructor(path) {
        let sqlite3;
        let db;
        sqlite3 = require('sqlite3').verbose();
        db = new sqlite3.Database(path); //'./nomad_project.db'
        this.db = db;
    }
    // id, url, wordnum
    // parameter to add : table name, column name
  created() {
        let sql = 'CREATE TABLE IF NOT EXISTS linksaver(id integer primary key, url text not null, wordnum text unique)';
        this.db.run(sql);
        this.db.close();
    }

   inserted(url, wordnum) {
        let data = [url, wordnum];
        let sql = `INSERT INTO linksaver(url, wordnum) VALUES(?,?)`
        this.db.run(sql, data, function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
        this.db.close();
    }
    readed(wordnum) {
        let data = [wordnum];
        let sql = `SELECT * FROM linksaver
            WHERE wordnum = ?`;
        this.db.all(sql, data, (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row);
            });
        });
        this.db.close();
    }

   updated() {
        let data = ['Ansi C', 'C'];
        let sql = `UPDATE linksaver
            SET name = ?
            WHERE name = ?`;

        this.db.run(sql, data, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row(s) updated: ${this.changes}`);
        });

    }
    // insert one row into the student table
    deleted() {
        let id = 1;
        let sql = `DELETE FROM linksaver WHERE rowid=?`;
        this.db.run(sql, id, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row(s) deleted ${this.changes}`);
        });
    }

};

//crud = new CRUD('./nomad_project.db');
//crud.created();
//crud.inserted('naver.com', 'helloworld02');
//crud.readed('helloworld02')