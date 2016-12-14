var Git = require("nodegit");

Git.Clone("https://github.com/tlqylzn/export-to-excel.git", "repo/excel").then(function(repository) {
  // Work with the repository object here.
});