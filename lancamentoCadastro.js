
function lancamentoCadastro (dbo) {
	// Create Server instance
  dbo.collection("lancamentos").insertOne(obj, function(err, res) {
    if(err) throw err;
    console.log("1 document inserted");
    db.close();
  });
}

module.exports.lancamentoCadastro = lancamentoCadastro;
