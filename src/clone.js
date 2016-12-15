// var Git = require("nodegit");

// Git.Clone("https://github.com/tlqylzn/export-to-excel.git", "repo/excel").then(function(repository) {
//   // Work with the repository object here.
// });




var nodegit = require("nodegit");
var promisify = require("promisify-node");
var fse = promisify(require("fs-extra"));
var path = "submodule/excel";

fse.remove(path).then(function() {
  var entry;

  nodegit.Clone(
    "https://github.com/tlqylzn/export-to-excel.git",
    path,
    {
      fetchOpts: {
        callbacks: {
          certificateCheck: function() {
            // github will fail cert check on some OSX machines
            // this overrides that check
            return 1;
          }
        }
      }
    })
  .then(function(repo) {
    return repo.getCommit("07842270f402732c29127660b1103c7ecfe2b01f");
  })
  .then(function(commit) {
    return commit.getEntry("README.md");
  })
  .then(function(entryResult) {
    entry = entryResult;
    return entry.getBlob();
  })
  .done(function(blob) {
    console.log(entry.name(), entry.sha(), blob.rawsize() + "b");
    console.log("========================================================\n\n");
    var firstTenLines = blob.toString().split("\n").slice(0, 10).join("\n");
    console.log(firstTenLines);
    console.log("...");
  });
});