// QR dekoratif (placeholder). Ganti dengan pustaka QR sungguhan
// (mis. qrcode.react) ketika backend sudah mengirim payload tiket.
function bitsFor(seed, size) {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  const grid = []
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      h = Math.imul(h ^ (x * 31 + y * 17 + 7), 2654435761)
      row.push(((h >>> 13) & 3) !== 0 ? (h >>> 7) & 1 : 0)
    }
    grid.push(row)
  }
  return grid
}

function inFinder(x, y, size) {
  const zones = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ]
  return zones.some(([zx, zy]) => x >= zx - 1 && x <= zx + 7 && y >= zy - 1 && y <= zy + 7)
}

export default function QrCode({ value = 'TIXORA', className = 'qr' }) {
  const size = 21
  const grid = bitsFor(value, size)
  const rects = []
  grid.forEach((row, y) =>
    row.forEach((bit, x) => {
      if (bit && !inFinder(x, y, size)) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)
    }),
  )
  const finder = ([x, y]) => (
    <g key={`${x}${y}`}>
      <rect x={x} y={y} width="7" height="7" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  )
  return (
    <svg className={className} viewBox={`0 0 ${size} ${size}`} fill="currentColor" role="img" aria-label={`Kode QR ${value}`}>
      {rects}
      {[[0, 0], [size - 7, 0], [0, size - 7]].map(finder)}
    </svg>
  )
}
