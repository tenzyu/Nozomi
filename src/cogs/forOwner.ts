import { client } from '..'
import { getTextChannelOrNull } from '../lib/discordBotUtils'
import * as constant from '../constant'

client.on('ready', async () => {
  const channel = getTextChannelOrNull(constant.channelLogBotActivity)
  await channel?.send('Logged in')
})
