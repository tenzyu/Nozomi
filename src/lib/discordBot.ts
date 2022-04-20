import { Client, ClientOptions, CommandInteraction } from 'discord.js'
import { readdir } from 'fs/promises'
import { join, parse } from 'path'
import { Command } from '../base/command'

export class MyBot extends Client {
  readonly commands: Command[] = []

  constructor(options: ClientOptions) {
    super(options)
  }

  public loadCogs = async () => {
    const cogs = await readdir(join('src', 'cogs'))

    for (const cog of cogs) {
      const cogName = parse(cog).name

      await import(`../cogs/${cogName}`)
      console.log(`loaded ${cogName} cog`)
    }
  }

  async loadCommand(guildId: string): Promise<void> {
    const commandFiles = await readdir(join('src', 'commands'))

    commandFiles.map(async (file) => {
      const commandName = parse(file).name
      const command: Command = (await import(`../commands/${commandName}`))
        .default

      this.commands.push(new Command(command.data, command.execute))
    })

    this.once('ready', async () => {
      const data = this.commands.map((command) => command.data)

      await this.application?.commands.set(data, guildId)
      this.application?.commands.cache.forEach((command) =>
        console.log(`loaded ${command.name} command`)
      )
    })

    this.on('interactionCreate', async (interaction) => {
      if (!(interaction instanceof CommandInteraction)) return
      const command: Command | undefined = this.commands.find(
        (command) => interaction.command?.name === command.data.name
      )

      await command?.execute(interaction).catch(console.error)
    })
  }
}
