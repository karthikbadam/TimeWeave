var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var jsdom = require('jsdom');
var request = require('request');
var fs = require('fs');

// NY Times API 
var NYT = require('nyt');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);

app.get('/', function (req, res, next) {
    res.render('index.html', {});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// NY Times: NLP stuff here
var keys = {
    'article-search': 'c8fc510bf5991df4bd884ef48778c1fe:9:73227903',
    'congress': '0f439b033c7f62a9f555fc1afa9ad85a:6:73227903'
};

var nyt = new NYT(keys);

var webContents = [];

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

var articleHandler = function (a) {

    a = JSON.parse(a);

    var docCount = a.response.docs.length;
    var docs = a.response.docs;

    docs.forEach(function (doc) {

        var url = doc.web_url;
        var publishDate = doc.pub_date;
        var headline = doc.headline;
        var wordCount = doc.word_count;

        jsdom.env(
            url, ["http://code.jquery.com/jquery.js"],

            function (err, window) {

                var webContent = "";
                window.$(".story-body-text").each(function (index) {
                    webContent += window.$(this).text();
                    webContent = webContent.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
                    webContent = webContent.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g, " ");
                });

                webContents.push(webContent);

                //console.log(webContent.length);

                var data = {};
                //add more here!

                data.url = url;
                data.date = publishDate;
                data.content = webContent;
                data.headline = headline;
                data.wordCount = wordCount;

                fs.appendFile("public/data/documents.json",
                    JSON.stringify(data) + ",\n",
                    function (err) {
                        if (err) throw err;
                        console.log(url);
                    });

            }
        );

    });

};

var keywords = ["bernie sanders president", "hillary clinton president", "joe biden president", "donald trump president", "ben carson president"];


var CREATE_DATASET = false;


if (CREATE_DATASET) {

    for (var i = 9; i < 11; i++) {

        for (var j = 0; j < keywords.length; j++) {

            nyt.article.search({
                    'q': keywords[j],
                    "page": i
                },
                articleHandler);

            sleep(200);
        }

    }
}

// Now do a get on the webpage and add up the "story-continues-<num>" strings!

module.exports = app;