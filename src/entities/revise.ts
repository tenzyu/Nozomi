import fs from 'fs'
import { join } from 'path'

import { DAY_OF_SNOWFLAKE } from '../constant'

interface IRevise {
  authorId: string
  channelId: string
  messageId: string
  interval: number
  snowflake: string
}

export class Revise {
  static readonly path = join('data', 'revise.json')
  static revises: Record<string, IRevise>

  public static load() {
    this.revises = JSON.parse(fs.readFileSync(this.path, 'utf8'))
  }

  public static save() {
    fs.writeFileSync(this.path, JSON.stringify(this.revises, null, 2))
  }

  public static add(id: string, revise: IRevise) {
    this.revises[id] = revise
  }

  public static remove(id: string) {
    delete this.revises[id]
  }

  public static renew(id: string) {
    const revise = this.revises[id]
    if (!revise) return

    // 120日で終わり
    if (revise.interval >= 15) return this.remove(id)

    const snowflake = BigInt(revise.snowflake)
    const deltaSnowflake = BigInt(revise.interval * DAY_OF_SNOWFLAKE)
    const nextSnowflake = snowflake + deltaSnowflake

    revise.interval++
    revise.snowflake = nextSnowflake.toString()
  }
}
