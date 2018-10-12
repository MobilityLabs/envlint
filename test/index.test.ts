import { test } from '@oclif/test';
import * as assert from 'assert';

import cmd = require('../src');
import { isBoolean, isNumber } from '../src/helpers/check-types';

describe('envlint', () => {
  describe('Integration', () => {
    test
      .stdout()
      .do(() =>
        cmd.run([
          '-s',
          '--config',
          './test/fixtures/.envlintrc-failure',
          './test/fixtures/.env'
        ])
      )
      .exit(2)
      .it('exits on lint errors with exit code 2');
    test
      .stdout()
      .do(() =>
        cmd.run([
          '-s',
          '--config',
          './test/fixtures/.envlintrc-success',
          './test/fixtures/.env-success'
        ])
      )
      .exit(0)
      .it('completes successfully with exit code 0');

    test
      .stdout()
      .do(() =>
        cmd.run([
          '-s',
          '--config',
          './test/fixtures/.envlintrc-not-valid',
          './test/fixtures/.env'
        ])
      )
      .exit(1)
      .it('fails on bad config with exit code 1');

    test
      .stdout()
      .do(() =>
        cmd.run([
          '-s',
          '--config',
          './test/fixtures/.envlintrc-empty',
          './test/fixtures/.env'
        ])
      )
      .exit(1)
      .it('fails on empty config with exit code 1');

      test
        .stdout()
        .do(() =>
          cmd.run([
            '-s',
            '--config',
            './test/fixtures/.envlintrc-json',
            './test/fixtures/.env'
          ])
        )
        .exit(0)
        .it('uses json for config object');
  })

  describe('isBoolean()', () => {
    it('returns false for string', () => {
      assert.ok(isBoolean('a string') === false);
    });
    it('returns false for a number', () => {
      assert.ok(isBoolean('1') === false);
    });
    it('returns true for TRUE', () => {
      assert.ok(isBoolean('TRUE') === true);
    });
    it('returns true for FALSE', () => {
      assert.ok(isBoolean('FALSE') === true);
    });
    it('returns true for T', () => {
      assert.ok(isBoolean('T') === true);
    });
    it('returns true for F', () => {
      assert.ok(isBoolean('F') === true);
    });
    it('returns true for true', () => {
      assert.ok(isBoolean('true') === true);
    });
    it('returns true for false', () => {
      assert.ok(isBoolean('false') === true);
    });
  });

  describe('isNumber()', () => {
    it('returns false for a boolean', () => {
      assert.ok(isNumber('false') === false);
    });
    it('returns false for a string', () => {
      assert.ok(isNumber('a string') === false);
    });
    it('returns true for an integer', () => {
      assert.ok(isNumber('1') === true);
    });
    it('returns true for a fixed number', () => {
      assert.ok(isNumber('1.23') === true);
    });
    it('returns true for a negative number', () => {
      assert.ok(isNumber('-1') === true);
    });
  });

});
