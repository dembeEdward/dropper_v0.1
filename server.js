var express = require('express');
var app = express();

app.all('/*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
      res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
      next();
    });

var http = require('http');
var server = http.createServer(app);
var xmlparser = require('express-xml-bodyparser');
var json = require('express-json');
var bodyParser = require('body-parser');
var request = require('request');
var parseString = require('xml2js').parseString;
var resbody;

//app.use(express.static('www'));
app.use(json());
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(xmlparser());




app.post('/PayUAPI', function(req, res){


  console.log("Making request");
  console.log(req.body);
  var price = req.body.price;
  console.log(price);

  var body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://soap.api.controller.web.payjar.com/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">\
   <soapenv:Header>\
   <wsse:Security SOAP-ENV:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\
     <wsse:UsernameToken wsu:Id="UsernameToken-9" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">\
      <wsse:Username>Staging Integration Store 3</wsse:Username>\
      <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">WSAUFbw6</wsse:Password>\
      </wsse:UsernameToken>\
      </wsse:Security>\
   </soapenv:Header>\
     <soapenv:Body>\
    <soap:setTransaction xmlns:ns2="http://soap.api.controller.web.payjar.com/">\
     \
           <Api>ONE_ZERO</Api>\
           <Safekey>{07F70723-1B96-4B97-B891-7BF708594EEA}</Safekey>\
           <TransactionType>PAYMENT</TransactionType>\
           <Stage>false</Stage>\
           \
           <AdditionalInformation>\
      	    <cancelUrl>https://www.payu.co.za/cancelUrl.do</cancelUrl>\
              <demoMode>true</demoMode>\
              <merchantReference>test01</merchantReference>\
              <notificationUrl>http://www.payu.co.za/ipn.do</notificationUrl>\
              <returnUrl>http://104.131.71.253:3003</returnUrl>\
              <secure3d>false</secure3d>\
              <supportedPaymentMethods>CREDITCARD</supportedPaymentMethods>\
              <showBudget>false</showBudget>\
              <redirectChannel>mobi</redirectChannel>\
  	 </AdditionalInformation>\
              \
            <Customer>\
              <merchantUserId>7</merchantUserId>\
              <email>john.legend@test.com</email>\
              <firstName>123</firstName>\
              <lastName>123</lastName>\
              <mobile>1234567891</mobile>\
              <regionalId>1234512345122</regionalId>\
              <countryCode>27</countryCode>\
            </Customer>\
           \
           <Basket>\
              <amountInCents>' + price +'</amountInCents>\
              <currencyCode>ZAR</currencyCode>\
              <description>Basket</description>\
           </Basket>\
          \
          \
           \
           <Customfield>\
              <key>MERCHANTID</key>\
              <value>0100111000     </value>\
           </Customfield>\
        </soap:setTransaction>\
     </soapenv:Body>\
  </soapenv:Envelope>';


  request.post(
      {url:'https://staging.payu.co.za/service/PayUAPI',
      body : body,
      'Content-Type': 'text/xml'
      },
      function (error, response, body) {
          console.log(body);
          parseString(body, function (err, result) {
            console.log(result);
            res.json(body);
          });
      }
  );


  //res.json(result);

});

app.post('/payuResult', function(req, res){

  var ref = req.body.ref;
  console.log(ref);
});

/*app.get('/getAllItems', function(req, res){

	console.log('getting all items');

	db.categories.find(function(err, docs){

		console.log('sending all items');
		res.json(docs);
	});
});*/

server.listen(3002);
console.log('App is listening on port : 3002');
