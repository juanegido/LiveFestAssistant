// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
}



/**
 * Transform the answer into a humand-understandable reply
 * @param req request
 * @param responseJson JSON with the answer from meetup.com
 * @returns {string} user response
 */

const moment = require('moment');

const MAX_DATE = '12/31/2040';


/**
 * Retrieves the parameters from the request argument
 *
 * @param request
 * @returns {any}
 */
function getParameters(request) {
    return request.body.queryResult.parameters;
}

/**
 * Evaluate if value is undefined
 * @param value value to check
 * @returns {boolean} true if is defined, false in other case
 */
function isUndefined(value) {
    return typeof value === 'undefined';
}

/**
 * Retrieves the topic from the parameter object
 * @param parameters request's parameters
 * @returns topic or empty string
 */
function getStyle(parameters) {
    if (!isUndefined(parameters.EstilosMusicales)) {
        return parameters.EstilosMusicales;
    }
    else {
        return '';
    }
}

/**
 * Retrieves the startDate from the date-period parameter
 * @param parameters
 * @returns {Date}
 */
function getDateFrom(parameters) {
    return moment(parameters['date-period'].startDate);
}

/**
 * Retrieves the endDate from the date-period parameter
 * @param parameters
 * @returns {Date}
 */
function getDateTo(parameters) {
    return moment(parameters['date-period'].endDate);
}

/**
 * Function to order two dates
 * @param dateA
 * @param dateB
 * @returns {number}
 */
function orderDateAsc(eventA, eventB) {
    return eventA.eventDate - eventB.eventDate;
}




function humanizeResponse(req, responseJson) {

    const parameters = getParameters(req);
    let requestSource = (req.body.originalDetectIntentRequest) ? req.body.originalDetectIntentRequest.source : undefined;


    let responseText = '';
    let extraInfo = '';

    const style = getStyle(parameters);

    //Header info
    if (style !== '') {
        extraInfo += ' sobre ' + style;
    }

    if (parameters['date-period'] !== '') {
        extraInfo += ' entre '+ getDateFrom(parameters).format('DD/MM/YY') + ' y ' + getDateTo(parameters).format('DD/MM/YY');
    }

    //Detail info
    if (responseJson.length > 0) {

        responseText = 'He encontrado ' + responseJson.length + ' resultados ' + extraInfo + '. Son los siguientes :\n';


        //Tendremos 2 respuestas. Una para google assistant, preparada para ser leída y otra para slack, preparada para hacer click.
        responseJson.forEach(function (detail) {
                responseText = responseText.concat('El grupo ' + detail.name + ' organiza ' + detail.eventName + ' el próximo día ' + detail.eventDate.format('DD/MM/YY') + '.\n');
            }
        );


    } else { //Data not found

        responseText = 'Lo siento no he podido encontrar nada' + extraInfo;
    }


    return responseText;

}

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
