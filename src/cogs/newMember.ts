import { client } from '../index';
import * as constant from '../constant';

client.on('guildMemberAdd', async (member) => {
  if (member.user.bot) {
    return;
  }
  await member.roles.add(constant.roleEveryone2Id);
});
