
function lancamentoBuscar (db, socket) {
	// Create Server instance
  var dbo = db.db("mydb");
  dbo.collection("lancamentos").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
    //manda json do server para o cliente
    socket.sendEndMessage(result);
  })
}

module.exports.lancamentoBuscar = lancamentoBuscar;
