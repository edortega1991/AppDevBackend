var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "quiz.db"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Conexion establecida');
        let query = 'SELECT * FROM sqlite_master WHERE type = "table" and name="IndiceAmbiental"';
        db.all(query, (err, rows) => {
            if (err) {
                console.log('error');

            }
            // console.log('estos datos ',rows);
            if (rows.length === 0) {
                console.log('no existe tabla');
                let query = 'CREATE TABLE `IndiceAmbiental` (`id` INTEGER, `ENG` TEXT)';
                db.all(query, (err, rows) => {
                    if (err) {
                        console.log('Error creando la tabla IndiceAmbiental');
                        return;
                    } else {
                        creatTabla();
                    }

                });

            } else {
                console.log('existe tabla');
                creatTabla();
                //db.all('drop table IndiceAmbiental');

            }

            /*res.json({
                "message":"success",
                "data":rows
            })*/
        });


    }
});

function creatTabla() {
    console.log('entro a la funcion');
    db.all('DELETE FROM IndiceAmbiental' , (err, rows) => {
        if (err) {
            console.log('Error al eliminar datos')
        } else {
            let insert = 'Insert INTO IndiceAmbiental (id,ENG) select t.id As id, CAST(cast(Replace(t.ENG,",",".") as Real)*0.5 + cast(Replace(h.ENG,",",".") as Real)*0.15 + cast(Replace(n.ENG,",",".") as Real)*0.2 as TEXT) AS ENG from Temperatura t JOIN Humedad h JOIN Nivel n where t.id= h.id AND t.id=n.id AND h.id=n.id'
            db.run(insert, (err, data) => {
                if (err) {
                    console.log('Error al agregar data a la tabla IndiceAmbiental');
                }
            });
        }
    });



}

module.exports = {db,creatTabla}