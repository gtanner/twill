# twill
A new approch to javascript aspect oriented programming.  Twill is an attempt to create
an AOP framework for javascript that feels like it was written for javascript. Twill
will run fine in both node and in the browser.

# install

    npm install twill

# example

    var twill = require("twill"),
        foo = {
            stuff: function (a,b,c) { 
                console.log("stuff");
            },
            things: function () {
                console.log("things");
            },
            foo: function (bar, baz) {
                console.log(bar);
                console.log(baz);
            },
            baz: function () {
                throw "oh noes!";
            }
        };

    var foo_aspect = twill.aspect(foo, function (weave) {
        weave.before.stuff(function (a, b, c) {
            console.log("calling stuff!");
        });

        weave.after.things(function (a, b, c) {
            console.log("called things!");
        });

        weave.around.foo(function (args, orig) {
            orig(args[0] || "default_bar", args[1] || "default_baz");
        });


        weave.exception.baz(function (e) {
            console.log(e);
            //just rethrow if you don't want to swallow the exception
            throw e;
        });

        weave.create.sweet = function () {
            console.log("dude");
        };

        //can be done for before/after/around (around also passes orig)
        weave.all.after(function (method, args) {
            window.stats.track(method);
            console.log("stats +1 for " + method);
        });

        weave.create.dude = function () {
            console.log("sweet");
        };
    });

    foo.stuff("one", "two", "three");
    // calling stuff
    // stuff
    // stats +1 for stuff

    foo.things(1,2,3);
    //things
    //called things
    //status +1 for things

    foo.foo();
    //default_bar
    //default_baz
    //stats +1 for things

    foo.sweet();
    //dude
    //stats +1 for sweet

    foo.dude();
    //sweet

    twill.unweave(foo_aspect);

    foo.stuff("one", "two", "three");
    // stuff

    foo.things(1,2,3);
    //things

    foo.foo();
    //undefined
    //undefined

    foo.sweet();
    //method not defined

    foo.dude();
    //method not defined

# todo:

This is a very early release and not everything is done just yet. 
Still todo:
- make it work in the browser

# how to develop

all code should have tests written in node-unit. Run the tests with:

    jake test

