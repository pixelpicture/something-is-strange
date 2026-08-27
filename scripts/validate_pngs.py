import pathlib, struct, sys

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'proof')
files = sorted(root.glob('*.png'))
if len(files) != 9:
    raise SystemExit(f'expected 9 screenshots, found {len(files)}')

required = {
    'shadow-normal.png', 'shadow-wrong.png', 'shadow-reveal.png',
    'mirror-normal.png', 'mirror-wrong.png', 'mirror-reveal.png',
    'domino-normal.png', 'domino-wrong.png', 'domino-reveal.png',
}
if {p.name for p in files} != required:
    raise SystemExit('phone proof screenshot set is incomplete')

for path in files:
    data = path.read_bytes()
    if len(data) < 24 or data[:8] != b'\x89PNG\r\n\x1a\n':
        raise SystemExit(f'{path}: invalid PNG')
    w, h = struct.unpack('>II', data[16:24])
    if (w, h) != (412, 915):
        raise SystemExit(f'{path}: wrong size {(w, h)}')
    if len(data) < 10_000:
        raise SystemExit(f'{path}: suspiciously small ({len(data)} bytes)')
    print(f'PASS {path.name}: {w}x{h}, {len(data)} bytes')
