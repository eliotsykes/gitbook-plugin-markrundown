var exec = require('child_process').execSync;
var kramed = require('kramed'); // kramed is the markdown processor
var config = require(process.cwd() + '/markrundown');

function buildPath() { return config.buildPath || "build"; }

module.exports = {
  blocks: {
    run: {
      process: function(block) {
        var regexToExtractRunnable = /(?:\`{3,})(bash)(?:\s+)([^]*?)(?:\s+)(?:\`{3,})/g;
        var runnable = regexToExtractRunnable.exec(block.body);
        var language = runnable[1];
        var body = runnable[2];
        if (language === "bash") {
          exec("mkdir -p " + buildPath());
          exec(body, {cwd: buildPath()});
        } else {
          throw "Currently unable to handle language '" + language + "'";
        }

        var hide = block.kwargs["hide"];
        if (hide) {
          return "";
        }
        return kramed(block.body);
      }
    },
    patch: {
      process: function(block) {
        var fencedBlockRegex = /^(`{3,}|~{3,})(.*)\n([\s\S]+?)\s*\1 *(?:\n|$)/;
        var match = block.body.trim().match(fencedBlockRegex);
        var patch = match[3];

        var gitApplyCmd = "git apply <<EOF\n" + patch + "\nEOF";
        exec(gitApplyCmd, {cwd: buildPath()});

        var hide = block.kwargs["hide"];
        if (hide) {
          return "";
        }
        return kramed(block.body);
      }
    }
  },
  hooks: {
    init: function(page) {
      // console.log("HOOKS: init page", page);
      // console.log("HOOKS: init this", this);
      return page;
    },
    finish: function(page) {
      // console.log("HOOKS: finish");
      return page;
    },
    "finish:before": function(page) {
      // console.log("HOOKS: finish:before");
      return page;
    },
    // Deprecated:
    page: function(page) {
      // console.log("HOOKS: page", page);
      return page;
    },
    // Deprecated:
    "page:before": function(page) {

      var allFencedBlocksRegex = /^(`{3,}|~{3,})(.*)\n([\s\S]+?)\s*\1 *(?:\n|$)/mg;

      var fencedBlockRegex = /^(`{3,}|~{3,})(.*)\n([\s\S]+?)\s*\1 *(?:\n|$)/;

      var allFencedBlocks = page.content.match(allFencedBlocksRegex);

      for (var i = 0; allFencedBlocks && i < allFencedBlocks.length; i++) {
        var match = allFencedBlocks[i].match(fencedBlockRegex);
        var keywords = match[2].split(/\s+/);

        var isPatch = "patch" === keywords[0];
        var isToBeHidden = keywords.indexOf("hide") >= 0;

        var block = false;

        if (isPatch) {
          var tagWithArgs = "patch"
          if (isToBeHidden) {
            tagWithArgs += " hide=true"
          }

          var fence = match[1];
          var body = match[3];

          block = "{% " + tagWithArgs + " %}\n"
              + fence + "diff\n" // Change patch to diff for highlightjs css
              + body + "\n"
              + fence + "\n{% endpatch %}";
        } else {
          var isToBeRun = keywords.indexOf("run") >= 0;
          if (isToBeRun) {
            var tagWithArgs = "run"
            if (isToBeHidden) {
              tagWithArgs += " hide=true"
            }

            var fence = match[1];
            var body = match[3];
            var language = keywords.shift();

            block = "{% " + tagWithArgs + " %}\n"
              + fence + language + "\n"
              + body + "\n"
              + fence + "\n{% endrun %}";
          }
        }

        if (block) {
          page.content = page.content.replace(match.input, block);
        }

      }

      return page;

    }
  }
}
