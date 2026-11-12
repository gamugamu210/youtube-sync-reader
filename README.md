# ミッドのサイド運用：日本語同期リーダー

個人視聴用。YouTubeの公式埋め込みと時間付き日本語訳を並べる静的ページです。動画・音声そのものは含みません。

- 公開URL: https://gamugamu210.github.io/youtube-sync-reader/
- 元動画: https://www.youtube.com/watch?v=uDsYK5LNRTw
- 投稿者: 쭌베
- 日本語訳: 韓国語の音声を faster-whisper large-v3-turbo で文字起こしし、AIで翻訳。言い直しを整理した211区間。画面・固有名詞の一部は未検証です。
- 本体: C:\Users\snofr\orca\projects\youtube-sync-reader

## 使用方法

スマホのSafari/Chromeで公開URLを開き、動画をタップして再生。日本語訳が動画の再生位置に追従します。訳・章を選ぶと動画をシークします。自動追従を解除すると訳を読み返せます。横向きでは左右配置です。

YouTubeの全画面・アプリでは外部の日本語訳は表示されません。このページ内で再生してください。埋め込み制限・通信不良時は元動画リンクと手動同期を使えます。手動同期はYouTubeアプリを制御せず、広告や停止には自動追従しません。

視聴位置はブラウザーのlocalStorageに保存します。ログイン・独自のサーバー・アクセス解析・APIキーはありません。YouTubeの読み込みではGoogleへ、ページの配信ではGitHubへ通常のアクセス情報が送信されます。noindex指定ですがアクセス制限はなく、リポジトリとページは公開です。

## 構成

- index.html: レスポンシブ表示（glowの配色・文字・部品を使用）
- data.js: 動画メタ情報・章・日本語訳
- app.js: YouTube IFrame API連携、シーク、再開位置、手動同期
- test.cjs: DOMを模した環境で、全時刻の区間選択と巻き戻し等を検証

## 確認

```
node --check app.js
node --check data.js
node test.cjs
```

ブラウザー実機での再生可否は動画側の埋め込み設定や端末の制限に左右されます。訳は非公式で、動画作者による監修・承認を示すものではありません。
