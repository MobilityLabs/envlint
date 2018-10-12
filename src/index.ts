import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as path from 'path'

import {isBoolean, isNumber} from './helpers/check-types'
import parse from './helpers/parse-files'

class Envlint extends Command {
  static description = 'Run envlint on your .env'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    config: flags.string({
      char: 'c',
      description: 'Your config file. Default is: .envlintrc',
    }),
  }

  static args = [{name: 'envFile'}]

  async run() {
    const {args, flags} = this.parse(Envlint)

    const appDir = fs.realpathSync(process.cwd())
    const resolveApp = (relPath: string) => path.resolve(appDir, relPath)

    // Use the passed in arg for the file to be linted or the default
    const dotenvFile = args.envFile
      ? resolveApp(args.envFile)
      : resolveApp('.env') // Defaulted to .env
    // Grab .env
    if (!fs.existsSync(dotenvFile)) {
      this.error(`No .env found at ${dotenvFile}`, {exit: 1})
    }

    const dotenv = require('dotenv')
    const env = dotenv.parse(fs.readFileSync(dotenvFile))

    // Grab .env.example
    // Verify example file
    let config = '.envlintrc'
    if (flags.config) {
      config = flags.config
    }
    const configFile = resolveApp(config)
    if (!fs.existsSync(configFile)) {
      this.error(`Missing config file at ${configFile}`, {exit: 1})
    }

    const configFileContent = fs.readFileSync(configFile, 'utf8')

    // TODO: Parse it with something loosey goosey like:
    // JSOL so we don't have to double quote things
    const exampleEnv = parse(configFileContent)
    if (exampleEnv instanceof Error) {
      this.error(exampleEnv)
    }
    const errors: string[] = []
    const foundKeys: string[] = []
    // Walk through each item in .env, check it against example
    Object.keys(env).forEach(k => {
      const value = env[k]
      foundKeys.push(k)
      const req = exampleEnv[k]
      if (!req) {
        errors.push(
          `.env contains a key, ${k} not in ${config}.
          You can add it by excluding required ${k}: {type: 'BOOLEAN'}`
        )
        return
      }
      // Check lengths
      if (req.length) {
        const lengths = req.length.split('-')
        let length
        let minLength
        let maxLength
        if (lengths.length === 1) {
          length = parseInt(lengths[0], 10)
        }
        if (lengths.length === 2) {
          minLength = parseInt(lengths[0], 10)
          maxLength = parseInt(lengths[1], 10)
        }
        if (length && value.length !== length) {
          errors.push(`.env key, ${k} is not equal to the length, ${length}`)
        }
        if (
          minLength &&
          maxLength &&
          (value.length < minLength || value.length > maxLength)
        ) {
          errors.push(
            `.env key, ${k} does not fit between min and max length, ${
              req.length
            }`
          )
        }
      }
      // Check types
      if (req.type) {
        switch (req.type) {
          case 'boolean':
          case 'BOOLEAN': {
            if (!isBoolean(value)) {
              errors.push(`.env key, ${k} is not a boolean`)
            }
            break
          }
          case 'number':
          case 'NUMBER': {
            if (!isNumber(value)) {
              errors.push(`.env key, ${k} is not a number`)
            }
            break
          }
          case 'string':
          case 'STRING': {
            if (isNumber(value) || isBoolean(value)) {
              errors.push(`.env key, ${k} is not a string`)
            }
            break
          }
          default: {
            errors.push('Unrecognized type')
          }
        }
      }
    })

    // Walk through remaining .env.example items
    Object.keys(exampleEnv).forEach(k => {
      if (foundKeys.includes(k)) {
        return
      }
      const req = exampleEnv[k]
      if (req.required) {
        errors.push(`.env is missing ${k}`)
      }
    })

    // TODO: If they are interactively parsing, offer to fix it or ask for value

    // Display errors and exit with error
    if (errors.length > 0) {
      errors.forEach(err => {
        this.warn(err)
      })
      this.exit(2)
    }

    // No errors, exit 0
    this.exit(0)
  }
}

export = Envlint
