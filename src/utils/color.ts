import { ClientUser, GuildMember, HexColorString, User } from 'discord.js'
import { getAverageColor } from 'fast-average-color-node'

export const colorFromAvatar = async (
  user: User | ClientUser | GuildMember
): Promise<HexColorString> => {
  const url = user.displayAvatarURL({ format: 'png', size: 32 })
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const color = await getAverageColor(Buffer.from(arrayBuffer))

  return color.hex as HexColorString
}
