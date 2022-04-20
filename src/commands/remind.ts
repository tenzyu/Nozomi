import { CommandInteraction, GuildChannel } from 'discord.js'
import { Schedule } from '../base/schedule'
import { getJstTime } from '../utils'

export default {
  data: {
    name: 'remind',
    description: '(日本時間で)リマインダーをセットします。',
    options: [
      {
        name: 'message',
        type: 'STRING',
        description:
          '(必須)内容を入力してください。入力しない場合は対応する現在の値が入ります。',
        required: true
      },
      {
        name: 'minutes',
        type: 'NUMBER',
        description: '(任意)分を指定してください。'
      },
      {
        name: 'hours',
        type: 'NUMBER',
        description: '(任意)時間を指定してください。'
      },
      {
        name: 'date',
        type: 'NUMBER',
        description: '(任意)日を指定してください。'
      },
      {
        name: 'month',
        type: 'NUMBER',
        description: '(任意)月を入力してください。'
      },
      {
        name: 'years',
        type: 'NUMBER',
        description: '(任意)年を入力してください。'
      }
    ]
  },
  async execute(interaction: CommandInteraction) {
    if (!(interaction.channel instanceof GuildChannel)) return
    if (interaction.member === null) return

    const opts = interaction.options
    const message = opts.getString('message', true)
    const channelId = interaction.channel.id
    const authorId = interaction.member.user.id

    const schedule = {
      authorId,
      channelId,
      message
    }

    const jstTime = getJstTime()

    const fixedMonth = opts.getNumber('month')
      ? opts.getNumber('month')! - 1
      : jstTime.getMonth()

    jstTime.setFullYear(opts.getNumber('years') || jstTime.getFullYear())
    jstTime.setMonth(fixedMonth)
    jstTime.setDate(opts.getNumber('date') || jstTime.getDate())
    jstTime.setHours(opts.getNumber('hours') || jstTime.getHours())
    jstTime.setMinutes(opts.getNumber('minutes') || jstTime.getMinutes())

    Schedule.add(jstTime.toString(), schedule)

    await interaction.reply({
      content: `${jstTime} に\n${message} でリマインダーをセットしました。`
    })
  }
}
