import { AnyChannel, CategoryChannel, TextChannel } from 'discord.js'
import { client } from '../index'

export const isTextChannel = (
  channel: AnyChannel | null
): channel is TextChannel => {
  return channel instanceof TextChannel
}

// TODO:
export const getTextChannelById = (id: string) => {
  const channel = client.channels.resolve(id)
  if (isTextChannel(channel)) {
    return channel
  }
}

export const getTextChannel = async (id: string) => {
  const channel = await client.channels.fetch(id)

  if (isTextChannel(channel)) {
    return channel
  } else {
    throw new Error('TextChannel does not exist')
  }
}

export const isCategoryChannel = (
  channel: AnyChannel | null
): channel is CategoryChannel => {
  return channel instanceof CategoryChannel
}

export const getCategoryChannel = async (id: string) => {
  const channel = await client.channels.fetch(id)

  if (isCategoryChannel(channel)) {
    return channel
  } else {
    throw new Error('CategoryChannel does not exist')
  }
}

export const getLastMessageOrNull = async (channel: TextChannel) => {
  const messages = await channel.messages.fetch({ limit: 1 }).catch(() => null)
  if (messages === null) return null

  const lastMessage = messages.first()
  if (lastMessage === undefined) return null

  return lastMessage
}
