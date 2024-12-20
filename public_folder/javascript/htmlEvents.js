import { configurations, colors } from './config/axios.js';
import { clickEvent, finishLoaded, tags } from './config/htmlElements.js';
import { AxiosRequest } from './api/axios.js';
import { feedbackArea, delayButton, delayText } from './api/htmlElements.js';

//global elements: led, lamp, send_text, send_text_button, reload, send_comment, send_comment_button, documentation


finishLoaded(() => {//global page event functions
    //onload run events
    feedbackAreaText('');   //reset value
    feedbackAreaLight('');   //reset value
    feedbackAreaIOTText('');   //reset value
    feedbackAreaIOTLight('');   //reset value
    feedbackAreaComment('');   //reset value
    //send_text.focus();
    callStringsGetApi();
    callStringsIOTGetApi();
    callCommentsGetApi();

    if (tags.reload)
        clickEvent(tags.reload, () => { location.reload(); });

    if (tags.documentation)
        clickEvent(tags.documentation, () => {  //to fix
            window.open("https://github.com/w3arthur/ArthurCam.com");
        });
    if (tags.send_text_button && tags.send_text)
        clickEvent(tags.send_text_button, () => {
            let str = tags.send_text.value;
            if (str.length > configurations.STRING_MAX_LENGTH) { str = str.substring(0, configurations.STRING_MAX_LENGTH) }
            if (str.trim() === '') return;
            new AxiosRequest(() => configurations.stringSendApi(str))
                .GoodResult((resultData) => {
                    feedbackAreaText('Currently waiting to send the string message');
                    delayText(tags.send_text_button, tags.send_text, () => {
                        feedbackAreaText('The string message has been sent.', colors.success);
                        callStringsGetApi();
                    });
                })
                .BadResult((errorMsg) => { feedbackAreaText('The string cannot be sent at the moment, as it may be delayed by another user', colors.fail); })
                .Builder();
        });
    if (tags.send_iot_text_button && tags.send_iot_text)
        clickEvent(tags.send_iot_text_button, () => {
            let str = tags.send_iot_text.value;
            if (str.length > configurations.STRING_IOT_MAX_LENGTH) { str = str.substring(0, configurations.STRING_IOT_MAX_LENGTH) }
            if (str.trim() === '') return;
            new AxiosRequest(() => configurations.stringSendIOTApi(str))
                .GoodResult((resultData) => {
                    feedbackAreaIOTText('Currently waiting to send the string message');
                    delayText(tags.send_iot_text_button, tags.send_iot_text, () => {
                        feedbackAreaIOTText('The string message has been sent.', colors.success);
                        callStringsIOTGetApi();
                    });
                })
                .BadResult((errorMsg) => { feedbackAreaIOTText('The string cannot be sent at the moment, as it may be delayed by another user', colors.fail); })
                .Builder();
        });
    if (tags.led_iot)
        clickEvent(tags.led_iot, () => {
            new AxiosRequest(() => configurations.ledIOTOnOff())
                .GoodResult((resultData) => { feedbackAreaIOTLight('Currently waiting to send the LED action'); delayButton(tags.led_iot, () => feedbackAreaIOTLight('The request sent', colors.success)); })
                .BadResult((errorMsg) => { feedbackAreaIOTLight('The LED action cannot be sent right now, as it may be delayed by another user', colors.fail); })
                .Builder();
        });

    if (tags.lamp_iot)
        clickEvent(tags.lamp_iot, () => {
            new AxiosRequest(() => configurations.lampIOTOnOff())
                .GoodResult((resultData) => { feedbackAreaIOTLight('Currently waiting to send the LAMP action'); delayButton(tags.lamp_iot, () => feedbackAreaIOTLight('The request sent', colors.success)); })
                .BadResult((errorMsg) => { feedbackAreaIOTLight('The LAMP action cannot be sent right now, as it may be delayed by another user', colors.fail); })
                .Builder();
        });

    if (tags.led)
        clickEvent(tags.led, () => {
            new AxiosRequest(() => configurations.ledOnOff())
                .GoodResult((resultData) => { feedbackAreaLight('Currently waiting to send the LED action'); delayButton(tags.led, () => feedbackAreaLight('The request sent', colors.success)); })
                .BadResult((errorMsg) => { feedbackAreaLight('The LED action cannot be sent right now, as it may be delayed by another user', colors.fail); })
                .Builder();
        });

    if (tags.lamp)
        clickEvent(tags.lamp, () => {
            new AxiosRequest(() => configurations.lampOnOff())
                .GoodResult((resultData) => { feedbackAreaLight('Currently waiting to send the LAMP action'); delayButton(tags.lamp, () => feedbackAreaLight('The request sent', colors.success)); })
                .BadResult((errorMsg) => { feedbackAreaLight('The LAMP action cannot be sent right now, as it may be delayed by another user', colors.fail); })
                .Builder();
        });

    if (tags.send_comment_button && tags.send_comment)
        clickEvent(tags.send_comment_button, () => {
            let str = tags.send_comment.value;
            if (str.length > configurations.COMMENT_MAX_LENGTH) { str = str.substring(0, configurations.COMMENT_MAX_LENGTH); }
            if (str.trim() === '') return;
            new AxiosRequest(() => configurations.commentPostApi(str))
                .GoodResult((resultData) => {
                    tags.send_comment.value = '';
                    feedbackAreaComment('The comment message has been sent. Thank you!', colors.success);
                    callCommentsGetApi();
                })
                .BadResult((errorMsg) => { feedbackAreaComment('I\'m sorry, the comment cannot be sent at the moment. Please wait for a while and try again', colors.fail); })
                .Builder();
        });

});


