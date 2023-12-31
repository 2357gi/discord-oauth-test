// src/pages/api/auth.ts
import axios, {AxiosResponse} from "axios";
import { NextApiRequest, NextApiResponse } from 'next';
import withSession from '@/lib/session';  // 追加
import { DiscordGuild, DiscordUser } from "@/types/DiscordTypes"; // 型定義のインポート

export default withSession(async function handler(req: NextApiRequest, res: NextApiResponse) {  // withSessionを追加
  const code = req.query.code as string;

  if (!code) {
    console.log(req)
    return res.status(400).send('No code provided');
  }

  // 環境変数のチェック
  const clientId: string | undefined = process.env.DISCORD_CLIENT_ID;
  const clientSecret: string | undefined = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri: string | undefined = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri ) {
    console.error('Environment variables are not set');
    return res.status(500).send('Internal Server Error');
  }

  try {
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      scope: 'identify guilds',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const userToken = tokenResponse.data.access_token;

    // ユーザー情報を取得
    const userResponse :AxiosResponse = await axios.get<DiscordUser>('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    const userId: string = userResponse.data.id
    const userName: string = userResponse.data.username

    const SCGuildId: string | undefined = process.env.SC_GUILD_ID;
    const ICSGuildId: string | undefined = process.env.ICS_GUILD_ID;

    if (!SCGuildId || !ICSGuildId) {
      console.error('GUILD_ID is not set');
      return res.status(500).send('Internal Server Error');
    }

    // ユーザーのギルド情報を取得
    const guildResponse = await axios.get<DiscordGuild[]>('https://discord.com/api/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    // 特定のギルドに参加しているか確認
    let isSCMember = false;
    let isICSMember = false;
    let nickName = null;

    if (guildResponse.data) {
      isSCMember = guildResponse.data.some(guild => guild.id === SCGuildId);
      isICSMember = guildResponse.data.some(guild => guild.id === ICSGuildId);

//       // もしメンバーだったら、ニックネームも取得
//       if (isMember) {
//         const memberResponse = await axios.get<DiscordGuildMember>(`https://discord.com/api/guilds/${SCGuildId}/members/${userId}`, {
//           headers: {
//             'Authorization': `Bearer ${userToken}`
//           }
//         });
//         nickName = memberResponse.data.nick;
//       }
    }

    return res.status(200).json({
      isSCMember: isSCMember,
      isICSMember: isICSMember,
      userName,
      userId
    });
  } catch (error) {
    console.error('Authentication failed:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
});
