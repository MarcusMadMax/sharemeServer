//importing modules and initial setup
var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')
var cors = require('cors')
var mongoose = require('mongoose')
var fileUpload = require('express-fileupload')


var Share = require('./share-model')
var User = require('./user-model')
// var Title = require('./title-model')

var app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(fileUpload())
app.use(logger('dev'))

var connectionString = 'mongodb+srv://marcuszillner:zephyr01@shareme01.iupny.mongodb.net/shareme?retryWrites=true&w=majority'

mongoose.connect(connectionString,{useNewUrlParser: true})
var database = mongoose.connection
database.once('open', () => console.log('Connected'))
database.on('error', () => console.log('Error'))

app.use(express.static('public'))

var router = express.Router()

//Share C.R.U.D
router.post('/shares', (req, res) => {
    var share = new Share()
    share.id = Date.now()

    var data = req.body

    Object.assign(share, data)
    share.save()
    .then((share) => {
        res.json(share)
    }) //create new share to database
})
router.get('/shares', (req, res) => {
    Share.find()
    .sort({'updatedAt': -1})
    .populate('user')
    .then((share) => {
      res.json(share);
    }) //Read all shares
})
router.get('/shares/:id', (req, res) => {
    Share.findOne({id:req.params.id})
	.then((share) => {
	    res.json(share)
 	}) //read individual share
})
router.put('/shares/:id', (req, res) => {

	Share.findOne({id:req.params.id})
	.then((share) => {
		var data = req.body
		Object.assign(share,data)
		return share.save()	
	})
	.then((share) => {
		 res.json(share)
	}) //update existing share data

})

router.delete('/shares/:id', (req, res) => {
	Share.deleteOne({id:req.params.id})
	.then(() => {
		res.json('deleted')
	}) // delete share
	
})


//User C.R.U.D
router.get('/users', (req, res) => {
    User.find()
  .then((users) => {
      res.json(users)
    })
})

router.get('/users/:id', (req, res) => {


  User.findOne({id:req.params.id})
  .then((user) => {
      return res.json(user);
  });
})

router.post('/users', (req, res) => {

  var user = new User()
  user.id = Date.now()
  
  var data = req.body
  Object.assign(user,data)
  
  user.save()
  .then((user) => {
        return res.json(user)
  })
})

router.put('/users/:id', (req, res) => {
  User.findOne({id:req.params.id})
  .then((user) => {
      var data = req.body
      Object.assign(user,data)
      return user.save()	
  })
  .then((user) => {
      return res.json(user)
  })
})

router.post('/users/authenticate', (req, res) => {

  var {username,password} = req.body;
  var credential = {username,password}
  User.findOne(credential)
  .then((user) => {
      return res.json(user)
  })
})

router.post('/upload', (req, res) => {

  var files = Object.values(req.files)
  var uploadedFile = files[0]

  var newName = Date.now() + uploadedFile.name

  uploadedFile.mv('public/'+ newName, function(){
      res.send(newName)
  })
  
})


// router.get('/users', (req, res) => {
//     User.find()
//     .then((user) => {
//       res.json(user);
//     }) //read all users
// })

// router.get('/users/:id', (req, res) => {
//     User.findOne({id:req.params.id})
//     .populate('shares')
// 	.then((user) => {
// 	    res.json(user)
//  	}) //read individual user
// })
// router.put('/users/:id', (req, res) => {

// 	User.findOne({id:req.params.id})
// 	.then((user) => {
// 		var data = req.body
// 		Object.assign(user,data)
// 		return user.save()	
// 	})
// 	.then((user) => {
// 		 res.json(user)
// 	}) //update user details

// })
// router.delete('/users/:id', (req, res) => {

// 	User.deleteOne({id:req.params.id})
// 	.then(() => {
// 		res.json('deleted')
// 	}) // delete a user
	
// })

//Setup port and routes
app.use('/api', router)
const Port = 4020;
app.listen(Port, () => console.log('Listening Port: '+Port))