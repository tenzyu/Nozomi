import { RecurrenceRule, scheduleJob } from 'node-schedule'
import { getTextChannel } from '../lib/discordBotUtils'
import { Schedule } from '../base/schedule'
import { client } from '..'
import { getJstTime, toSnowflake } from '../utils'

client.on('ready', () => {
  Schedule.load()
})

const _schedule = new RecurrenceRule()
_schedule.second = 0

scheduleJob(_schedule, async () => {
  const nowSnowflake = toSnowflake(getJstTime())

  for (const [
    remindSnowflake,
    { authorId, channelId, message }
  ] of Object.entries(Schedule.data)) {
    if (remindSnowflake < nowSnowflake) {
      const channel = await getTextChannel(channelId)

      channel.send(`<@${authorId}> ${message}`)
      Schedule.remove(remindSnowflake)
      Schedule.save()
    }
  }
})
