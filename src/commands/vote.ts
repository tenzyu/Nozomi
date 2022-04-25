import {
  CommandInteraction,
  GuildMember,
  Message,
  MessageEmbed
} from 'discord.js'
import { avatar2color } from '../utils'

export default {
  data: {
    name: 'vote',
    description: '投票機能です。',
    options: [
      {
        name: 'title',
        description: '(必須)投票のタイトルを指定してください。',
        type: 'STRING',
        required: true
      },
      {
        name: 'options',
        description: '(任意)選択肢を空白区切りで入力してください。',
        type: 'STRING'
      }
    ]
  },
  async execute(interaction: CommandInteraction) {
    if (!interaction.inGuild()) return

    const args = interaction.options.getString('options')?.split(/\s+/) || []
    console.log(args)
    if (args.length > 20) {
      await interaction.reply({
        content: '[ERROR]: 選択肢は20個以下にしてください。',
        ephemeral: true
      })
      return
    }

    const emojis: string[] = []
    const choices: string[] = []
    const constEmojiLargeA = 0x1f1e6

    if (!args.length) {
      emojis.push('👍', '👎')
    } else {
      args.forEach((choice, index) => {
        emojis.push(String.fromCodePoint(constEmojiLargeA + index))
        choices.push(`${emojis[index]} ${choice}`)
      })
    }

    const color = await avatar2color(<GuildMember>interaction.member)
    const embed = new MessageEmbed()
      .setTitle(interaction.options.getString('title', true))
      .setDescription(choices.join('\n'))
      .setColor(color || '#ffffff')
      .setTimestamp()

    const voteBoard = (await interaction.reply({
      embeds: [embed],
      fetchReply: true
    })) as Message

    emojis.map(async (emoji) => await voteBoard.react(emoji))
  }
}
