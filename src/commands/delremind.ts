import { CommandInteraction, MessageActionRow, MessageButton } from 'discord.js'

import { client } from '..'
import { type ISchedule, Schedule } from '../entities/schedule'

export default {
  data: {
    name: 'delremind',
    description: 'リマインダーを削除するメニューを開きます。'
  },
  async execute(interaction: CommandInteraction) {
    const remindDate: [string, ISchedule][] = []
    const id = interaction.member?.user.id!

    Object.entries(Schedule.data).forEach((datum) => {
      if (datum[1].authorId === id) remindDate.push(datum)
    })

    if (remindDate.length === 0) {
      return interaction.reply({
        content: 'リマインダーが登録されていません。',
        ephemeral: true
      })
    }

    const buttons: MessageButton[] = []
    let menu = '削除するリマインダーを選択してください。\n\n'

    for (let i = 0; i < remindDate.length; i++) {
      menu += `\`${i}: ${remindDate[i][1].message}\`\n`

      buttons.push(
        new MessageButton()
          .setLabel(`${i}`)
          .setStyle('PRIMARY')
          .setCustomId(`delremind:${i}`)
      )
    }

    await interaction.reply({
      content: menu,
      components: [new MessageActionRow().addComponents(buttons)],
      ephemeral: true
    })

    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isButton()) return
      if (!interaction.customId.includes('delremind')) return
      const remindIndex = parseInt(interaction.component.label!)
      const date = remindDate[remindIndex][0]
      Schedule.remove(date)
      Schedule.save()
      await interaction.reply({
        content: 'リマインダーを削除しました。',
        ephemeral: true
      })
    })
  }
}
