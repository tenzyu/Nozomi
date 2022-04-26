import { Message, MessageEmbed } from 'discord.js'
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import { client } from '..'
import { Revise } from '../base/revise'
import { channelRevise, daySnowflake } from '../constant'
import { fetchTextChannel } from '../lib/discordBotUtils'
import { getJstTime, toSnowflake } from '../utils'

client.on('ready', () => {
  Revise.load()
})

client.on('messageCreate', async (message: Message) => {
  if (message.type !== 'REPLY') return
  if (!message.content.startsWith('revise')) return

  const quotedMessage = await message.fetchReference()
  if (!quotedMessage) return

  if (message.author.id !== quotedMessage.author.id) {
    await message.reply('現在は自分が送信したメッセージにのみ対応しています。')
    return
  }

  const id = toSnowflake(quotedMessage.createdAt)
  const snowflake = String(
    BigInt(toSnowflake(getJstTime())) + BigInt(daySnowflake)
  )

  Revise.add(id, {
    authorId: quotedMessage.author.id,
    channelId: quotedMessage.channel.id,
    messageId: quotedMessage.id,
    interval: 1,
    snowflake
  })
  Revise.save()

  await message.reply('登録しました。翌日からスタートです。')
})

const _schedule = new RecurrenceRule()
_schedule.second = 0
scheduleJob(_schedule, async () => {
  const nowSnowflake = toSnowflake(getJstTime())

  for (const [
    id,
    { authorId, channelId, messageId, interval, snowflake }
  ] of Object.entries(Revise.data)) {
    if (snowflake < nowSnowflake) {
      const quotedChannel = await fetchTextChannel(channelId)
      const quotedMessage = await quotedChannel.messages.fetch(messageId)
      if (!quotedMessage) {
        console.log(`[revise] ${id} message not found`)
        continue
      }

      const description = `${quotedMessage.content}\n\n${quotedMessage.url}`
      const reviseBoard = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${interval}回目の復習`)
        .setDescription(description)
        .setTimestamp(quotedMessage.createdAt)
      const channel = await fetchTextChannel(channelRevise)

      channel.send({
        content: `<@${authorId}>`,
        embeds: [reviseBoard]
      })

      Revise.update(id)
      Revise.save()
    }
  }
})
