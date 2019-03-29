const kindOf = require('kind-of');
const {common1} = require('./common.js');
function callbackSync(){
    require.ensure([], function(){
        require('./async.js')
    }, 'async')
}