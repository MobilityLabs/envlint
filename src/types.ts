export interface ConfigObject {
  [key: string]: ParamObject
}

export interface ParamObject {
  required?: boolean
  type?: ParamTypes
  length?: string
  default?: string
}

export type ParamTypes =
  | 'number'
  | 'NUMBER'
  | 'string'
  | 'STRING'
  | 'boolean'
  | 'BOOLEAN'
