/**
 * @class SomeLibrary.Object
 * An object definition class for this library
 */
SomeLibrary.define("SomeLibrary.Object", function () {
    // Public Methods
    //==================================================

    /**
     * @member SomeLibrary.Object
     * @method initComponent
     * Initializes the current object function
     * @param {object} config The configuration of the object
     * @param {function} callback A callback function that will be triggered once the component has been initialized.
     */
    function initComponent(config, callback) {  }

    /**
     * @member SomeLibrary.Object
     * @method fireEvent
     * Fires an event
     * @param {string} event The event name to be fired
     * @param {params} params The parameters to be sent to the event handler
     * @returns {bool} result True of false
     */
    function fireEvent() {  }

    /**
     * @member SomeLibrary.Object
     * @method addListener
     * Adds an event listener
     * @param {string} eventName 
     * @param {function} fn 
     * @param {object} scope 
     */
    function addListener(eventName, fn, scope) {  }

    //Private Methods
    //==================================================

    /**
     * @member SomeLibrary.Object
     * @private
     * @method _applyListeners
     * Adds an event listeners
     * @param {SomeLibrary.Object} me This instance of SomeLibrary.Object 
     * @param {object} configuredListeners 
     */
    function _applyListeners(me, configuredListeners) {  }
});