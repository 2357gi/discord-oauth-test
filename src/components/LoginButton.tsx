// src/components/LoginButton.tsx
import React from 'react';

const LoginButton: React.FC = () => {
  const clientId: string = '1164915702059245598';
  const redirectUri: string = 'http://localhost:3000/dashboard';
  const scope: string = 'identify guilds';  // この部分は環境変数にしてもよい


  const encodedRedirectUri = encodeURIComponent(redirectUri);
  const encodedScope = encodeURIComponent(scope);

  const DISCORD_OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=${encodedScope}`;

  console.log(DISCORD_OAUTH_URL)
  const handleLogin = () => {
    // OAuth2 URLにリダイレクト
    window.location.href = DISCORD_OAUTH_URL;
  };

  return (
    <button onClick={handleLogin}>
      Discordでログイン
    </button>
  );
};

export default LoginButton;
