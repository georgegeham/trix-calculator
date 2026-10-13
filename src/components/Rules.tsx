export function Rules() {
  return (
    <details className="rules">
      <summary>House rules</summary>
      <ul>
        <li><b>Trix</b> is scored by finishing order: 1st +200, 2nd +150, 3rd +100, 4th +50. If 1st place finishes on a jack, they score +400. Trix is always played alone.</li>
        <li><b>Diamonds</b>: −10 for each diamond taken (13 in the deck).</li>
        <li><b>King of hearts</b>: −75 to whoever takes it. Doubled: the taker gets −150 and the doubler +75, unless the doubler takes it themselves.</li>
        <li><b>Queens</b>: −25 per queen. Doubled: the taker gets −50 and the doubler +25, unless the doubler takes it themselves.</li>
        <li><b>Lutoosh</b>: −10 for each trick taken (13 tricks).</li>
        <li>A kingdom is five games. The captain can combine any of the four penalty games in one round. Four kingdoms make a game.</li>
        <li>Double a card and take it yourself, and the table reads out a proverb at your expense.</li>
      </ul>
    </details>
  );
}
