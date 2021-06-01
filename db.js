var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

function insert_tx(tx) {
    var msg;
    tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)');
    msg = '<p>Log message created and row inserted.</p>';
    document.querySelector('#status').innerHTML = msg;
}

function read_tx(tx) {
    var msg;
    tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) {
        var len = results.rows.length, i;
        msg = "<p>Found rows: " + len + "</p>";
        document.querySelector('#status').innerHTML += msg;

        for (i = 0; i < len; i++) {
            msg = "<p><b>" + results.rows.item(i).log + "</b></p>";
            document.querySelector('#status').innerHTML += msg;
        }
    }, null);
};