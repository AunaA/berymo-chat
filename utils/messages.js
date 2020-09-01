// Util modülü, bazı yardımcı program işlevlerine erişim sağlar.
// The Util module provides access to some utility functions.
// söz dizimi şöyledir var util = require('util');

const moment = require('moment');

function formatMessage(username, text){
    return {
        username,
        text,
        time: moment().format('h:mm a') //hours minute am pm
    };
}

module.exports = formatMessage;



