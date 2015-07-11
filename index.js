var exec = require('child_process').execSync;

module.exports = {
  blocks: {
    exec: {
      process: function(block) {
        console.log("Encountered exec", block);
        // console.log("++++++++++++++++++++++++");
        // console.log("here is the block", block);
        // console.log("++++++++++++++++++++++++");
        var executableBodyRegex = /(?:\`{2,})(bash)(?:\s+)([^]*?)(?:\s+)(?:\`{2,})/g;
        var executableData = executableBodyRegex.exec(block.body);
        var language = executableData[1];
        var body = executableData[2];
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
    // Deprecatred:
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