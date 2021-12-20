import path from 'path'
import axios from 'axios'
import fs from 'fs'


const isRemotePath = (path: string): boolean => {
  return path.startsWith('http://') || path.startsWith('https://')
}

const pathJoin = (base: string, seg: string): string => {
  if (isRemotePath(base)) return (base.endsWith('/') ? base : (base + '/')) + seg
  return path.join(base, seg)
}


const getCommerceLayerDataFile = async (url: string, file: string): Promise<any> => {

  const fileName = file.endsWith('.json') ? file : file + '.json'
  const filePath = pathJoin(url, fileName)

  let dataFile: any

  if (isRemotePath(url)) {
    const remFile = await axios.get(filePath)
    dataFile = remFile.data
  } else {
    const locFile = fs.readFileSync(path.resolve(filePath), { encoding: 'utf-8' })
    dataFile = JSON.parse(locFile)
  }

  return dataFile

}


export { getCommerceLayerDataFile, isRemotePath, pathJoin }
