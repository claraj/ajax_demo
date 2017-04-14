var express = require('express');
var router = express.Router();
var places;
var counter=1;


router.get('/', function(req, res) {
  res.render('index', { title: 'Travel Wish List'} );
});


/* GET all items home page. */
router.get('/all', function(req, res) {

console.log('all')
  req.db.collection('places').find().toArray(function(err, data){

  if (err){
  console.log("error connection to database");
  return next(err);
  }//end of if error

  else{//no error, get data

  console.log(data)
  places = data;
  return res.json(places);

  }//end of else, no errors

});
});


/* POST - add a new location */
router.post('/addNewPlace', function(req, res) {
//var filter = {id: req.body.id, name: req.body.name, visited: req.body.visited}
var filter = {name: req.body.name}
  var array =[];
//   //credit for following http://stackoverflow.com/questions/32531204/cannot-access-mongodb-object-in-array-returns-undefined
  req.db.collection('places').find(filter).toArray(function(err,data){
    array=data;
	console.log("array length is "+array.length);


  if (array.length == 0)
  {
  req.db.collection('places').insertOne(req.body, function(err){
    if (err) {
      return next(err);
    }

	return res.redirect('/');

});
}
  else
  {
      return res.send('place already exists')

  }



})  ;//end of post
});//end of insertOne


/* PUT - update whether a place has been visited or not */
router.put('/update', function(req, res){

  var id = req.body.id;
  var visited = req.body.visited == "true";  // all the body parameters are strings

  for (var i = 0 ; i < places.length ; i++) {
    var place = places[i];
    if (place.id == id) {
      place.visited = visited;
      places[i] = place;
    }
  }

  console.log('After PUT, the places list is');
  console.log(places);

  res.json(place);

});


router.delete('/delete', function(req, res){

  var place_id = req.body.id;
  console.log(place_id);

  for (var i = 0 ; i < places.length ; i++) {
    var place = places[i];
    if (place.id == place_id) {
      places.splice(i, 1);  //Delete the element at this position
      res.json(place);
      break;
    }
  }

  console.log('After DELETE, the places list is');
  console.log(places);

  res.status(200);
  res.end();

});

//});//end of database callback

module.exports = router;
