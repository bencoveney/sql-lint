/* tslint:disable */
const shelltest = require("shelltest");
/* tslint:enable */
const sqlLint = "./dist/src/main.js";
xtest("it brings back a version number", done => {
    shelltest()
        .cmd(`${sqlLint} --version`)
        .expect('stdout', "0.0.9\n")
        .end(done);
});
xtest("it warns us if it can't find a configuration file", done => {
    shelltest()
        .cmd(`${sqlLint} -f test/test-files/test.sql`)
        .expect('stdout', /Can't open file .*config\.json.*/)
        .end(done);
});
xtest("it tells us if it can't find a file", done => {
    shelltest()
        .cmd(`${sqlLint} -f non-existent-file`)
        .expect('stdout', "Can't open file non-existent-file. Does it exist?\n")
        .end(done);
});
xtest("it works with stdin", done => {
    shelltest()
        .cmd(`echo 'DELETE FROM person ;' | ${sqlLint}`)
        .expect('stdout', /.*DELETE missing WHERE.*/)
        .end(done);
});
//# sourceMappingURL=sql-lint.test.js.map