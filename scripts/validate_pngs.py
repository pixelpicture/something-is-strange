import pathlib, struct, sys

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'proof')
files = sorted(root.glob('*.png'))
if len(files) != 6:
    raise SystemExit(f'expected 6 screenshots, found {len(files)}')

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
