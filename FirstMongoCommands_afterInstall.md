# First Mongo Commands

* mongod
* mongo
* help
* show dbs, collections (show collections)
* use (use <dbname> to either use / set the current collection, or create the collection if it does not exist.)
* insert ( db.dogs.insert({name: "Rusty", breed: "Mutt"}) ) => dogs is just the name of the collection.
* find ( db.dogs.find({breed: "Mutt"}) ) => Either () for all results, or insert the search as an object.
* update ( db.dogs.update({name: "Rusty"}, {$set: { name: "Tater", isCute: true}}) ) => Two parameters. 1. query 2. Update values.
* remove ( db.dogs.remove({breed: "Mutt"}) ) ==> Works just like the Find command 