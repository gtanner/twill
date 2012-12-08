var twill = require("../lib/twill");

exports["when aspecting after all methods"] = {

    "it calls the aspect after each method" : function (test) {
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
            weave.all.after(function (method) {
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
            weave.all.after(function (method, args) {
                test.equal(3, args.length);
                test.done();
            });
        });

        target.puppies("omg", "cute", "puppies");
    }
};
