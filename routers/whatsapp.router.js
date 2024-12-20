const config = require('../config');
const { arduinoIOTValueMaxLength } = config.arduinoIOT;
const { whatsapp_webhook_approval_token } = config.whatsapp_webhook;
const models = require('../models');
const { LogModel } = models.messageModels;
const api = require('../api');
const { express } = api.express;
const whatsappRouter = express.Router();



whatsappRouter.route('/')  // /webhook
    .get(async (req, res) => {
        try {
            const mode = req.query["hub.mode"];
            const challenge = req.query["hub.challenge"];
            const token = req.query["hub.verify_token"];
            if (mode == 'subscribe' && token == whatsapp_webhook_approval_token)
                return res.status(200).send(challenge);
            else return res.status(403).send('webhook issue');
        } catch (e) { return res.sendStatus(400); }
    })
    .post(async (req, res) => {
        try {
            const body_param = req.body;
            if (
                //body_param?.object
                body_param?.entry[0]?.changes[0]?.value?.messages
                && body_param.entry[0].changes[0].value.messages[0]
            ) {
                const { phone_number_id } = body_param.entry[0].changes[0].value.metadata;
                const { from } = body_param.entry[0].changes[0].value.messages[0];
                const msg_body = body_param.entry[0].changes[0].value.messages[0].text?.body;
                //^ take care!
                //resize to maximum size
                let set_param = msg_body.trim();
                set_param = encodeURIComponent(set_param);
                if (set_param.length === 0) throw new Error();
                if (set_param.length > arduinoIOTValueMaxLength) set_param = set_param.substring(0, arduinoIOTValueMaxLength);

                if (set_param == 1 || set_param.toLowerCase() == "lamp") set_param = 2;   //lamp redirection, prefer to use 1 instead
                else if (set_param == 2 || set_param.toLowerCase() == "led") set_param = 6;   //led redirection, prefer to use 2 instead
                //res.setHeader('additional_data', 'webhook');
                //res.set('Access-Control-Expose-Headers', 'additional_data');//to fix

                //const data = { message: 'webhook' };
                //await LogModel(data).save();

                return res.redirect('/api/arduinoIOT/' + set_param + '?is_webhook=1');

                // await axios({
                //     method: 'POST'
                //     , url: 'https://graph.facebook.com/v15.0/' + phone_number_id + '/messages?access_toke=' + ACCESS_TOKEN //116346754706966
                //     , headers: {
                //      //   Authorization: 'Bearer ' + ACCESS_TOKEN
                //         /*,*/ 'Content-Type': 'application/json'
                //     }
                //     , data: JSON.stringify({
                //         messaging_product: "whatsapp"
                //         , to: from
                //         , text: {
                //             body: "hi, this is Arthur Response"
                //         }
                //     })
                // });


                // return res.sendStatus(200);
            } else return res.sendStatus(404);

        } catch (e) { return res.sendStatus(400); }
    });



module.exports = whatsappRouter;