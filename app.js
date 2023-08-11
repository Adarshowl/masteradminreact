
var express = require('express');
const cors = require('cors');
var mongoose = require('mongoose');
require('dotenv').config();
var path = require('path');

var app = express();
// app.use(logger('dev')); // to get log's in terminal
//parser
// app.use(express.json());
app.use(express.json({limit: "10mb", extended: true}))
app.use(cors());
// app.use(express.urlencoded({ extended: false })); 
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}))
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads",express.static("./uploads"));
mongoose.set('strictQuery', true);
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {useNewUrlParser:true,useUnifiedTopology: true});
const con= mongoose.connection;
con.on('open', ()=> {
  console.log('Database Connected');
});


app.all('*',function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// admin routes
app.use('/api/adminauth', require('./controllers/admin/adminauthcontroller'));
app.use('/api/admin/profile', require('./controllers/admin/profilecontrollers'));
app.use('/api/admin/user', require('./controllers/admin/usercontroller'));
app.use('/api/admin/category', require('./controllers/admin/categorycontroller'));
app.use('/api/admin/subcategory', require('./controllers/admin/subcategorycontroller'));
app.use('/api/admin/employee', require('./controllers/admin/employeecontroller'));
app.use('/api/admin/privacypolicy', require('./controllers/admin/privacypolicycontroller'));
app.use('/api/admin/contactus', require('./controllers/admin/contactuscontroller'));
app.use('/api/admin/aboutus', require('./controllers/admin/aboutuscontroller'));
app.use('/api/admin/faq', require('./controllers/admin/faqcontroller'));
app.use('/api/admin/notification', require('./controllers/admin/notificationcontroller'));
app.use('/api/admin/subscription', require('./controllers/admin/subscriptioncontroller'));
app.use('/api/admin/coupon', require('./controllers/admin/couponcontroller'));
app.use('/api/admin/role', require('./controllers/admin/rolecontroller'));
app.use('/api/admin/rolename', require('./controllers/admin/rolenamecontroller'));
app.use('/api/admin/paymentcredential', require('./controllers/admin/paymentcredentialcontroller'));
app.use('/api/admin/invoice', require('./controllers/admin/invoicecontroller'));
app.use('/api/admin/paymenthistory', require('./controllers/admin/paymenthistorycontroller'));
app.use('/api/admin/withdrawal', require('./controllers/admin/withdrawalcontroller'));
app.use('/api/admin/emailconfig', require('./controllers/admin/emailconfigcontroller'));
// user routes
app.use('/api/userauth', require('./controllers/user/authcontroller'));
app.use('/api/user/notification', require('./controllers/user/notificationcontroller'));
// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.send('error');
  });

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`app is listening on ${port}`)
})

module.exports = app;


  











