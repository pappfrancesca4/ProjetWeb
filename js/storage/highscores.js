const KEY = "NEON_LAB_HIGHSCORES";

export function getHighScores() {
  const stored = localStorage.getItem(KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function saveHighScore(name, score) {
  let scores = getHighScores();

  if (!name || name.trim() === "") name = "UNK";
  name = name.substring(0, 3).toUpperCase();

  scores.push({ name, score, date: new Date().toLocaleDateString() });

  scores.sort((a, b) => b.score - a.score);

  scores = scores.slice(0, 10);

  localStorage.setItem(KEY, JSON.stringify(scores));
}

export function isHighScore(score) {
  const scores = getHighScores();
  if (scores.length < 10) return true;
  return score > scores[scores.length - 1].score;
}
