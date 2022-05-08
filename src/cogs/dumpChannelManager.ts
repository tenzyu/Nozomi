import { Message } from 'discord.js'
import { RecurrenceRule, scheduleJob } from 'node-schedule'

import { client } from '..'
import { DAY_OF_SNOWFLAKE, ID_CHANNEL_DUMP } from '../constant'
import { fetchTextChannel, toSnowflake } from '../lib/discordUtils'
import { getJstTime } from '../utils'

const queue: Message[] = []

client.on('ready', async () => {
  const dumpChannel = await fetchTextChannel(ID_CHANNEL_DUMP)
  const messages = await dumpChannel.messages.fetch()

  queue.push(...messages.reverse().toJSON())
})

client.on('messageCreate', async (message) => {
  if (message.channel.id !== ID_CHANNEL_DUMP) return

  queue.push(message)
})

const deleteOldLog = async () => {
  if (queue.length === 0) return

  const message = queue[0]
  const nowSnowflake = toSnowflake(getJstTime())
  const diffSnowflake = BigInt(nowSnowflake) - BigInt(message.id) // message.id is snowflake

  if (diffSnowflake > DAY_OF_SNOWFLAKE) {
    const message = queue.shift()!
    await message.delete().catch(() => {})
    deleteOldLog()
  }
}

const schedule = new RecurrenceRule()
schedule.second = 0
scheduleJob(schedule, deleteOldLog)
