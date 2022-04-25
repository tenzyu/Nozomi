import fs from 'fs'
import { daySnowflake } from '../constant'

export interface IRevise {
  authorId: string
  channelId: string
  messageId: string
  interval: number
  snowflake: string
}

export class Revise {
  static data: Record<string, IRevise> = {}
  static readonly path = 'data/revise.json'

  public static add(id: string, revise: IRevise) {
    this.data[id] = revise
  }

  public static remove(id: string) {
    delete this.data[id]
  }

  public static update(id: string) {
    const revise = this.data[id]
    if (!revise) return

    // 120日で終わり
    if (revise.interval >= 15) return this.remove(id)

    const nextSnowflake =
      BigInt(revise.snowflake) + BigInt(revise.interval * daySnowflake)

    revise.interval++
    revise.snowflake = nextSnowflake.toString()
  }

  public static load() {
    this.data = JSON.parse(fs.readFileSync(this.path, 'utf8'))
  }

  public static save() {
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2))
  }
}
