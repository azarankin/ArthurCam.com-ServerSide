const arduinoIOTValueMaxLength = 10;
const lastSentDisplayTextShow = 10;

//require('dotenv').config();

//token access
const iotTokenClientId = 'NU69UWvmi2vlL7c84DNtBcraQJ3DLAlr';
const iotTokenClientSecret = 'DFAf7d9QFjphptdrJTq7c6MJjk30eyUWjDPtlGLjTDMSTOlRdpcqoTsCIraud9t2';
const iotArduinoToken = {
    method: 'POST', json: true,
    url: 'https://api2.arduino.cc/iot/v1/clients/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    form: { grant_type: 'client_credentials', client_id: iotTokenClientId, client_secret: iotTokenClientSecret, audience: 'https://api2.arduino.cc/iot' }
};
//control
const device_id = process.env.IOT_KEY_THING_ID; // {String} The id of the thing

const property_id_string = process.env.IOT_STRING; // {String} The id of the property iot string
const property_id_lamp = process.env.IOT_LAMP; // {String} The id of the property, iot lamp
const property_id_led = process.env.IOT_LED; // {String} The id of the property iot led

module.exports = {
    arduinoIOTValueMaxLength
    , lastSentDisplayTextShow
    , iotArduinoToken
    , device_id
    , property_id_string
    , property_id_lamp
    , property_id_led
};