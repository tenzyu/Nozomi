import { GuildMember, HexColorString } from 'discord.js'
import { getAverageColor } from 'fast-average-color-node'

export const avatar2color = async (
  user: GuildMember
): Promise<HexColorString> => {
  const url = user.displayAvatarURL({ format: 'png', size: 32 })
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return (await getAverageColor(buffer)).hex as HexColorString
}
