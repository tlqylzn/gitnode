var nodegit = require("nodegit");
var path = require("path");
var promisify = require("promisify-node");
var fse = promisify(require("fs-extra"));
// ensureDir is an alias to mkdirp, which has the callback with a weird name
// and in the 3rd position of 4 (the 4th being used for recursion). We have to
// force promisify it, because promisify-node won't detect it on its
// own and assumes sync
fse.ensureDir = promisify(fse.ensureDir);

/**
 * This example creates a certain file `newfile.txt`, adds it to the git
 * index and commits it to head. Similar to a `git add newfile.txt`
 * followed by a `git commit`
**/

var repo;
var index;
var oid;

nodegit.Repository.open(path.resolve(__dirname, "../.git"))
  .then(function(repoResult) {
    repo = repoResult;
  })
  .then(function() {
    return repo.refreshIndex();
  })
  .then(function(indexResult) {
    index = indexResult;
  })
  .then(function() {
    return index.addAll();
  })
  .then(function() {
    return index.writeTree();
  })
  .then(function(oidResult) {
    oid = oidResult;
    return nodegit.Reference.nameToId(repo, "HEAD");
  })
  .then(function(head) {
    return repo.getCommit(head);
  })
  .then(function(parent) {
    var author = nodegit.Signature.create("Scott Chacon",
      "schacon@gmail.com", 123456789, 60);
    var committer = nodegit.Signature.create("Scott A Chacon",
      "scott@github.com", 987654321, 90);

    return repo.createCommit("HEAD", author, committer, "message", oid, [parent]);
  })
  .done(function(commitId) {
    console.log("New Commit: ", commitId);
  });
