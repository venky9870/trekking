var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    http = require('http'),
    request = require('request'),
    _ = require('underscore');
var mysql = require('mysql'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'sqlpwd',
        database: 'test',
        multipleStatements: true
    });
app.use('/Trekking', express.static('UI'));
app.use(bodyParser.json());

app.all('/api/addEvents', function(req, res) {
    var data = req.body;
    var tableName = "event"
    var query = "INSERT INTO " + tableName + " (trek_name,tag_line,description,background_image,images,theme,terrain,nearest_town," +
        "from_date,to_date,no_of_days,grade,total_distance,transportation,team_size,food,expense,pre_requisite,status) VALUES (";
    query = query + "'" + data.trek_name + "'," + "'" + data.tag_line + "'," + "'" + data.description + "'," + "'" + data.background_image + "'," + "'" +
        data.images + "'," + "'" + data.theme + "'," + "'" + data.terrain + "'," + "'" + data.nearest_town + "'," + "'" + data.from_date +
        "'," + "'" + data.to_date + "'," + "'" + data.no_of_days + "'," + "'" + data.grade + "'," + "'" + data.total_distance +
        "'," + "'" + data.transportation + "'," + "'" + data.team_size + "'," + "'" + data.food + "'," + "'" + data.expense +
        "'," + "'" + data.pre_requisite + "','Not Completed');";
    console.log("Create a new event " + query);
    connection.query(query, function(err, rows, fields) {
        console.log("Data inserted successfuly" + JSON.stringify(rows));
        res.send(JSON.stringify({
            "records": rows
        }));
        res.end();
    });
});

app.all('/api/updateEvent', function(req, res) {
    var data = req.body;
    var tableName = "event"
    var query = "update event set trek_name='"+ data.trek_name +"', tag_line='"+ data.tag_line +"', description='"+ data.description +"', background_image='"+ data.background_image
    +"',images='"+ data.images +"', theme='"+ data.theme +"', terrain='"+ data.terrain +"', nearest_town='"+ data.nearest_town +"', from_date='"+ data.from_date +"', to_date='"+ data.to_date
    +"',no_of_days='"+ data.no_of_days +"', grade='"+ data.grade +"', total_distance='"+ data.total_distance +"', transportation='"+ data.team_size +"', team_size='"+
    +"', food='"+ data.food +"', expense="+data.expense +", pre_requisite='"+ data.pre_requisite +"', status='" + data.status + ";";
    console.log("update event -------- " + query);
    connection.query(query, function(err, rows, fields) {
        console.log("Data updated successfuly" + JSON.stringify(rows));
        res.send(JSON.stringify({
            "records": rows
        }));
        res.end();
    });
});
app.all('/api/completeEvent/:id', function(req, res) {
    var data = req.body;
    var query = "update event set status='Completed' where id=" + req.param('id') + ";";
    console.log("Completed Events " + query);
    connection.query(query, function(err, rows, fields) {
        console.log("Event Completed Successfuly" + JSON.stringify(rows));
        res.send(JSON.stringify({
            "records": rows
        }));
        res.end();
    });
});

app.all('/api/cancelEvent/:id', function(req, res) {
    var data = req.body;
    var query = "update event set status='Cancelled' where id=" + req.param('id') + ";";
    console.log("Cancelling Events " + query);
    connection.query(query, function(err, rows, fields) {
        console.log("Event Cancelled Successfuly" + JSON.stringify(rows));
        res.send(JSON.stringify({
            "records": rows
        }));
        res.end();
    });
});

app.all('/api/getEventDetails/:id?', function(req, res) {
    var data = req.body;
    var query = "select * from event" + (req.param('id') == undefined ? ";" : " where id=" + req.param('id') + ";");
    console.log("Events " + query);
    connection.query(query, function(err, rows, fields) {
        console.log("Data fetched successfuly" + JSON.stringify(rows));
        res.send(JSON.stringify({
            "records": rows
        }));
        res.end();
    });
});

