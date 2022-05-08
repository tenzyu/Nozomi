import { Message } from 'discord.js'
import { RecurrenceRule, scheduleJob } from 'node-schedule'

import { client } from '..'
import { ID_CATEGORY_ACTIVE, ID_CATEGORY_INACTIVE } from '../constant'
import {
  fetchCategoryChannel,
  fetchLastMessageOrNull,
  isCategoryChannel,
  isTextChannel
} from '../lib/discordUtils'

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return
  if (!isTextChannel(message.channel)) return
  if (!isCategoryChannel(message.channel.parent)) return
  if (message.channel.parent.id !== ID_CATEGORY_INACTIVE) return

  message.channel.edit({ parent: ID_CATEGORY_ACTIVE })
})

const schedule = new RecurrenceRule()
schedule.second = 0
scheduleJob(schedule, async () => {
  const active = await fetchCategoryChannel(ID_CATEGORY_ACTIVE)
  const inactive = await fetchCategoryChannel(ID_CATEGORY_INACTIVE)
  const channels = active.children.filter(isTextChannel).toJSON() // Collection to Array magic

  const now = new Date()
  for (const channel of channels) {
    const lastMessage = await fetchLastMessageOrNull(channel)
    if (lastMessage === null) continue

    const last = lastMessage.editedAt || lastMessage.createdAt
    const diff = Math.abs(now.getTime() - last.getTime())
    const hour = 1000 * 60 * 60
    const diffHour = Math.floor(diff / hour)

    if (diffHour > 6) channel.edit({ parent: inactive })
  }
})
