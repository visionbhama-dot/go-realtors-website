import re,html,json,urllib.request,concurrent.futures as cf
slugs="""hcbs-twin-horizon-sector-102-gurgaon
ss-camasa-sector-90-gurgaon
tulip-monsella-sector-53-gurgaon-premium-3-4-bhk-apartments
the-omaxe-state-sector-19b-dwarka
ss-cendana-sector-83-gurgaon
ss-linden-floors-sector-84-gurgaon
smart-world-one-dxp-sector-113-gurgaon
sobha-aranya-sector-80-gurgaon-luxury-apartments-modern-living
reach-the-bazaria-68-gurgaon-premium-sco-plots-retail-spaces
reach-buzz-114-premium-sco-plots-in-sector-114-gurgaon
mvn-mall-37d-commercial-spaces-on-dwarka-expressway
m3m-altitude-sector-65-gurgaon-luxurious-4-bhk-apartments
indiabulls-estate-and-club-104-gurgaon-luxury-apartments-on-dwarka-expressway
hero-homes-the-palatial-luxurious-apartments-on-dwarka-expressway-gurugram
godrej-vrikshya-gurgaon-luxury-3-4-bhk-homes
elan-the-presidential-gurgaon
conscient-soho-62-gurgaon
central-park-104-gurgaon-premium-apartments-on-dwarka-expressway
bptp-gaia-residences-sector-102-gurgaon-luxury-3-bhk-apartments
aipl-lake-city-sector-103-luxury-apartments-on-dwarka-expressway
aipl-joy-district-gurgaon""".split()
def txt(s):
    s=re.sub(r'<(script|style|noscript)[^>]*>.*?</\1>','',s,flags=re.S|re.I)
    s=re.sub(r'<[^>]+>',' ',s); return re.sub(r'\s+',' ',html.unescape(s)).strip()
def grab(sl):
    try:
        r=urllib.request.Request('https://gorealtors.in/%s/'%sl,headers={'User-Agent':'Mozilla/5.0'})
        h=urllib.request.urlopen(r,timeout=30).read().decode('utf8','ignore')
    except Exception as e: return {'slug':sl,'err':str(e)}
    d={'slug':sl}
    m=re.search(r'<title>(.*?)</title>',h,re.S); d['title']=html.unescape(m.group(1)).strip() if m else ''
    m=re.search(r'name="description" content="([^"]*)"',h); d['meta']=html.unescape(m.group(1)) if m else ''
    body=txt(h)
    d['body']=body[:6000]
    # prices like Rs 1.5 Cr / ₹
    d['prices']=list(dict.fromkeys(re.findall(r'(?:₹|Rs\.?\s?|INR\s?)\s?[\d.,]+\s?(?:Cr|Crore|Lakh|Lac|L)\b',body,re.I)))[:12]
    d['areas']=list(dict.fromkeys(re.findall(r'[\d,.]+\s?(?:sq\.?\s?ft|sqft|sq\.?\s?yd|acres?)\b',body,re.I)))[:12]
    d['bhk']=list(dict.fromkeys(re.findall(r'\d\s?(?:\.\d)?\s?BHK',body,re.I)))[:10]
    d['rera']=list(dict.fromkeys(re.findall(r'(?:RERA[^.;]{0,60})',body,re.I)))[:4]
    imgs=re.findall(r'(?:src|data-src|data-lazy-src)="(https://gorealtors\.in/wp-content/uploads/[^"]+\.(?:jpg|jpeg|png|webp))"',h,re.I)
    d['images']=list(dict.fromkeys(imgs))[:25]
    return d
with cf.ThreadPoolExecutor(10) as ex: out=list(ex.map(grab,slugs))
json.dump(out,open('projects.json','w'),indent=1)
for d in out:
    print('---',d['slug'])
    print(' title:',d.get('title','')[:110])
    print(' price:',d.get('prices'))
    print(' bhk:',d.get('bhk'),'| areas:',d.get('areas')[:6] if d.get('areas') else [])
    print(' imgs:',len(d.get('images',[])))
