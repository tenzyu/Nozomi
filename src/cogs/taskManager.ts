import { Message } from 'discord.js'
import { RecurrenceRule, scheduleJob } from 'node-schedule'

import { client } from '..'
import { ID_CHANNEL_TASK_MANAGER } from '../constant'
import { fetchTextChannel } from '../lib/discordUtils'

const EMOJI_SET_TASK = '\uD83D\uDCCC' // Pushpin
const EMOJI_UNSET_TASK = '\uD83D\uDC4D' // Thumbs Up

const setTask = async (message: Message) => {
  await message.pin()
  await message.reply(
    'タスクを登録したよ！\nタスクが完了したら :thumbsup: を付けよう！'
  )
}

const unsetTask = async (message: Message) => {
  await message.unpin()
  await message.reply(':tada: タスク完了おめでとう！ :tada:')
  await message.reactions.removeAll()
}

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return
  if (message.channelId !== ID_CHANNEL_TASK_MANAGER) return

  if (message.content.startsWith('。')) {
    await setTask(message)
  }
})

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return

  const message = reaction.message
  /* resolve partials */
  const _reaction = reaction.partial ? await reaction.fetch() : reaction
  const _user = user.partial ? await user.fetch() : user
  const _message = message.partial ? await message.fetch() : message

  if (_message.channel.id !== ID_CHANNEL_TASK_MANAGER) return
  if (_message.author.id !== _user.id) return

  const emoji = _reaction.emoji.toString()
  if (emoji === EMOJI_SET_TASK) await setTask(_message)
  if (emoji === EMOJI_UNSET_TASK) await unsetTask(_message)
})

////////////////////////////////////////////////////////////////////////////////

const schedule = new RecurrenceRule()
schedule.hour = 9 // it means 18:00 in JST
schedule.minute = 0

scheduleJob(schedule, async () => {
  const channel = await fetchTextChannel(ID_CHANNEL_TASK_MANAGER)
  const tasks = await channel.messages.fetchPinned()
  if (!tasks || tasks.size === 0) return

  const taskAuthorMentions = [
    ...new Set(tasks.map(({ author }) => author.toString()))
  ]
  const reminder =
    taskAuthorMentions.join(' ') +
    '\n未完了のタスクがあります！' +
    '\n未完了のタスクはピン留めされています！'

  await channel.send(reminder)
})
