"""Scrape gorealtors.in project pages and emit a clean, structured seed JSON."""
import re, html, json, os, urllib.request, concurrent.futures as cf

SLUGS = json.load(open(os.path.join(os.path.dirname(__file__), 'projects.json')))
SLUGS = [p['slug'] for p in SLUGS]
IMAGES = json.load(open(os.path.join(os.path.dirname(__file__), 'images.json')))


def plain(h):
    h = re.sub(r'<(script|style|noscript)[^>]*>.*?</\1>', ' ', h, flags=re.S | re.I)
    h = re.sub(r'<br\s*/?>|</(p|div|li|h\d)>', ' \n ', h, flags=re.I)
    h = re.sub(r'<[^>]+>', ' ', h)
    h = html.unescape(h)
    h = h.replace('\u2019', "'").replace('\u2013', '-').replace('\u2014', '-')
    h = re.sub(r'[ \t]+', ' ', h)
    return re.sub(r'\n\s*\n+', '\n', h).strip()


def fetch(slug):
    r = urllib.request.Request('https://gorealtors.in/%s/' % slug,
                               headers={'User-Agent': 'Mozilla/5.0'})
    return urllib.request.urlopen(r, timeout=40).read().decode('utf8', 'ignore')


SECTIONS = ['Key Highlights', 'Amenities', 'Price List & Area', 'Floor Plans', 'Floor Plan',
            'Gallery', 'Why Invest', 'Location Advantage', 'Payment Plan', 'Site Plan',
            'Master Plan', 'Frequently Asked', 'FAQ', 'About ', 'Specifications']


def split_sections(body):
    """Return ordered list of (heading, text)."""
    pat = re.compile('(' + '|'.join(re.escape(s) for s in SECTIONS) + ')')
    marks = [(m.start(), m.group(1)) for m in pat.finditer(body)]
    out = []
    for i, (pos, name) in enumerate(marks):
        end = marks[i + 1][0] if i + 1 < len(marks) else len(body)
        out.append((name, body[pos + len(name):end].strip()))
    return out


def bullets(text, limit=14):
    text = re.sub(r'\bRead More\b', ' ', text)
    text = re.sub(r'\b(Download Brochure|Enquire Now|Price Breakup|On Request)\b', ' ', text)
    parts = re.split(r'(?<=[.!])\s+|\n', text)
    out = []
    for s in parts:
        s = re.sub(r'\s+', ' ', s).strip(' .\u2022-')
        if 12 < len(s) < 165 and not s.lower().startswith(('faq', 'frequently')):
            out.append(s if s.endswith('.') else s + '.')
        if len(out) >= limit:
            break
    return out


def paras(text, limit=4):
    text = re.sub(r'\bRead More\b', ' ', text)
    chunks = re.split(r'\n', text)
    out = []
    for c in chunks:
        c = re.sub(r'\s+', ' ', c).strip()
        if len(c) > 120:
            out.append(c)
        if len(out) >= limit:
            break
    if not out:
        s = re.sub(r'\s+', ' ', text).strip()
        # fall back: break the blob into ~2 sentence-grouped paragraphs
        sents = re.split(r'(?<=[.!])\s+', s)
        buf = ''
        for x in sents:
            buf += (' ' if buf else '') + x
            if len(buf) > 320:
                out.append(buf.strip()); buf = ''
            if len(out) >= limit:
                break
        if buf and len(out) < limit:
            out.append(buf.strip())
    return out


CFG = re.compile(
    r'(?P<bhk>\d(?:\.\d)?\s*BHK|Retail|Shop|SCO|Studio|Office|Food\s*Court|Multiplex|Plot)'
    r'[\s\S]{0,60}?(?P<size>[\d,]{3,7})\s*(?:Size\s*)?\(?\s*Sq\.?\s*(?:Ft|Feet|ft)\)?'
    r'[\s\S]{0,90}?(?:Starting\s*from\s*:?)?\s*(?P<price>(?:\u20b9|Rs\.?)\s?[\d.,]+\s*(?:Cr|Crore|Lakh|Lac|L)\b)',
    re.I)


def configs(text):
    out, seen = [], set()
    for m in CFG.finditer(text):
        bhk = re.sub(r'\s+', ' ', m.group('bhk')).upper().replace('.0', '')
        size = m.group('size').replace(',', '')
        price = re.sub(r'\s+', ' ', m.group('price')).replace('Rs.', '\u20b9').replace('Rs', '\u20b9').strip()
        key = (bhk, size)
        if key in seen or not size.isdigit():
            continue
        seen.add(key)
        out.append({'type': bhk, 'area_sqft': int(size), 'price': price})
    return out


