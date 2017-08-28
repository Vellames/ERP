module.exports = {
    setJSONBody: setJSONBody
}

function setJSONBody(requestParams, context, ee, next) {
    
    const min = 100000000;
    const max = 999999999;
    const number = Math.floor(Math.random() * (max - min) + min);
    
    requestParams.json = {
        phone : "+55" + number
    }
    return next();
}