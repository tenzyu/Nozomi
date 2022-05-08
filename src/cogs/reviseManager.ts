import { Message, MessageEmbed } from 'discord.js'
import { RecurrenceRule, scheduleJob } from 'node-schedule'

import { client } from '..'
import { DAY_OF_SNOWFLAKE, ID_CHANNEL_REVISE } from '../constant'
import { Revise } from '../entities/revise'
import { fetchTextChannel, toSnowflake } from '../lib/discordUtils'
import { getJstTime } from '../utils'

client.on('ready', () => Revise.load())

client.on('messageCreate', async (message: Message) => {
  if (message.type !== 'REPLY') return
  if (!message.content.startsWith('revise')) return

  const quotedMessage = await message.fetchReference()
  if (message.author.id !== quotedMessage.author.id) {
    await message.reply('現在は自分が送信したメッセージにのみ対応しています。')
    return
  }

  const id = toSnowflake(quotedMessage.createdAt)
  const currentSnowflake = toSnowflake(getJstTime())
  const snowflake = String(BigInt(currentSnowflake) + BigInt(DAY_OF_SNOWFLAKE))

  Revise.add(id, {
    authorId: quotedMessage.author.id,
    channelId: quotedMessage.channel.id,
    messageId: quotedMessage.id,
    interval: 1,
    snowflake
  })
  Revise.save()

  await message.reply('登録しました。明日から送信されます。')
})

////////////////////////////////////////////////////////////////////////////////

const schedule = new RecurrenceRule()
schedule.second = 0
scheduleJob(schedule, async () => {
  const nowSnowflake = toSnowflake(getJstTime())

  for (const [id, revise] of Object.entries(Revise.revises)) {
    if (nowSnowflake < revise.snowflake) continue

    const reviseChannel = await fetchTextChannel(ID_CHANNEL_REVISE)
    const quotedChannel = await fetchTextChannel(revise.channelId)
    const quotedMessage = await quotedChannel.messages.fetch(revise.messageId)
    if (!quotedMessage) {
      await reviseChannel.send(`[revise] ${id} message not found`)
      continue
    }

    const reviseText = `${quotedMessage.content}\n\n${quotedMessage.url}`
    const reviseBoard = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`${revise.interval}回目の復習`)
      .setDescription(reviseText)
      .setTimestamp(quotedMessage.createdAt)

    await reviseChannel.send({
      content: `<@${revise.authorId}>`,
      embeds: [reviseBoard]
    })

    Revise.renew(id)
    Revise.save()
  }
})
