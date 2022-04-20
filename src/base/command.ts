import { ChatInputApplicationCommandData, CommandInteraction } from 'discord.js'

export class Command {
  constructor(
    readonly data: ChatInputApplicationCommandData,
    readonly execute: (interaction: CommandInteraction) => Promise<void>
  ) {}
}
