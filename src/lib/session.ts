export function getSessionId(): string {
  try {
    const key = 'lp_session_id';
    let s = sessionStorage.getItem(key);
    if (!s) {
      s = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(key, s);
    }
    return s;
  } catch (e) {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
