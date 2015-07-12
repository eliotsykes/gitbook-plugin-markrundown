var exec = require('child_process').execSync;

module.exports = {
  blocks: {
    run: {
      process: function(block) {
        console.log("Encountered run", block);
        // console.log("++++++++++++++++++++++++");
        // console.log("here is the block", block);
        // console.log("++++++++++++++++++++++++");
        var regexToExtractRunnable = /(?:\`{2,})(bash)(?:\s+)([^]*?)(?:\s+)(?:\`{2,})/g;
        var runnable = regexToExtractRunnable.exec(block.body);
        var language = runnable[1];
        var body = runnable[2];
        if (language === "bash") {
          exec(body);  
        } else {
          throw "Currently unable to handle language '" + language + "'";
        }
        return block.body;
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
        console.log("Encountered patch", block);
        return block.body;
      }
    }
  },
  hooks: {
    init: function(page) {
      console.log("HOOKS: init");
      return page;
    },
    finish: function(page) {
      console.log("HOOKS: finish");
      return page;
    },
    "finish:before": function(page) {
      console.log("HOOKS: finish:before");
      return page;
    },
    // Deprecated:
    page: function(page) {
      console.log("HOOKS: page");
      return page;
    },
    // Deprecated:
    "page:before": function(page) {
      console.log("HOOKS: page:before");
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