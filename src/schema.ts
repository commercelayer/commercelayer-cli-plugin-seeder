import config from './config'
import { getCommerceLayerDataFile, pathJoin } from './common'
import { CLIError } from '@oclif/core/lib/errors'


type SchemaModel = {
  attributes: Record<string, string>;
  relationships: Record<string, string>;
}

type SchemaData = Record<string, SchemaModel>


const schemaData: SchemaData = {}


const loadSchema = async (): Promise<SchemaData> => {

  const schemaUrl = pathJoin(config.dataUrl, config.schemaFolder)

  const schema = await getCommerceLayerDataFile(schemaUrl, 'openapi.json')

  const createObjects: SchemaData = {}

  Object.entries(schema.components.schemas as object).forEach(([k, v]) => {

    if (k.endsWith('Create')) {

      const val = v.properties.data.properties
      const type = val.type.enum[0]

      createObjects[type] = {
        attributes: {},
        relationships: {},
      }// as SchemaModel

      // Attributes
      Object.entries(val.attributes.properties as object).forEach(([k, v]) => {
        createObjects[type].attributes[k] = v.type
      })

      // Relationships
      Object.entries(val.relationships.properties as object).forEach(([k, v]) => {
        const types = v.properties.data.properties.type.enum
        createObjects[type].relationships[k] = (types.length > 1) ? types : types[0]
      })

    }
  })

  Object.assign(schemaData, createObjects)

  return createObjects

}

export { loadSchema }


const attributeType = (type: string, name: string): string | undefined => {
  const res = schemaData[type as keyof SchemaModel]
  if (!res) return undefined
  const attr = res.attributes[name]
  if (!attr) return undefined
  return attr
}

const relationshipType = (type: string, name: string, value: string): string | undefined => {

  const res = schemaData[type as keyof SchemaModel]
  if (!res) return undefined
  const rel = res.relationships[name]
  if (!rel) return undefined

  if (Array.isArray(rel)) { // type is an ENUM
    const idx = value.indexOf('/')
    if (idx < 0) throw new CLIError(`Field ${name} of ${type} is an ENUM, you must specify the related resource type`)
    const rt = value.substring(0, idx)
    if (!rel.includes(rt)) throw new CLIError(`Invalid resource type for field ${name}: ${rt}`)
    return rt
  }

  return rel

}


export { attributeType, relationshipType }
