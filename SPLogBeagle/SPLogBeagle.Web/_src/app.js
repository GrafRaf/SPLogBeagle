var express = require('express'),
    path = require('path'),
    app = express(),
    oneDay = 8640000;

app.use(express.static(path.join(__dirname, 'build'), {maxAge: oneDay}));

app.get('/', function (req, res) {
    res.redirect('/assets/templates/NewForm.html');
});

app.get('/front/build/assets/scripts/init.js', function (req,res) {
    res.redirect('/assets/scripts/init.js');
});

app.get('/front/build/assets/img/ajax-loader.gif', function (req,res) {
    res.redirect('/assets/img/ajax-loader.gif');
});

app.get('/_layouts/15/images/folder.gif', function (req,res) {
    res.redirect('/assets/img/folder.gif');
});

app.get('/_layouts/15/images/spcommon.png', function (req,res) {
    res.redirect('/assets/img/spcommon.png');
});

app.get('/_layouts/15/1049/images/formatmap16x16.png', function (req,res) {
    //res.redirect('/assets/img/formatmap16x16.png');
    res.redirect('/assets/img/formatmap16x16.png');
});

app.get('/front/build/assets/stylesheets/style.css', function (req, res) {
    //res.redirect('/assets/img/formatmap16x16.png');
    res.redirect('/assets/stylesheets/style.css');
});

app.get('/front/build/assets/stylesheets/corev15.css', function (req, res) {
    //res.redirect('/assets/img/formatmap16x16.png');
    res.redirect('/assets/stylesheets/corev15.css');
});


module.exports = app;