//LED or Lamp Serial
function feedbackAreaLight(str, color = colors.process) {
    if (tags.feedbackAreaLight_element)
        feedbackArea(tags.feedbackAreaLight_element, str, color);
}

//String Serial TextArea
function feedbackAreaText(str, color = colors.process) {
    if (tags.feedbackAreaText_element)
        feedbackArea(tags.feedbackAreaText_element, str, color);
}


//Comment Area
function feedbackAreaComment(str, color = colors.process) {
    if (tags.feedbackAreaComment_element)
        feedbackArea(tags.feedbackAreaComment_element, str, color);
}

//LED or Lamp IOT
function feedbackAreaIOTLight(str, color = colors.process) {
    if (tags.feedbackAreaIOTLight_element)
        feedbackArea(tags.feedbackAreaIOTLight_element, str, color);
}

//String IOT TextArea
function feedbackAreaIOTText(str, color = colors.process) {
    if (tags.feedbackAreaIOTText_element)
        feedbackArea(tags.feedbackAreaIOTText_element, str, color);
}


function callStringsGetApi() {
    if (tags.displayedText)
        new AxiosRequest(() => configurations.stringsGetApi())
            .GoodResult((resultData) => {
                let str = '';
                try { resultData.displayText.map(x => { str += ' -' + x; }); }
                catch (e) { throw new Error(); }
                tags.displayedText.textContent = str;
            })
            .BadResult((errorMsg) => { tags.displayedText.textContent = '*error load data'; tags.displayedText.className = 'red'; })
            .Builder();
}

function callStringsIOTGetApi() {
    if (tags.displayedIOTText)
        new AxiosRequest(() => configurations.stringsIOTGetApi())
            .GoodResult((resultData) => {
                let str = '';
                try { resultData.displayText.map(x => { str += ' -' + x; }); }
                catch (e) { throw new Error(); }
                tags.displayedIOTText.textContent = str;
            })
            .BadResult((errorMsg) => { tags.displayedIOTText.textContent = '*error load data'; tags.displayedIOTText.className = 'red'; })
            .Builder();
}

function callCommentsGetApi() {
    if (tags.comments)
        new AxiosRequest(() => configurations.commentsGetApi())
            .GoodResult((resultData) => {
                let str = '';
                try { resultData.comments.map(x => { str += '-' + x.replaceAll('<', '&lt;') + "<br>"; }); }
                catch (e) { throw new Error(); }
                tags.comments.innerHTML = str;
            })
            .BadResult((errorMsg) => { tags.comments.textContent = '*error load data'; tags.comments.className = 'red'; })
            .Builder();
}
