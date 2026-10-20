/* Қазақша карта мен аудиогид. Тарихи мәтіндер: assets/audio/transcripts.json. */
(() => {
  const player = document.getElementById('audio-player');
  const play = document.getElementById('audio-play');
  const seek = document.getElementById('audio-seek');
  const status = document.getElementById('audio-status');
  const trackButtons = [...document.querySelectorAll('[data-audio-track]')];
  const speed = document.getElementById('audio-speed');
  let current = 0;
  let tracks = [];
  let requestVersion = 0;
  const clock = seconds => `${Math.floor((seconds || 0) / 60)}:${String(Math.floor((seconds || 0) % 60)).padStart(2, '0')}`;
  function refreshProgress() {
    const duration = Number.isFinite(player.duration) ? player.duration : tracks[current]?.durationSeconds || 0;
    seek.max = duration || 1;
    seek.value = Math.min(player.currentTime || 0, duration || 1);
    document.getElementById('audio-time').textContent = `${clock(player.currentTime)} / ${clock(duration)}`;
    seek.setAttribute('aria-valuetext', `${clock(player.currentTime)}, барлығы ${clock(duration)}`);
  }
  function refreshPlayback() {
    play.textContent = player.paused ? '▶ Тыңдау' : 'Ⅱ Кідірту';
    play.setAttribute('aria-label', player.paused ? 'Аудиогидті тыңдау' : 'Аудиогидті кідірту');
  }
  function selectTrack(index) {
    if (!tracks[index]) return;
    requestVersion++;
    player.pause();
    current = index;
    const track = tracks[index];
    player.src = `assets/audio/${track.id}.mp3`;
    player.load();
    player.playbackRate = Number(speed.value);
    trackButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(index === i)));
    document.getElementById('audio-title').textContent = track.title;
    document.getElementById('audio-transcript').textContent = track.text;
    document.getElementById('audio-source').href = track.source;
    const download = document.getElementById('audio-download');
    download.href = player.getAttribute('src');
    download.download = `shymqala-${track.id}-kk.mp3`;
    document.getElementById('audio-prev').disabled = index === 0;
    document.getElementById('audio-next').disabled = index === tracks.length - 1;
    status.textContent = `${index + 1} / ${tracks.length} · Тыңдауға дайын`;
    refreshPlayback();
    refreshProgress();
  }
  function choose(index) {
    if (!tracks[index]) return;
    document.querySelectorAll('.guide-step')[index]?.click();
    if (current !== index) selectTrack(index);
  }
  play.addEventListener('click', async () => {
    if (!player.paused) { player.pause(); return; }
    const version = requestVersion;
    try {
      if (player.ended) player.currentTime = 0;
      await player.play();
      if (version === requestVersion) status.textContent = 'Аудиогид ойнатылып жатыр';
    } catch (error) {
      if (version === requestVersion && error.name !== 'AbortError') status.textContent = 'Дыбысты ашу мүмкін болмады. Қайта басыңыз немесе MP3 файлын жүктеңіз.';
    }
  });
  trackButtons.forEach((button, index) => button.addEventListener('click', () => choose(index)));
  document.getElementById('audio-prev').addEventListener('click', () => choose(current - 1));
  document.getElementById('audio-next').addEventListener('click', () => choose(current + 1));
  seek.addEventListener('input', () => {
    if (Number.isFinite(player.duration)) player.currentTime = Number(seek.value);
    refreshProgress();
  });
  speed.addEventListener('change', () => { player.playbackRate = Number(speed.value); });
  player.addEventListener('loadedmetadata', refreshProgress);
  player.addEventListener('timeupdate', refreshProgress);
  player.addEventListener('play', refreshPlayback);
  player.addEventListener('pause', () => { refreshPlayback(); if (!player.ended) status.textContent = 'Аудиогид кідіртілді'; });
  player.addEventListener('ended', () => { refreshPlayback(); status.textContent = 'Бұл бөлім аяқталды. Келесі тақырыпты таңдаңыз.'; });
  player.addEventListener('error', () => { status.textContent = 'Аудио жүктелмеді. Мәтіндік нұсқаны оқуға немесе MP3 сілтемесін ашуға болады.'; });
  window.addEventListener('shymqala:guidechange', event => {
    if (event.detail.index !== current) selectTrack(event.detail.index);
  });
  fetch('assets/audio/transcripts.json')
    .then(response => { if (!response.ok) throw new Error('transcripts'); return response.json(); })
    .then(data => {
      tracks = data.tracks;
      const selected = [...document.querySelectorAll('.guide-step')].findIndex(button => button.getAttribute('aria-selected') === 'true');
      selectTrack(Math.max(selected, 0));
      play.disabled = false;
      trackButtons.forEach(button => { button.disabled = false; });
      speed.disabled = false;
      seek.disabled = false;
    })
    .catch(() => { status.textContent = 'Аудио тізімі ашылмады. Төмендегі MP3 файлдарын тікелей тыңдауға болады.'; });

})();
