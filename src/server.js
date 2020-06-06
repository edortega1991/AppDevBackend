// Create express app
let express = require("express");
let app = express();
var cors = require('cors');
let dbs = require("./database");
let db = dbs.db;

app.use(cors());

// Server port
let HTTP_PORT = 3000
// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
  res.json({ "message": "Ok" });
  
});

app.get("/api/datosTotal", (req, res, next) => {
  let sql = "select h.id AS id, h.ENG AS Humedad, n.ENG AS Nivel, t.ENG AS Temperatura, iA.ENG AS IndiceAmbiental FROM Humedad h JOIN Nivel n JOIN Temperatura t JOIN IndiceAmbiental iA WHERE h.id=n.id and t.id=h.id and t.id=n.id AND t.id=iA.id"
  let params = [];

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    
   res.json({
      "message": "success",
      "data": rows
    })
  });
});



app.get("/api/updateDatosIndice", (req, res, next) => {
  
  db.all('DELETE FROM IndiceAmbiental', (err, rows) => {
    if (err) {
      console.log('Error al eliminar datos')
    } else {
      let insert = 'Insert INTO IndiceAmbiental (id,ENG) select t.id As id, CAST(cast(Replace(t.ENG,",",".") as Real)*0.5 + cast(Replace(h.ENG,",",".") as Real)*0.15 + cast(Replace(n.ENG,",",".") as Real)*0.2 as TEXT) AS ENG from Temperatura t JOIN Humedad h JOIN Nivel n where t.id= h.id AND t.id=n.id AND h.id=n.id'
      db.run(insert, (err, data) => {
        if (err) {
          console.log('Error al agregar data a la tabla IndiceAmbiental');

        } else {
          let sql = "select h.id AS id, h.ENG AS Humedad, n.ENG AS Nivel, t.ENG AS Temperatura, iA.ENG AS IndiceAmbiental FROM Humedad h JOIN Nivel n JOIN Temperatura t JOIN IndiceAmbiental iA WHERE h.id=n.id and t.id=h.id and t.id=n.id AND t.id=iA.id"
          let params = [];

          db.all(sql, (err, rows) => {
            if (err) {
              res.status(400).json({ "error": err.message });
              return;
            }
            
            
            res.json({
              "message": "success",
              "data": rows
            })
          });
        }
      });
    }
  });
});

app.get("/api/arrTemp", (req, res, next) => {
  
  db.all('select cast(Replace(t.ENG,",",".") as Real) AS Temperatura FROM Temperatura t', (err, rows) => {
      if(err){
        console.log('error')
      }else{
        var sports = [];
        
        rows.forEach(element => {           
           var t=element.Temperatura
           sports.push(t);
          
        });
        
        res.json({
          "data":sports
        })
      }
  });
});


app.use(function (req, res) {
  res.status(404);

});