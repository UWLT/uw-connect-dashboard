                                                                                                       var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    request = require("request"),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    async = require("async");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
app.set("view engine", "ejs");

global.username = "";
global.password = "";
global.reqs = ['@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Esys_class_name%3Du_simple_requests%5Eassignment_group%3D1854c1a06f1ca100ab448bec5d3ee4ef%5EORassignment_group%3D6c54c1a06f1ca100ab448bec5d3ee4f2%5Estate%3D1%5EORstate%3D2&sysparm_fields=number%2Cstate%2Csys_updated_on%2Cshort_description&sysparm_limit=100',
                '@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Esys_class_name%3Du_simple_requests%5Eassignment_group%3D0cf2d2e26f26110054aafd16ad3ee49a%5EORassignment_group%3D63d9b9e96ff9a50090ead2054b3ee4ff%5EORassignment_group%3Dbfb292e26f26110054aafd16ad3ee4e4%5Estate%3D1%5EORstate%3D2&sysparm_fields=number%2Cstate%2Csys_updated_on%2Cshort_description&sysparm_limit=100',
                '@uw.service-now.com/api/now/table/task?sysparm_query=active%3Dtrue%5Esys_class_name%3Du_simple_requests%5Eassignment_group%3D6bbb84d16ff5650090ead2054b3ee414%5Estate%3D1%5EORstate%3D2&sysparm_fields=number%2Cstate%2Csys_updated_on%2Cshort_description&sysparm_limit=100',
              '@uw.service-now.com/api/now/table/task?sysparm_query=assignment_group%3D1854c1a06f1ca100ab448bec5d3ee4ef%5EORassignment_group%3D6c54c1a06f1ca100ab448bec5d3ee4f2%5EstateIN1%2C2%5Esys_class_name%3Dincident&sysparm_fields=number%2Csys_updated_on%2Cshort_description%2Cstate&sysparm_limit=100',
                '@uw.service-now.com/api/now/table/task?sysparm_query=assignment_group%3D0cf2d2e26f26110054aafd16ad3ee49a%5EstateIN1%2C2%5Esys_class_name%3Dincident&sysparm_fields=number%2Csys_updated_on%2Cshort_description%2Cstate&sysparm_limit=100']
global.consult = '@uw.service-now.com/api/now/table/task?sysparm_query=u_template%3Da98cf3946f87ea00bd4906267b3ee470%5EstateIN1%2C2%2C3&sysparm_fields=number%2Cshort_description%2Cassigned_to%2Cdue_date&sysparm_limit=10'
global.name = ['Canvas & Catalyst Requests', 'Multimedia Requests', 'Poll Everywhere Tickets', 'Canvas & Catalyst Incidents', 'Panopto Incidents']

global.oldest = {};
global.asynchTasks = [];
global.processTasks = [];

reqs.forEach(function(req) {
    asynchTasks.push(function(callback) {
    request('http://' + username + password + req, function(error, response, body){
          if(error) {console.log(error);}
          today = new Date();
          temp = JSON.parse(body).result;
          longest = 0;
          resp = {};
          resp.count = temp.length;
          for (j = 0; j < temp.length; j++){
            diff = Math.abs(today - new Date(temp[j].sys_updated_on));
            if (diff > longest) {
              resp.oldest = temp[j];
              longest = diff;
            }
          }
          callback(null, resp);
      });
  });
});

asynchTasks.push (function (callback) {
  request('http://' + username + password + consult, function(error, response, body) {
    if(error) {console.log(error);}
    consults = JSON.parse(body).result;
    async.each(consults, function(con, callback) {
      request('http://' + username + password + '@' + con.assigned_to.link.substring(8), function(error, response, body) {
        res = JSON.parse(body).result;
        con.assigned_to.link = res.name;
        callback();
      });
    }, function() {
        callback(null, consults);
    });
  });
});



app.get("/", function(req, res) {
  async.parallel(asynchTasks, function (err, results) {
    res.render("home", {body:results, name:name});
  })
});


io.on('connection', function(socket){
  socket.on('pingticket', function(data){
    async.parallel(asynchTasks, function (err, results) {
      io.emit('ticketRefresh', {body:results, oldest:oldest, name:name});
    })
  });
});


http.listen(3000, function(){
  console.log("dashboard started");
});
