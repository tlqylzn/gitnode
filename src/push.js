var nodegit = require("nodegit");
var path = require("path");
var promisify = require("promisify-node");
var fse = promisify(require("fs-extra"));
fse.ensureDir = promisify(fse.ensureDir);

var fileName = "newFile.txt";
var fileContent = "hello world";

var repository;
var remote;
var oid;

var signature = nodegit.Signature.create("Foo bar",
  "foo@bar.com", 123456789, 60);

// Load up the repository index and make our initial commit to HEAD
nodegit.Repository.open(path.resolve(__dirname, "../.git"))
  .then(function(repoResult) {
    repository = repoResult;
    
    return repository.refreshIndex();
  })
  .then(function(index) {
    return index.addAll()
      .then(function() {
        return index.write();
      })
      .then(function() {
        return index.writeTree();
      });
  })
  .then(function(oidResult) {
    oid = oidResult;
    return nodegit.Reference.nameToId(repository, "HEAD");
  })
  .then(function(head) {
    return repository.getCommit(head);
  })
  .then(function(parent) {
    return repository.createCommit("HEAD", signature, signature,
      "commit 111", oid, [parent]);
  })

  // Add a new remote
  .then(function() {
    return nodegit.Remote.push(
        ["refs/heads/master:refs/heads/master"],
        {
          callbacks: {
            credentials: function(url, userName) {
              return nodegit.Cred.sshKeyFromAgent(userName);
            }
          }
        }
      );
  }).done(function() {
    console.log("Done!");
  });
