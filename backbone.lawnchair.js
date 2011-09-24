Backbone.sync = (function() {

    var previous = Backbone.sync;

    var sync = function(method, model, options) {

        var store = model.lawnchair || model.collection.lawnchair;

        var callback = function(record) {

            if (record == null) {
                options.error("Record not found");
                return
            }

            var keyToId = function(obj) {
                obj.id = model.id || obj.key;   // workaround for Lawnchair issue #57
                delete obj.key;
            };

            if (_.isArray(record)) {
                _.each(record, keyToId);
            } else {
                keyToId(record);
            }

            options.success(record);
        };

        var json = model.toJSON();

        json.key = model.id;
        
        delete json.id;

        switch (method) {
            case "read":
                json.key ? store.get(json.key, callback) : store.all(callback);
                break;
            case "create":
                resp = store.save(json, callback);
                break;
            case "update":
                resp = store.save(json, callback);
                break;
            case "delete":
                resp = store.remove(json.key, options.success);
                break;
        }

        return null;
    };

    /*
     * Expose the previous Backbone.sync as Backbone.sync.previous in case
     * the caller wishes to switch provider.
     */
    sync.previous = previous;

    return sync;

})();
