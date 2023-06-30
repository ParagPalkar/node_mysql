const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

app.set("view engine", "ejs");
const connection = require("./config/db");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/create.html");
});

//delete
app.get("/delete-data", (req, res) => {
  const deleteData = "delete from crud_table where id=?";
  connection.query(deleteData, [req.query.id], (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/data");
    }
  });
});

app.get("/data", (req,res) => {
  connection.query("select * from crud_table", (err,rows) =>{
    if(err){
      console.log(err);
    }
    else{
      res.render("read.ejs",{rows});
    }
  })
})

app.post("/create", (req,res) => {
  console.log(req.body);
  const name = req.body.name;
  const author = req.body.author;
  
  try{
    connection.query("INSERT into crud_table (name,author) values(?,?)", 
    [name, author], (err,rows)=>{
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/data");
      }
    })
  }
  catch(err){
    console.log(err)
  }
})

//final update
app.post("/final-update", (req, res) => {
  const id_data = req.body.hidden_id;
  const name_data = req.body.name;
  const author_data = req.body.author;

  console.log("id...", req.body.name, id_data);

  const updateQuery = "update crud_table set name=?, author=? where id=?";

  connection.query(
    updateQuery,
    [name_data, author_data, id_data],
    (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/data");
      }
    }
  );
});
//passing data to update page
app.get("/update-data", (req, res) => {
  const updateData = "select * from  crud_table where id=?";
  connection.query(updateData, req.query.id, (err, eachRow) => {
    if (err) {
      res.send(err);
    } else {
      console.log(eachRow[0]);
      result = JSON.parse(JSON.stringify(eachRow[0]));  //in case if it dint work 
      res.render("edit.ejs", { data: eachRow[0] });
    }
  });
});




app.listen(process.env.PORT, function (err) {
  if (err) console.log(err);
  console.log(`listening to port ${process.env.PORT}`);
});