//chalenge 20 bread sqlite3,npm,bread,express,
//buat web bread html dan css menggunakan sqlite3

const express = require('express') //*settingan express
const app = express(); //*settingan express

const path = require('path'); //*settingan directory
let fs = require('fs'); //*settingan fs

const port = 3000 //?setting port localhost

var bodyParser = require('body-parser'); //*settingan bodyparser

const sqlite3 = require('sqlite3').verbose(); //*settingan sqlite3 
const dbFile = __dirname + "/bread.db" //*directory file database
let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if (err) throw err;
    console.log("koneksi ke database berhasil!");
}); //*settingan pesan error dan berhasil database

module.exports = db; //*settingan database
app.use(bodyParser.urlencoded({ //*settingan bodyparser
    extended: false
}))

app.use(bodyParser.json()) //*settingan bodyparse json
app.use('/', express.static(path.join(__dirname, 'public'))); //*settingan static express directory public
app.set('views', path.join(__dirname, 'views')); //*settingan directory 
app.set('view engine', 'ejs'); //*settingan engine ejs


app.get('/', (req, res) => {
    let result = [];
    let filterData = false;

    if (req.query.check_id && req.query.id) {
        result.push(`id =${req.query.id}`);
        filterData = true;
    }
    if (req.query.check_String && req.query.String) {
        result.push(`String =${req.query.String}`)
        filterData = true;
    }
    if (req.query.check_Integer && req.query.Integer) {
        result.push(`Integer='${req.query.Integer}'`)
        filterData = true;
    }
    if (req.query.check_Float && req.query.Float) {
        result.push(`Float=${req.query.Float}`);
        filterData = true;
    }

    if (req.query.check_Date && req.query.starDate && req.query.endDate) {
        result.push(`Date BETWEEN ${req.query.starDate} AND ${req.query.endDate}`);
        filterData = true;
    }
    if (req.query.check_boolean && req.query.Boolean) {
        console.log('ini masuk');
        result.push(`Boolean = '${req.query.Boolean}'`)
        filterData = true;
    }
    let sql2 = ` SELECT COUNT (*) AS total FROM bread `;
    if (filterData) {
        sql2 = sql2 + `WHERE ${result.join(' AND ')}`;
    }


    db.all(sql2, (err, count) => {
        if (err) throw err;
        const page = req.query.page || 1;
        const limit = 5;
        const offset = (page - 1) * limit;
        const total = count[0].total;
        console.log(count)
        console.log(`ini total=${total}`);

        const pages = Math.ceil(total / limit);
        console.log(`${pages}`);

        let sql = 'SELECT * from bread';
        if (filterData) {
            sql = sql + `WHERE ${result.join('AND')}`
            console.log(sql)
        }
        sql = sql + `LIMIT ${limit} OFFSET ${offset}`;
        console.log(sql)
        db.all(sql, (err, row) => {
            if (err) {
                return console.error(err.message);

            }
            res.render('index', {
                data: row,
                query: req.query,
                page,
                pages
            });
        });
    });
});

app.get('/add', function (req, res) {
    res.render('add')
})

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', function (req, res) {
    const {
        String,
        Integer,
        Float,
        Date,
        Boolean
    } = req.body
    let sql = `INSERT INTO bread (String, Integer, Float,Date,Boolean) VALUES ('${String}','${Integer}','${Float}','${Date}','${Boolean}')`;
    console.log(sql);
    db.run(sql, (err) => {
        if (err) throw err;
        res.redirect('/')
    })

})

app.get('/delete/:id', function (req, res) {
    let id = req.params.id
    let sql = 'DELETE FROM bread WHERE id = ?';
    db.run(sql, [id], (err, row) => {
        if (err) throw err;
        console.log('Delete Succes');
        res.redirect('/')

    })
})

app.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    let sql = `SELECT * FROM bread WHERE id = ${id}`;
    db.get(sql, (err, db) => {
        if (err) throw err;
        res.render('edit', {
            item: db
        });
    })
})

app.post('/edit/:id', (req, res) => {
    const {
        String,
        Integer,
        Float,
        Date,
        Boolean
    } = req.body
    let id = req.params.id;
    let sql = `UPDATE bread set String ='${String}',Integer = '${Integer}',Float = '${Float}',Date = '${Date}',Boolean = '${Boolean}' WHERE id = ${id}`;
    db.run(sql, (err, db) => {
        if (err) throw err;
        res.redirect('/')
    })
})


app.listen(`${port}`, () => console.log(`Hello World app berjalan di http://localhost:${port}`))