var express = require('express');
var router = express.Router();

// The bcrypt hashing function allows us to build a password security platform 
// that scales with computation power and always hashes every password with a salt.
var bcrypt = require('bcrypt');

var con = require('../conn/conn');

// Validation in node. js can be easily done by using the express-validator module. 
const { check, validationResult } = require('express-validator')


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.flag == 1){
    req.session.destroy();
    res.render('index.pug', { title: 'Login / Register Page', message : 'Email Already Exists' , flag : 1});
  }
  else if(req.session.flag == 2){
    req.session.destroy();
    res.render('index.pug', { title: 'Login / Register Page', message : 'Registration Done. Please Login.', flag : 0});
  }
  else if(req.session.flag == 3){
    req.session.destroy();
    res.render('index.pug', { title: 'Login / Register Page', message : 'Confirm Password Does Not Match.', flag : 1});
  }
  else if(req.session.flag == 4){
    req.session.destroy();
    res.render('index.pug', { title: 'Login / Register Page', message : 'Incorrect Email or Password.', flag : 1 });
  }
  else{
    res.render('index.pug', { title: 'Login / Register Page' });
  }
   
});

//Handle POST request for User Registration
router.post('/auth_reg', function(req, res, next){

  var fullname = req.body.fullname;
  var username = req.body.username;
  var password = req.body.password;
  var cpassword = req.body.cpassword;

  if(cpassword == password){

    var sql = 'select * from user where username = ?;';

    con.query(sql,[username], function(err, result, fields){
      if(err) throw err;

      if(result.length > 0){
        req.session.flag = 1;
        res.redirect('/');
      }else{

        var hashpassword = bcrypt.hashSync(password, 10);
        var sql = 'insert into user(fullname,username,password) values(?,?,?);';

        con.query(sql,[fullname,username, hashpassword], function(err, result, fields){
          if(err) throw err;
          req.session.flag = 2;
          res.redirect('/');
        });
      }
    });
  }else{
    req.session.flag = 3;
    res.redirect('/');
  }
});


//Handle POST request for User Login
router.post('/auth_login', function(req,res,next){

  var username = req.body.username;
  var password =req.body.password;

  var sql = 'select * from user where username = ?;';
  
  con.query(sql,[username], function(err,result, fields){
    if(err) throw err;

    if(result.length && bcrypt.compareSync(password, result[0].password)){
      req.session.username = username;
      res.redirect('/home');
    }else{
      req.session.flag = 4;
      res.redirect('/');
    }
  });
});

router.post('/register', [
  check('emp_code', 'Employee code cannot be empty')
      .exists()
      .isLength({ min: 3 }),
      
  check('first_name', 'First name cannot be empty')
      .exists()
      .isLength({ min: 2 }),
      
  check('last_name', 'Last name cannot be empty')
      .exists()
      .isLength({ min: 3 }),

  check('dob', 'Date of Birth cannot be empty')
      .exists()
      .isLength({ min: 3 }),

  check('address', 'Address cannot be empty')
      .exists()
      .isLength({ min: 10 }),

  check('experience', 'Experience cannot be empty')
    .exists()
    .isLength({ min: 1 }),
    
  check('department', 'Department cannot be empty')
    .exists()
    .isLength({ min: 1 }),

], function(req, res){
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
      const alert = errors.array()
      res.render('register.ejs', {
          alert
      })
  }
  else{
      let { emp_code=null, first_name=null, last_name=null, dob=null, address=null, experience=null, department=null } = req.body;
      let sql = `INSERT INTO EMPLOYEES VALUES("${emp_code}", "${first_name}", "${last_name}", "${dob}", "${address}", "${experience}", "${department}")`;
      con.query(sql, function(err, data){
          if (err) throw err;
          res.send('Successfully entered');
      });
  }
  
});

router.get('/register', function(req, res){
  res.render('register.ejs', {});
})

router.get('/show_employees', function(req, res){
  let sql = "SELECT * FROM employees";
  con.query(sql, function(err, data){
      if (err) throw err;
      res.render('employees.ejs', { data, message : 'Welcome, ' + req.session.username });
  });
});

// Route For Home Page
router.get('/home', function(req, res, next){
  // res.render('home', {message : 'Welcome, ' + req.session.username});
  res.render('register.ejs', {message : 'Welcome, ' + req.session.username})
});

router.get('/logout', function(req, res, next){
  // if(req.session.username){
  //   req.session.destroy();
  res.redirect('/');
  // }
})

module.exports = router;
