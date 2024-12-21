const express = require("express");
const app = express();
const port = 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

const contentRoute = require('./routes/contentRoute');
app.use(express.static(__dirname + '/public'));

app.get('/home', (req, rest)=>{
    rest.render('index');
});

app.get('/privacy-policy', (req, res)=>{
    res.render('privacy');
});


app.use('/', contentRoute);

app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
});