app.all('/api/getRegisteredEvents/:memeberId?', function(req, res) {
    var query;
    if(req.param('memeberId')){
      query = "select t2.event_id,t2.starting_point,t2.status from event t1 inner join event_registration t2 where t1.status='Not Completed' and t1.id=t2.event_id and t2.membership_id=" + req.param('memeberId') +";";
    }else{
      query = "select * from event where status='Not Completed';";
    }

    console.log("Upcoming Member Events -------" + query);
    connection.query(query, function(err, rows, fields) {
        console.log("Data fetched successfuly" + JSON.stringify(rows));
        res.send(JSON.stringify({
            "records": rows
        }));
        res.end();
    });
});

app.all('/api/getCompletedEvents', function(req, res) {
    var data = req.body;
    var query = "select * from event where status='Completed';";
    console.log("Upcoming Events " + query);
    connection.query(query, function(err, rows, fields) {
        console.log("Data fetched successfuly" + JSON.stringify(rows));
        res.send(JSON.stringify({
            "records": rows
        }));
        res.end();
    });
});

app.all('/api/registerMember', function(req, res) {
    var data = req.body;
    var query = "INSERT INTO member (name,email,date_of_birth,gender,bloodgroup,whatsapp_no,contact_no,company_name,emp_no,permanent_address_1," +
        "permanent_address_2,temp_address_1,temp_address_2,emergency_contact_no,emergency_contact_person,volunteering_activities,facebook_url) VALUES (";

    query = query +"'" +data.name  + "','" + data.email + "','" + data.date_of_birth + "','" + data.gender + "','" + data.bloodgroup + "'," + data.whatsapp_no +
        "," + data.contact_no + ",'" + data.company_name + "','" + data.emp_no + "','" +
        data.permanent_address_1 + "','" + data.permanent_address_2 + "','" +
        data.temp_address_1 + "','" + data.temp_address_2 + "'," +
        data.emergency_contact_no + ",'" + data.emergency_contact_person +
        "','" + data.volunteering_activities + "','" + data.facebook_url + "');";

    console.log("Member Registration ----- " + query);
    connection.query(query, function(err, rows, fields) {
        console.log("Member Registered successfuly" + JSON.stringify(rows));
        res.send(JSON.stringify({
            "records": rows
        }));
        res.end();
    });
});

app.all('/api/memberTrekRegistration', function(req, res) {
    var data = req.body;
    var query = "INSERT into event_registration (membership_id,event_id,starting_point,status ) VALUES (";

    query = query + data.membership_id +"," + data.id + ",'" + data.starting_point + "','Not Confirmed');"

    console.log("Member Event Registration ----- " + query);
    connection.query(query, function(err, rows, fields) {
        console.log("Member Event Registered successfuly" + JSON.stringify(rows));
        res.send(JSON.stringify({
            "records": rows
        }));
        res.end();
    });
});

app.all('/api/checkRegistration', function(req, res) {
    var data = req.body;
    var query = "select id from member where email='"+ req.body.email.replace('.','\.')  +"';";
    console.log("Validating User Registration" + query);
    connection.query(query, function(err, rows, fields) {
        console.log("User Verified successfuly ------" + JSON.stringify(rows));
        if(rows!=undefined){
          res.send(JSON.stringify({
              "membershipid": rows[0].id
          }));
        }
        res.end();
    });
});

app.all('/api/getMemberList', function(req, res) {
    var query = "select name,id from member;";
    console.log("Fetch All Members" + query);
    connection.query(query, function(err, rows, fields) {
        console.log("Fetched All Members List ------" + JSON.stringify(rows));
        if(rows!==undefined){
          res.send(JSON.stringify({
              "records": rows
          }));
        }else{
          res.send(JSON.stringify({
              "records": null
          }));
        }
        res.end();
    });
});

app.all('/api/getMemberDetails/:id?', function(req, res) {
    var data = req.body;
    var query = "select * from member where id=" + req.param('id')+ ";";
    console.log("Fetch All Members" + query);
    connection.query(query, function(err, rows, fields) {
        console.log("Fetched All Members List ------" + JSON.stringify(rows));
        if(rows!==undefined){
          res.send(JSON.stringify({
              "records": rows
          }));
        }else{
          res.send(JSON.stringify({
              "records": null
          }));
        }
        res.end();
    });
});

app.listen(80, function() {
    console.log('trekking Launched on port 80!');
});
