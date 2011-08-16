var twill = require("../lib/twill");

exports["when aspecting around all methods"] = {

    "it calls the aspect around each method" : function (test) {
        var result = "",
            target = {
                eeny: function () {
                }, 
                meeny: function () {
                }, 
                miny: function () {
                },
                moe: function () {
                }
            };

        twill.aspect(target, function (weave) {
            weave.all.around(function (method) {
                result += method + " ";
            });
        });

        target.eeny();
        target.meeny();
        target.miny();
        target.moe();

        test.equal("eeny meeny miny moe ", result);

        test.done();
    },

    "it passes the arguments to the aspect": function (test) {
        var target = {
            puppies: function (are, kinda, cute) {
                return 43;    
            }
        };

        twill.aspect(target, function (weave) {
            weave.all.around(function (method, args) {
                test.equal(2, args.length);
                test.done();
            });
        });

        target.puppies("omg", "cute");
    },

    "it passes the original function to the aspect" : function (test) {
        var _corn = function () { },  
            target = {
                corn: _corn
            };

        twill.aspect(target, function (weave) {
            weave.all.around(function (method, args, orig) {
                test.equal(_corn, orig);
                test.done();
            });
        });

        target.corn();
    },

    "it returns the aspects return value" : function (test) {
        var target = {
            theMeaningOfLife: function () { },
            theMeaningOfExistance: function () { },
            airspeedOfAnUnladenSwallow: function () { }
        };


        twill.aspect(target, function (weave) {
            weave.all.around(function () {
                return 42;
            });
        });

        test.equal(target.theMeaningOfLife(), 42);
        test.equal(target.theMeaningOfExistance(), 42);
        test.equal(target.airspeedOfAnUnladenSwallow(), 42);

        test.done();
    }
};
