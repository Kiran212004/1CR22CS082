// Utility to store and retrieve shortcodes in sessionStorage
export function addShortcodeToSession(shortcode: string) {
  const codes = JSON.parse(sessionStorage.getItem('shortcodes') || '[]');
  if (!codes.includes(shortcode)) {
    codes.push(shortcode);
    sessionStorage.setItem('shortcodes', JSON.stringify(codes));
  }
}

export function getShortcodesFromSession(): string[] {
  return JSON.parse(sessionStorage.getItem('shortcodes') || '[]');
}
