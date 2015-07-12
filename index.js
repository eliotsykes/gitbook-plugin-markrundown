var exec = require('child_process').execSync;

module.exports = {
  blocks: {
    run: {
      process: function(block) {
        console.log("Encountered run");
        // console.log("++++++++++++++++++++++++");
        // console.log("here is the block", block);
        // console.log("++++++++++++++++++++++++");
        var regexToExtractRunnable = /(?:\`{3,})(bash)(?:\s+)([^]*?)(?:\s+)(?:\`{3,})/g;
        var runnable = regexToExtractRunnable.exec(block.body);
        var language = runnable[1];
        var body = runnable[2];
        if (language === "bash") {
          exec(body);  
        } else {
          throw "Currently unable to handle language '" + language + "'";
        }
        // return block.body;
        return "nothing";
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
        console.log("Encountered patch");
        // var regexToExtractPatch = /(?:\`{3,})(?:\s+)([^]*?)(?:\s+)(?:\`{3,})/g;
        // var patch = regexToExtractPatch.exec(block.body)[1];
        
        // function stripEscapedChars(patch) {
        //   var stripped = patch.replace(/\\-/g, '-').replace(/\\[+]/g, '+');
        //   return stripped;
        // }

        // patch = stripEscapedChars(patch);
        
        // var gitApplyCmd = "git apply --directory=build/hello-world <<EOF\n" + patch + "\nEOF";
        // exec(gitApplyCmd);
        // return block.body;
        return "nothing";
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
      console.log("allFencedBlocks", allFencedBlocks);

      for (var i = 0; allFencedBlocks && i < allFencedBlocks.length; i++) {
        var match = allFencedBlocks[i].match(fencedBlockRegex);
        console.log("match", match);
        // var input = match.input.replace(match[2], "");
        
      }

      return page;

      // var regixAll = /([^\S]```.*)(:(.+))[\s\S]+?```/g;
      // var regix = /([^\S]```.*)(:(.+))[\s\S]+?```/;
      // var matchAll = page.content.match(regixAll);

      // for(var i = 0; matchAll && i < matchAll.length; i++){
      //   var match = matchAll[i].match(regix);
      //   var input = match.input.replace(match[2], "");
      //   var replace = input.replace(match[1], "\n\n!FILENAME " + match[3] + match[1]);
      //   page.content = page.content.replace(match.input, replace);
      // }

      // return page;
      // console.log("HOOKS: page:before", page, this);
      // if (this.readmeFile != page.path) {
        // console.log("NOT README.md", this.readmeFile, page.path);
        // page.content = page.content + "{% patch %}\necho{% endpatch %}\n";
      // }
      // page.content = page.content + "{% patch %}\necho{% endpatch %}\n";
      // var regexToExtractRunnable = /(?:\`{3,})(bash)(?:\s+)([^]*?)(?:\s+)(?:\`{3,})/g;
      // var runnable = regexToExtractRunnable.exec(block.body);
      // var language = runnable[1];
      // var body = runnable[2];
      // if (language === "bash") {
      //   exec(body);  
      // } else {
      //   throw "Currently unable to handle language '" + language + "'";
      // }
      // // return block.body;
      // return "nothing";

      
      // return page;
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