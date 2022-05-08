import { Client, CommandInteraction } from 'discord.js'
import { readdir } from 'fs/promises'
import { join, parse } from 'path'
import { Command } from '../base/command'

export class MyBot extends Client {
  readonly commands: Command[] = []
  // must be an absolute path
  readonly pathToCogs = join('src', 'cogs')
  readonly pathToCommands = join('src', 'commands')

  public loadCogs = async () => {
    const cogs = await readdir(this.pathToCogs)

    cogs.map(parse).forEach(async ({ name }) => {
      // must be a relative path
      const path = join('..', 'cogs', name)

      await import(path)
        .then((_) => console.log(`loaded ${name} cog`))
        .catch((error) => console.log(`failed to load ${name} cog\n${error}`))
    })
  }

  async loadCommand(guildId: string): Promise<void> {
    const commandFiles = await readdir(this.pathToCommands)

    commandFiles.map(parse).forEach(async ({ name }) => {
      const path = join('..', 'commands', name)
      const { data, execute }: Command = (await import(path)).default

      this.commands.push(new Command(data, execute))
    })

    this.once('ready', async () => {
      const dataArray = this.commands.map((command) => command.data)

      dataArray.forEach(async (data) => {
        await this.application?.commands
          .create(data, guildId)
          .then((_) => console.log(`created command ${data.name}`))
          .catch((error) =>
            console.log(`failed to create command ${data.name}\n${error}`)
          )
      })
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
