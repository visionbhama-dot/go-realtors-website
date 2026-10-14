"""Merge parsed page content with a curated fact overlay -> src/data/projects.generated.ts"""
import json, re, os

HERE = os.path.dirname(__file__)
PARSED = {p['slug']: p for p in json.load(open(os.path.join(HERE, 'seed.json')))}

# Curated overlay. Every value here was verified against the live gorealtors.in pages.
OVERLAY = {
 'godrej-vrikshya-gurgaon-luxury-3-4-bhk-homes': dict(
    name='Godrej Vrikshya', developer='Godrej Properties', sector='Sector 103', locality='Dwarka Expressway',
    category='residential', ptype='Apartment', status='under-construction', configs_label='3 & 4 BHK',
    featured=True, trending=True, tagline='Eco-luxury residences wrapped around 800+ mature trees'),
 'tulip-monsella-sector-53-gurgaon-premium-3-4-bhk-apartments': dict(
    name='Tulip Monsella', developer='Tulip Infratech', sector='Sector 53', locality='Golf Course Road',
    category='residential', ptype='Apartment', status='under-construction', configs_label='3, 4 & 5 BHK',
    featured=True, trending=True, tagline='Ultra-luxury towers on Golf Course Road'),
 'm3m-altitude-sector-65-gurgaon-luxurious-4-bhk-apartments': dict(
    name='M3M Altitude', developer='M3M India', sector='Sector 65', locality='Golf Course Extension Road',
    category='residential', ptype='Apartment', status='under-construction', configs_label='4 BHK',
    featured=True, trending=True, tagline='Sky residences above Golf Course Extension Road'),
 'smart-world-one-dxp-sector-113-gurgaon': dict(
    name='Smart World One DXP', developer='Smartworld Developers', sector='Sector 113', locality='Dwarka Expressway',
    category='residential', ptype='Apartment', status='under-construction', configs_label='2, 3 & 4 BHK',
    featured=True, trending=True, tagline='Low-density living minutes from IGI Airport'),
 'sobha-aranya-sector-80-gurgaon-luxury-apartments-modern-living': dict(
    name='Sobha Aranya', developer='Sobha Limited', sector='Sector 80', locality='New Gurgaon',
    category='residential', ptype='Apartment', status='under-construction', configs_label='3 & 4 BHK',
    featured=True, trending=True, tagline='Forest-themed luxury by Sobha'),
 'elan-the-presidential-gurgaon': dict(
    name='Elan The Presidential', developer='Elan Group', sector='Sector 106', locality='Dwarka Expressway',
    category='residential', ptype='Apartment', status='under-construction', configs_label='3, 4 & 5 BHK',
    featured=True, trending=True, tagline='Resort-style high rises on Dwarka Expressway'),
 'hero-homes-the-palatial-luxurious-apartments-on-dwarka-expressway-gurugram': dict(
    name='Hero Homes The Palatial', developer='Hero Realty', sector='Sector 104', locality='Dwarka Expressway',
    category='residential', ptype='Apartment', status='under-construction', configs_label='3, 4 & 5 BHK',
    featured=True, tagline='Palatial homes with panoramic green views'),
 'indiabulls-estate-and-club-104-gurgaon-luxury-apartments-on-dwarka-expressway': dict(
    name='Indiabulls Estate & Club 104', developer='Indiabulls Real Estate', sector='Sector 104', locality='Dwarka Expressway',
    category='residential', ptype='Apartment', status='under-construction', configs_label='3 & 4 BHK',
    tagline='Club-centric living on the Expressway'),
 'ss-camasa-sector-90-gurgaon': dict(
    name='SS Camasa', developer='SS Group', sector='Sector 90', locality='New Gurgaon',
    category='residential', ptype='Apartment', status='new-launch', configs_label='4 BHK',
    featured=True, tagline='Spacious 4 BHK homes with a grand clubhouse'),
 'ss-cendana-sector-83-gurgaon': dict(
    name='SS Cendana', developer='SS Group', sector='Sector 83', locality='New Gurgaon',
    category='residential', ptype='Apartment', status='under-construction', configs_label='3 BHK',
    trending=True, tagline='Smartly priced 3 BHK residences in New Gurgaon'),
 'ss-linden-floors-sector-84-gurgaon': dict(
    name='SS Linden Floors', developer='SS Group', sector='Sector 84', locality='New Gurgaon',
    category='residential', ptype='Independent Floor', status='under-construction', configs_label='4 & 5 BHK',
    tagline='Low-rise independent floors in a 27-acre township'),
 'hcbs-twin-horizon-sector-102-gurgaon': dict(
    name='HCBS Twin Horizon', developer='HCBS Developments', sector='Sector 102', locality='Dwarka Expressway',
    category='residential', ptype='Apartment', status='under-construction', configs_label='3 & 4 BHK',
    tagline='Twin towers with uninterrupted skyline views'),
 'bptp-gaia-residences-sector-102-gurgaon-luxury-3-bhk-apartments': dict(
    name='BPTP Gaia Residences', developer='BPTP Limited', sector='Sector 102', locality='Dwarka Expressway',
    category='residential', ptype='Apartment', status='under-construction', configs_label='3 BHK',
    trending=True, tagline='Nature-inspired 3 BHK residences'),
 'central-park-104-gurgaon-premium-apartments-on-dwarka-expressway': dict(
    name='Central Park 104', developer='Central Park', sector='Sector 104', locality='Dwarka Expressway',
    category='residential', ptype='Apartment', status='under-construction', configs_label='3 & 4 BHK',
    tagline='Serviced luxury apartments with hotel-grade amenities'),
 'aipl-lake-city-sector-103-luxury-apartments-on-dwarka-expressway': dict(
    name='AIPL Lake City', developer='Advance India Projects Limited', sector='Sector 103', locality='Dwarka Expressway',
    category='residential', ptype='Apartment', status='new-launch', configs_label='2, 3 & 4 BHK',
    featured=True, tagline='Lakefront-themed new launch on Dwarka Expressway'),
 'aipl-joy-district-gurgaon': dict(
    name='AIPL Joy District', developer='Advance India Projects Limited', sector='Sector 88', locality='New Gurgaon',
    category='commercial', ptype='Retail & Office', status='under-construction', configs_label='Retail, Office & Food Court',
    featured=True, trending=True, tagline='High-street retail and offices on a 10-acre district'),
 'conscient-soho-62-gurgaon': dict(
    name='Conscient SOHO 62', developer='Conscient Infrastructure', sector='Sector 62', locality='Golf Course Extension Road',
    category='commercial', ptype='Retail & Office', status='under-construction', configs_label='Retail, SOHO & Office',
    tagline='Small-office home-office formats on Golf Course Extension'),
 'mvn-mall-37d-commercial-spaces-on-dwarka-expressway': dict(
    name='MVN Mall 37D', developer='MVN Group', sector='Sector 37D', locality='Dwarka Expressway',
    category='commercial', ptype='Mall & Retail', status='under-construction', configs_label='Retail & Multiplex',
    tagline='Anchor mall inside a 28-acre mixed-use township'),
 'reach-the-bazaria-68-gurgaon-premium-sco-plots-retail-spaces': dict(
    name='Reach The Bazaria 68', developer='Reach Group', sector='Sector 68', locality='Sohna Road',
    category='commercial', ptype='SCO Plots', status='under-construction', configs_label='SCO Plots & Retail',
    tagline='Freehold SCO plots on Sohna Road'),
 'reach-buzz-114-premium-sco-plots-in-sector-114-gurgaon': dict(
    name='Reach Buzz 114', developer='Reach Group', sector='Sector 114', locality='Dwarka Expressway',
    category='commercial', ptype='SCO Plots', status='new-launch', configs_label='SCO Plots & Retail',
    trending=True, tagline='SCO plots at the Delhi gateway of Dwarka Expressway'),
 'the-omaxe-state-sector-19b-dwarka': dict(
    name='The Omaxe State', developer='Omaxe Limited', sector='Sector 19B', locality='Dwarka, New Delhi',
    category='commercial', ptype='Retail & Sports Complex', status='under-construction', configs_label='Retail, Shops & Food Court',
    featured=True, tagline="Delhi's sports-led retail destination"),
}

