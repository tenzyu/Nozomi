import { RecurrenceRule, scheduleJob } from 'node-schedule'
import { getTextChannel } from '../lib/discordBotUtils'
import { Schedule } from '../base/schedule'
import { client } from '..'
import { getJstTime } from '../utils'

client.on('ready', () => {
  Schedule.load()
})

const _schedule = new RecurrenceRule()
_schedule.second = 0

scheduleJob(_schedule, async () => {
  const nowTime = getJstTime().toString()

  for (const [date, { authorId, channelId, message }] of Object.entries(
    Schedule.data
  )) {
    if (date < nowTime) {
      const channel = await getTextChannel(channelId)

      channel.send(`<@${authorId}> ${message}`)
      Schedule.remove(date)
    }
  }
})
