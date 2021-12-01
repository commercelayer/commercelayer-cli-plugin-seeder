/* eslint-disable no-await-in-loop */
import Command from '../../base'
import Listr from 'listr'
import chalk from 'chalk'
import { readResourceData, SeederResource } from '../../data'
import { CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import { checkResourceType } from './check'


export default class SeederClean extends Command {

  static description = 'clean previously imported seeder data'

  static flags = {
    ...Command.flags,
  }

  static examples = [
    '$ commercelayer seeder:clean -u <seedUrl>',
    '$ cl seeder:clean -b multi_market',
  ]


  async run() {

    const { flags } = this.parse(SeederClean)

    const organization = flags.organization
    const businessModel = flags.businessModel

    this.initCommerceLayer(flags)

    this.log()

    // Read business model data
    const model = await this.readBusinessModelData(flags.url, businessModel)

    // Delete resource in reverse order
    const resources = model.reverse()

    // Create tasks
    const tasks = new Listr(resources.map(res => {
      return {
        title: `Delete ${chalk.italic(res.resourceType)}`,
        task: async (_ctx: any, task: Listr.ListrTaskWrapper<any>) => {
          const origTitle = task.title
          const n = await this.deleteResources(res, flags, task)
          task.title = `${origTitle}: [${n}]`
        },
      }
    }), { concurrent: false, exitOnError: true })

    this.log(`Cleaning data for organization ${chalk.yellowBright(organization)} using business model ${chalk.yellowBright(businessModel)}...\n`)

    // Execute tasks
    tasks.run()
      .then(() => this.log(`\n${chalk.bold.greenBright('SUCCESS')} - Data cleaning completed! \u2705`))
      .catch(() => this.log(`\n${chalk.bold.redBright('ERROR')} - Data cleaning not completed, correct errors and rerun the ${chalk.bold('clean')} command`))
      .finally(() => this.log())

  }


  private async deleteResources(res: SeederResource, flags: any, task: Listr.ListrTaskWrapper): Promise<number> {

    checkResourceType(res.resourceType)


    // Read resource type data
    const resourceData = await readResourceData(flags.url, res.resourceType).catch(() => {
      throw new Error(`Error reading ${chalk.redBright(res.resourceType)} data file`)
    })

    // Build reference keys list
    const referenceKeys = res.importAll ? Object.values(resourceData).map(v => v.reference) : res.referenceKeys
    if (!Array.isArray(referenceKeys)) throw new Error(`Attribute ${chalk.redBright('referenceKeys')} of ${chalk.yellowBright(res.resourceType)} must be an array`)

    for (const r of referenceKeys) {

      task.title = task.title.substring(0, task.title.indexOf(res.resourceType)) + chalk.italic(res.resourceType) + ': ' + r

      // Read resource data
      const resource = resourceData[r]
      const type = resource?.type || res.resourceType

      const remoteRes = await this.findByReference(type, r)
      if (remoteRes) await this.deleteResource(remoteRes.type, remoteRes.id)

    }

    return referenceKeys.length

  }


  private async deleteResource(type: string, id: string): Promise<void> {

   checkResourceType(type)

    const resSdk: any = this.cl[type as keyof CommerceLayerClient]

   await resSdk.delete(id).catch((error: any) => {
      if (CommerceLayerStatic.isApiError(error)) {
        const err = error.first()
        if (err) throw new Error(`${err.code}: ${err.detail}${err.meta?.value ? ` (${err.meta?.value})` : ''}`)
      }
    })

  }

}
