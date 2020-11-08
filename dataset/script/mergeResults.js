const fs = require("fs");
const path = require("path");
const JsonStreamStringify = require("json-stream-stringify");

const config = require("./config");

const output = [];
const owners = fs.readdirSync(path.join(config.output, "exp"));
for (let owner of owners) {
  const projects = fs.readdirSync(path.join(config.output, "exp", owner));
  for (project of projects) {
    const libs = fs.readdirSync(
      path.join(config.output, "exp", owner, project)
    );
    for (let lib of libs) {
      const r = JSON.parse(
        fs.readFileSync(path.join(config.output, "exp", owner, project, lib))
      );
      const o = {
        url: r.url,
        commit: r.commit,
        lib: r.lib,
        executions: {},
      };
      let originalCount = null;
      for (let exec of r.executions) {
        let executionTime = 0;
        let count = {
          passing: 0,
          failing: 0,
          error: 0,
        };
        
        for (let cl in exec.test) {
          const test = exec.test[cl];
          executionTime += test.execution_time;

          count.passing += test.passing;
          count.failing += test.failing;
          count.error += test.error;
        }
        let passing = count.passing > 0 && count.failing == count.error && count.error == 0;
        if (exec.name == 'original') {
          originalCount = count;
        } else {
          if (count.passing != originalCount.passing) {
            passing = false;
          }
        }
        o.executions[exec.name] = {
          name: exec.name,
          passing: count.passing,
          failing: count.failing,
          error: count.error,
          valid: passing,
          executionTime
        };
      }
      output.push(o);
    }
  }
}

const writeStream = fs.createWriteStream(
  path.join("dashboard", "data", "projects.json")
);
new JsonStreamStringify(output).pipe(writeStream);