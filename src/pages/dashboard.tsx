// src/pages/dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';  // useRouter をインポート
import Link from "next/link";

interface AuthData {
  isSCMember: boolean;
  isICSMember: boolean;
  userName: string;
  userId: string;
}

interface MinecraftId {
  name: string;
}

export default function Dashboard() {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [minecraftId, setMinecraftId] = useState<MinecraftId | null>(null);

  const router = useRouter();  // useRouter を使ってクエリパラメータを取得
  const { code } = router.query;  // クエリパラメータから code を取得

  useEffect(() => {
    if (!code) {
      return;
    }

    // APIを非同期で叩く
    fetch(`/api/auth?code=${code}`)  // クエリパラメータを付与
      .then(response => response.json())
      .then(data => setAuthData(data))
      .catch(err => {
        console.error(err);
      });
  }, [code]);  // code の値が変更された場合のみ、この useEffect が実行される

  if (!authData) {
    return <div>Loading...</div>; // 認証チェック中
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Is SC member: {authData.isSCMember ? 'Yes' : 'No'}</p>
      <p>Is ICS member: {authData.isICSMember ? 'Yes' : 'No'}</p>
      <p>User Name: {authData.userName}</p>
      <p>User ID: {authData.userId}</p>
      <form>
        <p>
          Discordアカウントとminecraft idを紐付け<br/>
          登録したMinecraft idががサーバのホワイトリストに登録されます。
        </p>
        <input placeholder="Minecraft Id"/>
        <button disabled>登録(未実装)</button>
      </form>
      <p>User id が空の場合<Link href='/'>認証</Link>からやり直してね（サボり）</p>
    </div>
  );
};
