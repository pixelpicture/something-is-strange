import pathlib, struct, sys

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'creative-proof')
expected = {
    f'{base}-{phase}.png'
    for base in ('shadow', 'mirror', 'domino')
    for phase in ('start', 'anomaly', 'reveal')
}
files = {p.name: p for p in root.glob('*.png')}
missing = sorted(expected - files.keys())
extra = sorted(files.keys() - expected)
if missing or extra:
    raise SystemExit(f'9-frame creative set mismatch; missing={missing}, extra={extra}')

for name in sorted(expected):
    path = files[name]
    data = path.read_bytes()
    if len(data) < 24 or data[:8] != b'\x89PNG\r\n\x1a\n':
        raise SystemExit(f'{name}: invalid PNG')
    w, h = struct.unpack('>II', data[16:24])
    if (w, h) != (540, 960):
        raise SystemExit(f'{name}: wrong size {(w, h)}')
    if len(data) < 20_000:
        raise SystemExit(f'{name}: suspiciously small ({len(data)} bytes)')
    print(f'PASS {name}: {w}x{h}, {len(data)} bytes')
