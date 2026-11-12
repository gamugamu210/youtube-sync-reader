'use strict';
const lesson=window.LESSON,$=id=>document.getElementById(id),fmt=s=>`${Math.floor(s/60).toString().padStart(2,'0')}:${Math.floor(s%60).toString().padStart(2,'0')}`;
const storageKey=`video-ja-${lesson.id}`;
let player,ready=false,active=-1,timer,manualTimer,manualSeconds=0,lastSaved=-1;
let saved=0;try{saved=Math.min(lesson.duration,Math.max(0,Number(localStorage.getItem(storageKey))||0));}catch{}
const hashSeconds=Number(new URLSearchParams(location.hash.slice(1)).get('t'));
const start=Number.isFinite(hashSeconds)&&location.hash.includes('t=')?Math.max(0,Math.min(lesson.duration,hashSeconds)):saved;
function cueIndex(t){let lo=0,hi=lesson.cues.length;while(lo<hi){const mid=(lo+hi)>>>1;if(lesson.cues[mid][0]<=t)lo=mid+1;else hi=mid;}return Math.max(0,lo-1);}
function chapterIndex(t){let n=0;lesson.chapters.forEach((c,i)=>{if(c[0]<=t)n=i;});return n;}
const buttons=lesson.cues.map(([t,text],i)=>{const b=document.createElement('button');b.type='button';b.className='cue';const time=document.createElement('time');time.textContent=fmt(t);const span=document.createElement('span');span.textContent=text;b.append(time,span);b.setAttribute('aria-label',`${fmt(t)} ${text}`);b.onclick=()=>seek(t);$('rows').append(b);return b;});
lesson.chapters.forEach(([t,title])=>{const o=document.createElement('option');o.value=t;o.textContent=`${fmt(t)} ${title}`;$('chapters').append(o);});
function centerActive(){if(active<0)return;const row=buttons[active],list=$('rows');list.scrollTop=Math.max(0,row.offsetTop-list.offsetTop-list.clientHeight/2+row.clientHeight/2);}
function render(t){t=Math.min(lesson.duration,Math.max(0,t));$('clock').textContent=fmt(t);$('original').href=`https://www.youtube.com/watch?v=${lesson.id}&t=${Math.floor(t)}s`;const i=cueIndex(t);if(i!==active){if(active>=0)buttons[active].removeAttribute('aria-current');active=i;buttons[i].setAttribute('aria-current','true');$('currentText').textContent=lesson.cues[i][1];if($('follow').checked)centerActive();}const c=chapterIndex(t);$('chapterNow').textContent=lesson.chapters[c][1];if(document.activeElement!==$('chapters'))$('chapters').value=lesson.chapters[c][0];if(Math.abs(t-lastSaved)>=5){try{localStorage.setItem(storageKey,String(Math.floor(t)));lastSaved=t;}catch{}}}
function status(text,error=false){$('status').textContent=text;$('status').classList.toggle('error',error);}
function seek(t){t=Math.max(0,Math.min(lesson.duration,t));if(manualTimer){manualSeconds=t;render(t);return;}if(!ready){status('動画の準備ができてから、もう一度タップしてください。');return;}player.seekTo(t,true);render(t);player.playVideo();}
$('chapters').onchange=e=>seek(Number(e.target.value));$('follow').onchange=()=>{if($('follow').checked)centerActive();};
$('back').onclick=()=>seek(player.getCurrentTime()-10);$('forward').onclick=()=>seek(player.getCurrentTime()+10);$('play').onclick=()=>{if(!ready)return;player.getPlayerState()===1?player.pauseVideo():player.playVideo();};
function stopManual(){clearInterval(manualTimer);manualTimer=null;}
$('manualStart').onclick=()=>{const m=/^(\d{1,2}):([0-5]\d)$/.exec($('manualTime').value.trim());if(!m){status('手動時刻は 06:19 のように入力してください。',true);return;}stopManual();if(ready)player.pauseVideo();manualSeconds=Math.min(lesson.duration,Number(m[1])*60+Number(m[2]));render(manualSeconds);manualTimer=setInterval(()=>{manualSeconds+=0.25;render(manualSeconds);if(manualSeconds>=lesson.duration)stopManual();},250);status('手動同期中：YouTubeの動画と時刻を合わせてください。');};$('manualStop').onclick=()=>{stopManual();status('手動同期を停止しました。');};
window.onYouTubeIframeAPIReady=()=>{player=new YT.Player('player',{host:'https://www.youtube-nocookie.com',videoId:lesson.id,playerVars:{playsinline:1,rel:0,start:Math.floor(start),origin:location.origin},events:{onReady:()=>{ready=true;clearTimeout(timer);for(const id of ['back','play','forward'])$(id).disabled=false;status(start>0?`${fmt(start)}から再開できます。動画をタップして再生してください。`:'動画をタップして再生してください。');render(start);},onStateChange:e=>{if(e.data===1){stopManual();status('動画の再生位置と同期中');$('play').textContent='一時停止';}else{$('play').textContent='再生';if(e.data===2)status('一時停止中');if(e.data===0)status('再生が終了しました。');}},onError:e=>{status(`YouTubeを再生できません（${e.data}）。下の「再生できない場合」を開いてください。`,true);}}});};
const api=document.createElement('script');api.src='https://www.youtube.com/iframe_api';api.onerror=()=>status('YouTubeを読み込めません。通信状況を確認するか、下の案内を開いてください。',true);document.head.append(api);
timer=setTimeout(()=>{if(!ready)status('YouTubeの読み込みに時間がかかっています。下の「再生できない場合」を確認してください。',true);},15000);
setInterval(()=>{if(ready&&!manualTimer){const t=player.getCurrentTime();if(Number.isFinite(t)&&player.getPlayerState()!==-1)render(t);}},250);
render(start);
