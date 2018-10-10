import { expect, test } from "@oclif/test";

import cmd = require("../src");

describe("envlint", () => {
  test
    .stdout()
    .do(() => cmd.run(["--config", "./test/.envlintrc", "./test/.env"]))
    .it("lints test file", ctx => {
      expect(ctx.stdout).to.contain("hello world");
    });

  test
    .stdout()
    .do(() => cmd.run(["--name", "jeff"]))
    .it("runs hello --name jeff", ctx => {
      expect(ctx.stdout).to.contain("hello jeff");
    });
});
