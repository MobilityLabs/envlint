import {ConfigObject, ParamObject, ParamTypes} from '../types'

const parse = (contentString: string): ConfigObject => {
  let json
  try {
    json = JSON.parse(contentString)
  } catch (err) {
    if (err instanceof SyntaxError) {
      json = parseExample(contentString)
    } else {
      throw new Error(err.message)
    }
  }
  return json
}

export default parse

const parseExample = (contentString: string) => {
  const configObject: ConfigObject = {}
  let cachedParams: string[] = [] // We need this to be able to build object
  contentString.split('\n').forEach((line, index) => {
    // Is this an empty line
    if (line.match(/^\n/)) {
      return
    }
    // Is this a comment line
    if (line.match(/^#/)) {
      // Create array of params and remove whitespace
      // TODO: Ensure params consist of allowed params only
      line
        .substr(1)
        .split(',')
        .forEach(p => {
          cachedParams.push(p.trim())
        })
      return
    }
    // We already checked for empty line and comment. If this line has spaces but isn't a comment
    // it must be a mistake
    if (line.match(/\s/)) {
      throw SyntaxError(
        `Improperly formatted comment in config file on line ${index + 1}`
      )
    }
    // Variable line
    // Trying to match shell standards for env vars
    // https://stackoverflow.com/questions/2821043/allowed-characters-in-linux-environment-variable-names
    const matchArray = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)(?:=)?([\w.]+)?/)
    // [match, key, variable, index, line]
    // No match
    if (matchArray === null) {
      return
    }
    const key = matchArray[1]
    const paramObj: ParamObject = {}

    const defaultVal = matchArray[2] || null
    if (defaultVal) {
      paramObj.default = defaultVal
    }
    cachedParams.forEach(p => {
      switch (true) {
        case p === 'required': {
          paramObj.required = true
          break
        }
        case ['number', 'string', 'boolean'].includes(p): {
          const param = p as ParamTypes
          paramObj.type = param
          break
        }
        case p.match(/length/) !== null: {
          const length = p.split('=')
          paramObj.length = length[1]
        }
      }
    })
    // Do not add a param obj if we do not have a key
    if (key) {
      configObject[key] = paramObj
    }
    cachedParams = [] //reset cached params
  })
  if (Object.keys(configObject).length === 0) {
    throw new SyntaxError('Config file has no settings')
  }
  return configObject
}
