/**
 * @class SomeLibrary.data.SocketsClient
 * A proxy that will handle the connection to the data server
 */
SomeLibrary.define('SomeLibrary.data.SocketsClient', function () {

    // Public Methods
    //==================================================
    /**
     * @member SomeLibrary.data.SocketsClient
     * @method constructor
     * Instantiate the current object
     */
    function _constructor() {  }

    /**
     * @member SomeLibrary.data.SocketsClient
     * @method Request
     * Performs a data request
     * @param {object} options An object that contains the request options. It might containg the following:
     * @param {string} options.url The request method on the socket
     * @param {function} options.callback The callback method when the response is received
     * @return {object} some value
     */
    function Request(options) {  };

    //Private Methods
    //==================================================
    /**
     * @member SomeLibrary.data.SocketsClient
     * @method executeQueue
     * @private
     * Performs request in the queue
     * @param {SomeLibrary.data.SocketsClient} me The reference this instance of SomeLibrary.data.SocketsClient
     */
    function executeQueue(me) {  }

    /**
     * @member SomeLibrary.data.SocketsClient
     * @method executeQueue
     * @private
     * Performs the socket request
     * @param {SomeLibrary.data.SocketsClient} me The reference this instance of SomeLibrary.data.SocketsClient
     * @param {Object} request The request for the server
     */
    function performRequest(me, request) {  }
});