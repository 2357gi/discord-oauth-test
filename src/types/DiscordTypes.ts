export interface DiscordGuild {
  id: string;
  name: string;
  // 他のフィールドもあるが、この例では省略
}

export interface DiscordUser {
  id: string;
  username: string;
  // 他のフィールドもあるが、この例では省略
}

export interface DiscordGuildMember {
  user: DiscordUser;
  nick: string; // ギルド内でのニックネーム
  // 他のフィールドもあるが、この例では省略
}