UNIT = {'cr': 1e7, 'crore': 1e7, 'lakh': 1e5, 'lac': 1e5, 'l': 1e5}


def to_num(price):
    m = re.search(r'([\d.]+)\s*(Cr|Crore|Lakh|Lac|L)\b', price or '', re.I)
    if not m:
        return None
    return int(float(m.group(1)) * UNIT[m.group(2).lower()])


def ts(v, ind=0):
    pad = '  ' * ind
    if v is None:
        return 'null'
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if isinstance(v, (int, float)):
        return repr(v)
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    if isinstance(v, list):
        if not v:
            return '[]'
        items = ',\n'.join(pad + '  ' + ts(x, ind + 1) for x in v)
        return '[\n' + items + ',\n' + pad + ']'
    if isinstance(v, dict):
        items = ',\n'.join(pad + '  ' + k + ': ' + ts(x, ind + 1) for k, x in v.items())
        return '{\n' + items + ',\n' + pad + '}'
    raise TypeError(v)


SHORT = {  # short url slug -> keeps links clean and SEO-friendly
 'tulip-monsella-sector-53-gurgaon-premium-3-4-bhk-apartments': 'tulip-monsella-sector-53-gurgaon',
 'sobha-aranya-sector-80-gurgaon-luxury-apartments-modern-living': 'sobha-aranya-sector-80-gurgaon',
 'reach-the-bazaria-68-gurgaon-premium-sco-plots-retail-spaces': 'reach-the-bazaria-68-gurgaon',
 'reach-buzz-114-premium-sco-plots-in-sector-114-gurgaon': 'reach-buzz-114-sector-114-gurgaon',
 'mvn-mall-37d-commercial-spaces-on-dwarka-expressway': 'mvn-mall-37d-gurgaon',
 'm3m-altitude-sector-65-gurgaon-luxurious-4-bhk-apartments': 'm3m-altitude-sector-65-gurgaon',
 'indiabulls-estate-and-club-104-gurgaon-luxury-apartments-on-dwarka-expressway': 'indiabulls-estate-and-club-104-gurgaon',
 'hero-homes-the-palatial-luxurious-apartments-on-dwarka-expressway-gurugram': 'hero-homes-the-palatial-gurgaon',
 'godrej-vrikshya-gurgaon-luxury-3-4-bhk-homes': 'godrej-vrikshya-sector-103-gurgaon',
 'bptp-gaia-residences-sector-102-gurgaon-luxury-3-bhk-apartments': 'bptp-gaia-residences-sector-102-gurgaon',
 'aipl-lake-city-sector-103-luxury-apartments-on-dwarka-expressway': 'aipl-lake-city-sector-103-gurgaon',
 'central-park-104-gurgaon-premium-apartments-on-dwarka-expressway': 'central-park-104-gurgaon',
}

