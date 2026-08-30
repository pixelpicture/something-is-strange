import pathlib, struct, sys, zlib

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'proof')
bases = [
    'shadow','extra-shadow','light-switch','reverse-splash','color-theft',
    'door-two-rooms','wrong-mirror','haircut-mirror','wrong-occlusion','domino-break'
]
required = {f'{base}-{state}.png' for base in bases for state in ('watch','answer','reveal')}
files = sorted(root.glob('*.png'))
if {p.name for p in files} != required:
    missing = sorted(required - {p.name for p in files})
    extra = sorted({p.name for p in files} - required)
    raise SystemExit(f'30-frame set mismatch; missing={missing}, extra={extra}')

def paeth(a,b,c):
    p=a+b-c; pa=abs(p-a); pb=abs(p-b); pc=abs(p-c)
    return a if pa <= pb and pa <= pc else b if pb <= pc else c

def decode_png(path):
    data = path.read_bytes()
    if len(data) < 29 or data[:8] != b'\x89PNG\r\n\x1a\n': raise SystemExit(f'{path}: invalid PNG')
    w,h,bit_depth,color_type,_,_,interlace = struct.unpack('>IIBBBBB', data[16:29])
    if (w,h) != (412,915): raise SystemExit(f'{path}: wrong size {(w,h)}')
    if (bit_depth,color_type,interlace) != (8,2,0): raise SystemExit(f'{path}: unexpected PNG format')
    pos=8; packed=b''
    while pos < len(data):
        n=struct.unpack('>I', data[pos:pos+4])[0]; kind=data[pos+4:pos+8]; chunk=data[pos+8:pos+8+n]
        if kind == b'IDAT': packed += chunk
        pos += n + 12
        if kind == b'IEND': break
    raw=zlib.decompress(packed); bpp=3; stride=w*bpp; rows=[]; prev=bytearray(stride); off=0
    for _ in range(h):
        ft=raw[off]; off += 1; scan=raw[off:off+stride]; off += stride; out=bytearray(stride)
        for x,v in enumerate(scan):
            a=out[x-bpp] if x>=bpp else 0; b=prev[x]; c=prev[x-bpp] if x>=bpp else 0
            if ft==0: val=v
            elif ft==1: val=(v+a)&255
            elif ft==2: val=(v+b)&255
            elif ft==3: val=(v+((a+b)//2))&255
            elif ft==4: val=(v+paeth(a,b,c))&255
            else: raise SystemExit(f'{path}: unsupported PNG filter {ft}')
            out[x]=val
        rows.append(out); prev=out
    return rows

def change_ratio(a,b,y0=60,y1=850,x0=12,x1=400):
    ra,rb=decode_png(a),decode_png(b)
    changed=total=0
    for y in range(y0,y1):
        for x in range(x0,x1):
            i=x*3
            d=(abs(ra[y][i]-rb[y][i])+abs(ra[y][i+1]-rb[y][i+1])+abs(ra[y][i+2]-rb[y][i+2]))/3
            total += 1
            if d > 8: changed += 1
    return changed/total

for path in files:
    if len(path.read_bytes()) < 10_000: raise SystemExit(f'{path}: suspiciously small')

for base in bases:
    watch=root/f'{base}-watch.png'; answer=root/f'{base}-answer.png'; reveal=root/f'{base}-reveal.png'
    answer_ratio=change_ratio(watch,answer)
    reveal_ratio=change_ratio(answer,reveal)
    if answer_ratio < 0.002: raise SystemExit(f'{base}: WATCH→TAP NOW visually static ({answer_ratio:.5f})')
    if reveal_ratio < 0.004: raise SystemExit(f'{base}: answer→reveal visually static ({reveal_ratio:.5f})')
    print(f'PASS {base}: watch_to_answer={answer_ratio:.4f}, answer_to_reveal={reveal_ratio:.4f}')

print('PASS: 30 V3 phone frames; all 10 levels visibly transition WATCH → TAP NOW → reveal.')