def faqs(body):
    out = []
    tail = body
    i = max(tail.rfind('Frequently Asked'), tail.rfind('FAQ'))
    if i > 0:
        tail = tail[i:]
    # questions end with '?' -> answer runs until next question
    qs = [(m.start(), m.group(0)) for m in re.finditer(r'[A-Z][^?\n]{14,170}\?', tail)]
    for n, (pos, q) in enumerate(qs):
        end = qs[n + 1][0] if n + 1 < len(qs) else min(len(tail), pos + 700)
        a = re.sub(r'\s+', ' ', tail[pos + len(q):end]).strip()
        a = re.sub(r'\b(Read More|Enquire Now|Download Brochure)\b', '', a).strip(' .')
        if len(a) > 25:
            out.append({'q': re.sub(r'\s+', ' ', q).strip(), 'a': a[:520].strip() + '.'})
        if len(out) >= 8:
            break
    return out


def one(slug):
    h = fetch(slug)
    body = plain(h)
    # drop the repeated nav blob at the top
    cut = body.find('Contact Us')
    while cut != -1 and cut < 1600:
        nxt = body.find('Contact Us', cut + 5)
        if nxt == -1 or nxt > 1800:
            break
        cut = nxt
    if cut != -1 and cut < 1800:
        body = body[cut + len('Contact Us'):].strip()

    title = re.search(r'<title>(.*?)</title>', h, re.S)
    title = html.unescape(title.group(1)).strip() if title else slug
    title = re.sub(r'\s*-\s*Welcome to Go Realtors\s*$', '', title)
    meta = re.search(r'name="description" content="([^"]*)"', h)

    secs = split_sections(body)
    get = lambda *names: next((t for n, t in secs if n in names), '')
    pre = body[:secs[0][0] and 0 or 0]
    overview_src = body[:body.find(secs[0][0])] if secs else body

    d = {
        'slug': slug,
        'seo_title': title,
        'seo_description': html.unescape(meta.group(1)) if meta else '',
        'overview': paras(overview_src),
        'highlights': bullets(get('Key Highlights')),
        'amenities': bullets(get('Amenities'), 16),
        'configs': configs(get('Price List & Area') or body),
        'floor_plan_note': ' '.join(paras(get('Floor Plans', 'Floor Plan'), 2))[:600],
        'why_invest': bullets(get('Why Invest'), 8),
        'location_advantages': bullets(get('Location Advantage'), 10),
        'faqs': faqs(body),
        'images': IMAGES.get(slug, []),
    }
    # facts
    acre = re.search(r'([\d.]+)\s*acres?', body, re.I)
    d['land_acres'] = float(acre.group(1)) if acre else None
    tow = re.search(r'(\d{1,3})\s*towers?', body, re.I)
    d['towers'] = int(tow.group(1)) if tow else None
    un = re.search(r'(?:approximately\s*|around\s*|about\s*)?([\d,]{2,6})\s*(?:luxury\s*)?(?:residences|units|apartments)\b', body, re.I)
    d['units'] = int(un.group(1).replace(',', '')) if un else None
    poss = re.search(r'possession[^.]{0,40}?((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4}|\d{4})', body, re.I)
    d['possession'] = poss.group(1).strip() if poss else None
    rera = re.search(r'((?:RC/REP/HARERA|HRERA|DLRERA|GGM)[A-Z0-9/\-]{6,45})', body, re.I)
    d['rera'] = rera.group(1).strip() if rera else None
    return d


if __name__ == '__main__':
    with cf.ThreadPoolExecutor(8) as ex:
        res = list(ex.map(one, SLUGS))
    json.dump(res, open(os.path.join(os.path.dirname(__file__), 'seed.json'), 'w'), indent=1)
    for r in res:
        print('---', r['slug'])
        print('  acres=%s towers=%s units=%s poss=%s rera=%s' % (
            r['land_acres'], r['towers'], r['units'], r['possession'], (r['rera'] or '')[:28]))
        print('  configs=%s' % r['configs'][:4])
        print('  ov=%d hl=%d am=%d loc=%d faq=%d img=%d' % (
            len(r['overview']), len(r['highlights']), len(r['amenities']),
            len(r['location_advantages']), len(r['faqs']), len(r['images'])))
