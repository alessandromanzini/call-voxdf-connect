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
  
  if(action == "vox-connection") return vox_connection(req, res)
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});

function vox_connection(req){
  const to_call = req.body.queryResult.parameters.phone.length==10?"39"+req.body.queryResult.parameters.phone:req.body.queryResult.parameters.phone;
  const uri = "https://api.voximplant.com/platform_api/StartScenarios/?account_id=3043683&api_key=98ce325c-e2d1-48f6-b258-af991184a44f&rule_id=2629150&script_custom_data="+to_call;
  
  https.request(uri);  

  return res.json({
    payload: temp,
    data: temp,
    fulfillmentText: "Chiamata iniziata con successo!",
    speech: speech,
    displayText: speech,
    source: "webhook-voxdf-connection"
  });
}