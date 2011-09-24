//Lawnchair.adapters.splice(0, 2);


function newLawnchair(name) {

    var match = /adapter=([-\w]+)/.exec(window.location.href),
        adapters = Lawnchair.adapters,
        options = {},
        callback = new Function(),
        i;

    if (match) {
        _.each(adapters, function(adapter) {
            if (adapter.adapter == match[1]) {
                options.adapter = adapter;
            }
        });

        if (!options.adapter) {
            ok(false, "no such adapter: " + match[1]);
        }
    }

    options.name = name;

    var lc = new Lawnchair(options, callback);

    lc.nuke();

    return lc;
}


test("Original Backbone.sync was saved", function() {
    equals(typeof(Backbone.sync.previous), 'function', 'original Backbone.sync was saved')
});


asyncTest("Backbone models", function() {

    var failTest = function() {
        ok(false, "operation failed")
    };

    var testSave = function(model) {
        model.set({fruit: 'bananas'});
        model.save(null, {
            success: function(saved) {
                ok(!saved.isNew(), "model was saved");
                ok(saved.id != null, "saved object has id");
                strictEqual(model.get('fruit'), 'bananas', "object attributes are unchanged");
                strictEqual(saved.key, undefined, "lawnchair key not present");
                strictEqual(saved.get('key'), undefined, "lawnchair key not present");
                testUpdate(saved);
            },
            error: failTest
        });
    };

    var testUpdate = function(model) {
        model.set({'quantity': 4});
        model.save(null, {
            success: function(updated) {
                strictEqual(model.id, updated.id, "object ID is unchanged");
                strictEqual(model.get('id'), updated.id, "object ID is unchanged");
                strictEqual(model.get('fruit'), 'bananas', "object attributes are unchanged");
                strictEqual(model.get('quantity'), 4, "object attributes are unchanged");
                testFetch(model.id, model.lawnchair);
            },
            error: failTest
        });
    };

    var testFetch = function(id, lawnchair) {
        var model = new Backbone.Model();
        model.id = id;
        model.lawnchair = lawnchair;
        model.fetch({
            success: function(fetched) {
                strictEqual(fetched.id, id, "fetched correct object");
                strictEqual(fetched.get('id'), id, "fetched correct object");
                strictEqual(fetched.key, undefined, "lawnchair key not present");
                strictEqual(fetched.get('key'), undefined, "lawnchair key not present");
                strictEqual(fetched.get('fruit'), 'bananas', "model attributes were fetched");
                strictEqual(fetched.get('quantity'), 4, "model attributes were fetched");
                testFetchCollection(fetched.id, fetched.lawnchair);
            },
            error: failTest
        });
    };

    var testFetchCollection = function(id, lawnchair) {
        var coll = new Backbone.Collection();
        coll.lawnchair = lawnchair;
        coll.fetch({
            success: function(c) {
                strictEqual(c.size(), 1, "fetched one object");
                var first = c.at(0);

                strictEqual(first.id, id, "fetched correct object");
                strictEqual(first.key, undefined, "lawnchair key not present");
                strictEqual(first.get('key'), undefined, "lawnchair key not present");
                strictEqual(first.get('fruit'), 'bananas', "model attributes were fetched");

                testFetchNonExistent();
            },
            error: failTest
        });
    };

    var testFetchNonExistent = function() {
        var model = new Backbone.Model();
        model.id = 'apple';
        model.lawnchair = newLawnchair('fruit');
        model.fetch({
            success:failTest,
            error: function() {
                ok(true, "no such object")
            }
        });
    };

    var model = new Backbone.Model();
    model.lawnchair = newLawnchair();

    testSave(model);

    expect(21);
    start();
});

asyncTest("Backbone collections", function() {

    var collA = new Backbone.Collection();

    collA.lawnchair = newLawnchair();

    var failTest = function() {
        ok(false, "operation failed")
    };

    collA.fetch({
        success: function() {
            strictEqual(collA.size(), 0, 'empty collection');
        },
        error: failTest
    });

    var createModel = function(attr, success) {
        collA.create(attr, {
            success: success,
            error: failTest
        });
    };

    createModel({foo: 12}, function() {

        strictEqual(collA.size(), 1, 'first model added to collection');

        createModel({bar: 13}, function() {
            
            strictEqual(collA.size(), 2, 'second model added to collection');

            var model = new Backbone.Model();
            var id = collA.at(1).id;

            model.id = id;
            model.lawnchair = collA.lawnchair;

            model.fetch({
                success: function(fetched) {
                    strictEqual(fetched.id, id, 'fetched correct object');
                    strictEqual(fetched.get('bar'), 13, 'model attributes were fetched');
                },
                error: failTest
            });

            var collB = new Backbone.Collection({});

            collB.lawnchair = collA.lawnchair;

            collB.fetch({
                success: function() {
                    strictEqual(collB.size(), 2, 'fetched two object collection');
                },
                error: failTest
            });

            collB.at(0).destroy({
                success: function() {
                    collB.fetch({
                        success: function() {
                            strictEqual(collB.size(), 1, 'deleted first object');
                            strictEqual(collB.at(0).get('bar'), 13, 'deleted first object');
                        },
                        error: failTest
                    })
                },
                error: failTest
            })

        })
    });

    expect(8);
    start();
});