rows = []
for slug, ov in OVERLAY.items():
    p = PARSED[slug]
    cfgs = p['configs']
    prices = [to_num(c['price']) for c in cfgs if to_num(c['price'])]
    rec = {
        'slug': SHORT.get(slug, slug),
        'legacySlug': slug,
        'name': ov['name'],
        'tagline': ov['tagline'],
        'developer': ov['developer'],
        'sector': ov['sector'],
        'locality': ov['locality'],
        'city': 'Gurugram' if 'Delhi' not in ov['locality'] else 'New Delhi',
        'category': ov['category'],
        'propertyType': ov['ptype'],
        'status': ov['status'],
        'configurationsLabel': ov['configs_label'],
        'featured': bool(ov.get('featured')),
        'trending': bool(ov.get('trending')),
        'priceMin': min(prices) if prices else None,
        'priceMax': max(prices) if prices else None,
        'landAcres': p['land_acres'],
        'towers': p['towers'],
        'units': p['units'],
        'possession': p['possession'],
        'rera': p['rera'],
        'overview': p['overview'],
        'highlights': p['highlights'],
        'amenities': p['amenities'],
        'configurations': [
            {'type': c['type'].replace('BHK', 'BHK'), 'areaSqft': c['area_sqft'], 'price': c['price']}
            for c in cfgs],
        'floorPlanNote': p['floor_plan_note'] or None,
        'videoUrl': None,
        'whyInvest': p['why_invest'],
        'locationAdvantages': p['location_advantages'],
        'faqs': [{'question': f['q'], 'answer': f['a']} for f in p['faqs']],
        'images': ['/projects/%s/%s' % (slug, os.path.basename(i)) for i in p['images']],
        # Left empty on purpose: we do not know what each photograph depicts,
        # so the UI falls back to a generated description and editors can add
        # real alt text per image from the project editor.
        'imageAlts': [],
        'seoTitle': p['seo_title'],
        'seoDescription': p['seo_description'],
    }
    rows.append(rec)

out = '''// AUTO-GENERATED from the live gorealtors.in project pages. Do not edit by hand.
// Regenerate with: python3 _scrape/gen_seed.py
import type { Project } from "@/lib/types";

export const GENERATED_PROJECTS: Project[] = %s;
''' % ts(rows)

dest = os.path.join(HERE, '..', 'src', 'data', 'projects.generated.ts')
os.makedirs(os.path.dirname(dest), exist_ok=True)
open(dest, 'w', encoding='utf8').write(out)
print('wrote', dest, len(rows), 'projects')
print('missing configs:', [r['slug'] for r in rows if not r['configurations']])
print('no price:', [r['slug'] for r in rows if not r['priceMin']])
