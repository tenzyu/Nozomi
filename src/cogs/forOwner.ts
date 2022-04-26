import { client } from '..'
import { getTextChannelById } from '../lib/discordBotUtils'
import * as constant from '../constant'

client.on('ready', async () => {
  const channel = getTextChannelById(constant.channelLogBotActivity)
  await channel?.send('Logged in')
})
