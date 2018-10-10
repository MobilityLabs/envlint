const parse = (contentString: string) => {
  let json
  try {
    json = JSON.parse(contentString)
  } catch (err) {
    json = parseYAML(contentString)
  }
  return json
}

export default parse

interface ConfigObject {
  [key: string]: ParamObject
}

interface ParamObject {
  required?: boolean
  type?: ParamTypes
  length?: string
  default?: string
}

type ParamTypes = 'number' | 'string' | 'boolean'

const parseYAML = (contentString: string) => {
  const configObject: ConfigObject = {}
  let cachedParams: string[] = [] // We need this to be able to build object
  contentString.split('\n').forEach(line => {
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
    // Variable line
    const varArr = line.match(/^([\w.-]+)(=)?([\w.-]+)?/)
    // No match
    if (varArr == null) {
      return
    }
    const key = varArr[0]
    const paramObj: ParamObject = {}

    const defaultVal = varArr[2] || null
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
          break
        }
      }
    })
    configObject[key] = paramObj
  })
  cachedParams = [] //reset cached params
  return configObject
}
