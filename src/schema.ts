import config from './config'
import { getCommerceLayerDataFile, pathJoin } from './common'


type SchemaModel = {
  attributes: { [key: string]: string };
  relationships: { [key: string]: string };
}

type SchemaData = { [key: string]: SchemaModel }


const schemaData: SchemaData = {}


const loadSchema = async (): Promise<SchemaData> => {

  const schemaUrl = pathJoin(config.dataUrl, config.schemaFolder)

  const schema = await getCommerceLayerDataFile(schemaUrl, 'openapi.json') as any

  const createObjects: SchemaData = {}

  Object.entries(schema.components.schemas).forEach(([k, v]) => {

    if (k.endsWith('Create')) {

      const val = (v as any).properties.data.properties
      const type = val.type.default

      createObjects[type] = {
        attributes: {},
        relationships: {},
      } as SchemaModel

      // Attributes
      Object.entries(val.attributes.properties).forEach(([k, v]) => {
        createObjects[type].attributes[k] = (v as any).type
      })

      // Relationships
      Object.entries(val.relationships.properties).forEach(([k, v]) => {
        createObjects[type].relationships[k] = (v as any).properties.type.default
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

const relationshipType = (type: string, name: string): string | undefined => {
  const res = schemaData[type as keyof SchemaModel]
  if (!res) return undefined
  const rel = res.relationships[name]
  if (!rel) return undefined
  return rel
}

export { attributeType, relationshipType }
