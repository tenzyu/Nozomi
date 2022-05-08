import fs from 'fs'

export interface ISchedule {
  authorId: string
  channelId: string
  message: string
}

export class Schedule {
  static data: Record<string, ISchedule> = {}
  static readonly path = 'data/schedule.json'

  public static add(date: string, schedule: ISchedule) {
    this.data[date] = schedule
  }

  public static remove(date: string) {
    delete this.data[date]
  }

  public static load() {
    this.data = JSON.parse(fs.readFileSync(this.path, 'utf8'))
  }

  public static save() {
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2))
  }
}
