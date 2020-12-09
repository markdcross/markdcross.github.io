const nodemailer = require('nodemailer');

module.exports = (app) => {
  //* =============================
  //* HTML
  //* =============================
  // index page
  app.get('/', (req, res) => {
    res.render('pages/index');
  });
  // Portfolio page
  app.get('/portfolio', (req, res) => {
    res.render('pages/portfolio');
  });

  //* =============================
  //* Nodemailer
  //* =============================
  // POST route from contact form
  app.post('/contact', (req, res) => {
    // Instantiate the SMTP server
    const smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.myEmail,
        pass: process.env.myEmailPass
      }
    });

    // Specify what the email will look like
    const mailOpts = {
      from: req.body.formEmail, // This is ignored by Gmail
      to: process.env.myEmail,
      subject: 'New message from contact form at markdcross.me',
      text: `${req.body.formName} (${req.body.formEmail}) says: ${req.body.formMessage}`
    };

    // Attempt to send the email
    smtpTrans.sendMail(mailOpts, (error, info) => {
      if (error) {
        return console.log(error);
      }

      console.log('Message sent: ' + info.response);
    });
  });
};
