"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
var temp;

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/", function(req, res) {
  temp = {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: "Chiamata iniziata con successo!"
            }
          }
        ]
      }
    }
  };
  var action = req.body.queryResult &&
  req.body.queryResult.action
  ? req.body.queryResult.action
  : "";

  if(action == "pizzaOrder") return pizzaOrder(req, res)
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});

//actions
function pizzaOrder(req){
  var opt;
  if(req.body.queryResult.parameters){
    const pNum = req.body.queryResult.parameters.PizzaType?req.body.queryResult.parameters.PizzaType.length:0;
    opt = JSON.stringify({
      "PizzaType":req.body.queryResult.parameters.PizzaType?req.body.queryResult.parameters.PizzaType:[],
      "PizzaSize":req.body.queryResult.parameters.PizzaSize?fill_field(req.body.queryResult.parameters.PizzaSize, pNum):[],
      "Count":req.body.queryResult.parameters.Count?fill_field(req.body.queryResult.parameters.Count, pNum):[],
      "Phone":(req.body.queryResult.parameters.Phone?adjustPhoneNumber(req.body.queryResult.parameters.Phone):""),
      "Time":req.body.queryResult.parameters.Time?req.body.queryResult.parameters.Time.substr(11,5):""
    });
  } else opt = {}

  voxConnection("2629150", opt);

  return res.json({
    queryResult:{
      payload: temp,
      data: temp,
      fulfillmentText: "Ordinazione iniziata con successo!",
      speech: speech,
      displayText: temp.richResponse.items[0].textToSpeech,
      source: "webhook-voxdf-connection"
    }
  });
}

function voxConnection(rID, opt){
  const url = "https://api.voximplant.com/platform_api/StartScenarios/?account_id=3043683&api_key=98ce325c-e2d1-48f6-b258-af991184a44f";
  https.get(url
            +"&rule_id="+rID
            +"&script_custom_data="+opt);
}

//utilities
function fill_field(obj, cont){
  if(obj.length<cont)
    for(var i = obj.length; i<cont; i++)
      obj.push(obj[i-1]);
  return obj;
}
function adjustPhoneNumber(value){
  return (value.length==10?"39"+value:value)
}