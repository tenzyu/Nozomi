import { RecurrenceRule, scheduleJob } from 'node-schedule'

import { client } from '..'
import { Schedule } from '../entities/schedule'
import { fetchTextChannel, toSnowflake } from '../lib/discordUtils'
import { getJstTime } from '../utils'

client.on('ready', () => Schedule.load())

const _schedule = new RecurrenceRule()
_schedule.second = 0
scheduleJob(_schedule, async () => {
  const nowSnowflake = toSnowflake(getJstTime())

  for (const [remindSnowflake, schedule] of Object.entries(Schedule.data)) {
    if (nowSnowflake < remindSnowflake) continue

    const channel = await fetchTextChannel(schedule.channelId)

    channel.send(`<@${schedule.authorId}> ${schedule.message}`)
    Schedule.remove(remindSnowflake)
    Schedule.save()
  }
})
