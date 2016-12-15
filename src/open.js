var Git = require("nodegit");

var getMostRecentCommit = function(repository) {
  return repository.getBranchCommit("master");
};

var getCommitMessage = function(commit) {
    console.log(commit.getParents());
  return commit.message();
};

// get gitnode repo commit info
Git.Repository.open("./")
  .then(getMostRecentCommit)
  .then(getCommitMessage)
  .then(function(message) {
    console.log(message);
  });