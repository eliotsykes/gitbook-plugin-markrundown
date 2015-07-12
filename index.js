var exec = require('child_process').execSync;
var kramed = require('kramed');

module.exports = {
  blocks: {
    run: {
      process: function(block) {
        var regexToExtractRunnable = /(?:\`{3,})(bash)(?:\s+)([^]*?)(?:\s+)(?:\`{3,})/g;
        var runnable = regexToExtractRunnable.exec(block.body);
        var language = runnable[1];
        var body = runnable[2];
        if (language === "bash") {
          exec(body);  
        } else {
          throw "Currently unable to handle language '" + language + "'";
        }
        console.log("how to parse markdown", this);

        return kramed(block.body);
      }
    },
    // hide: {
    //   process: function(block) {
    //     console.log("hiding", block);
    //     return "";
    //   }
    // },
    patch: {
      process: function(block) {
        var fencedBlockRegex = /^(`{3,}|~{3,})(.*)\n([\s\S]+?)\s*\1 *(?:\n|$)/;
        var match = block.body.trim().match(fencedBlockRegex);
        var patch = match[3];
        
        function stripEscapedChars(patch) {
          var stripped = patch.replace(/\\-/g, '-').replace(/\\[+]/g, '+');
          return stripped;
        }

        patch = stripEscapedChars(patch);
        
        var gitApplyCmd = "git apply <<EOF\n" + patch + "\nEOF";
        exec(gitApplyCmd);
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

      // var allFencedBlocksRegex = /^(`{3,}|~{3,}) *(\S+ ?)* *\n([\s\S]+?)\s*\1 *(?:\n|$)/mg;
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
          block = "{% patch %}\n" + match.input + "\n{% endpatch %}";
        } else {
          var isToBeRun = keywords.indexOf("run") >= 0;
          if (isToBeRun) {
            var fence = match[1];
            var body = match[3];
            var language = keywords.shift();
          
            block = "{% run %}\n"
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
    // "page:before": function(page) {
    //   console.log("-------------------------");
    //   console.log("page in markrundown plugin is:", page);
    //   console.log("page.type in markrundown plugin is:", page.type);
    //   console.log("page.sections in markrundown plugin is:", page.sections);
    //   console.log("-------------------------");
    //   return page;
    // }
  }
}