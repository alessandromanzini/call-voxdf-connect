"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/vox-connection", function(req, res) {
  var temp = {
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
  var speech =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.echoText
      ? req.body.queryResult.parameters.phone
      : "Non credo di aver capito bene.";

  return res.json({
    payload: temp,
    data: temp,
    fulfillmentText: "vox-connection",
    speech: speech,
    displayText: speech,
    source: "webhook-voxdf-connection"
  });
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
