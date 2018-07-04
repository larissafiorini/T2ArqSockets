function produtoCadastro (db, obj) {
	// Create Server instance
  var dbo = db.db("mydb");
  dbo.collection("produtos").insertOne(obj, function(err, res) {
    if(err) throw err;
    console.log("1 document inserted");
    db.close();
  });
}

module.exports.produtoCadastro = produtoCadastro;
