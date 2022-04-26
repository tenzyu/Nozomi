import * as constant from '../constant'
import { Message } from 'discord.js'
import { client } from '..'
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import {
  fetchCategoryChannel,
  fetchLastMessageOrNull,
  isCategoryChannel,
  isTextChannel
} from '../lib/discordBotUtils'

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return
  if (!isTextChannel(message.channel)) return
  if (!isCategoryChannel(message.channel.parent)) return
  if (message.channel.parent.id !== constant.categoryInactive) return

  message.channel.edit({ parent: constant.categoryActive })
})

// every minute
const schedule = new RecurrenceRule()
schedule.second = 0

scheduleJob(schedule, async () => {
  const active = await fetchCategoryChannel(constant.categoryActive)
  const inactive = await fetchCategoryChannel(constant.categoryInactive)
  const channels = active.children.filter(isTextChannel).toJSON()

  for (const channel of channels) {
    const lastMessage = await fetchLastMessageOrNull(channel)
    if (lastMessage === null) continue

    const now = new Date()
    const last = lastMessage.editedAt || lastMessage.createdAt
    const diff = Math.abs(now.getTime() - last.getTime())
    const hour = 1000 * 60 * 60
    const diffHour = Math.floor(diff / hour)

    if (diffHour > 6) channel.edit({ parent: inactive })
  }
})
