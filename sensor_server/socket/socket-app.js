let publicSocket = null;

const configure = function (io) {
    if (!isConfigured())
        publicSocket = io;
};

const isConfigured = function () {
    return publicSocket != null;
};

const createRefreshResponse = function (refresh) {
    return {
        refresh: refresh
    };
};

const emitEvent = function (eventName, body) {
    publicSocket.emit(eventName, body);
};

const notifyPasienData = function(id,data){
    emitEvent('/topic/perangkat/'+id,data)
}

module.exports = {
    configure,
    notifyPasienData
}