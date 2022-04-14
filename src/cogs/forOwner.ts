import { client } from '../index'
import { getTextChannelById } from '../lib/discordBotUtils'
import * as constant from '../constant'
import { TextChannel } from 'discord.js'

let channelReminder: TextChannel | undefined
client.on('ready', () => {
  // init
  channelReminder = getTextChannelById('920072102537732136')

  const channel = getTextChannelById(constant.channelLogBotActivity)
  channel?.send('Logged in')
})
