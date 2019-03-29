const kindOf = require('kind-of');
const {common2} = require('./common.js');

function callbackSync(){
    require.ensure([], function(){
        require('./async.js')
    }, 'async')
}