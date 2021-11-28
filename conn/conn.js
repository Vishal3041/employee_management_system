var mysql = require('mysql2');

var con = mysql.createConnection({

    host : 'localhost',
    user : 'root',
    password : 'Vishal@123',
    database : 'login'
});

con.connect((err) => {
    if(err) throw err;
    console.log('Database Connected..');
});

module.exports = con;