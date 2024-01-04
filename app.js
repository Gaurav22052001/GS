// app.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');
const path = require("path");
const PORT = process.env.PORT || 4000;
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/user_uploads'); // Set the destination folder
  },
  filename: function (req, file, cb) {
    // for file with date
    // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    //for file with original name
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tectic.rg@gmail.com', // Replace with your Gmail address
    pass: 'ampz jqoq ofbd fwuu'   // Replace with your Gmail password or an app-specific password
  }
});



app.get('/', (req, res) => {
  res.render('in');
});
app.get('/del', (req, res) => {
  res.render('del');
});
// Display a form for adding a new user
app.get('/users/new', (req, res) => {
  res.render('new_user');
});
app.get('/sample', (req, res) => {
  res.render('listings');
});
app.get('/thesis', (req, res) => {
  res.render('thesis');
});
app.get('/casestudy', (req, res) => {
  res.render('casestudy');
});
app.get('/research', (req, res) => {
  res.render('research');
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.post('/users', upload.array('file', 5), (req, res) => {
  const { username, email, phone, date, subjects, description } = req.body;
  const filePaths = req.files ? req.files.map(file => file.path) : [];

 
  const recipients = 'tectic.rg@gmail.com'; 

  const mailOptions = {
    from: 'tectic.rg@gmail.com', // Replace with your Gmail address
    to: recipients,
    subject: 'Welcome!',
    text: `Hello Admin, ${username} wants to contact you,\n his email address is: ${email}, \n his phone number is ${phone} \n\nUser upload file you can find bellow:\n${filePaths.join('\n')}`,
    attachments: filePaths.map(filePath => ({ path: filePath }))
  };

  transporter.sendMail(mailOptions, (emailErr, info) => {
    if (emailErr) {
      console.error('Error sending email:', emailErr);
      res.send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.redirect('/');
    }
  });
});

app.get('/contact', (req, res)=>{
  res.render('contact');
})

app.post('/submit-form', (req, res) => {
  const { firstname, lastname, phone, email,  message } = req.body;

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tectic.rg@gmail.com', 
      pass: 'ampz jqoq ofbd fwuu'   
    }
  });

  // Compose the email message
  const mailOptions = {
    from: email,
    to: 'arorarishu2999@gmail.com',
    subject: 'New Form Submission',
    text: `First Name: ${firstname}\nLast Name: ${lastname}\nPhone: ${phone}\nEmail: ${email}\nMessage:\n${message}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
    res.redirect('/');
  });
});


// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
