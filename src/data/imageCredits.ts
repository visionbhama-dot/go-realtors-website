/**
 * Attribution for the third-party photographs used on the site.
 *
 * Each entry is a Creative Commons image from Wikimedia Commons, reused under
 * the licence named in the record. The files were cropped and colour-corrected
 * for the featured-city cards, so each one is an adaptation of the original.
 *
 * These are rendered publicly at /image-credits, linked from the footer, which
 * is how the attribution terms of the CC BY and CC BY-SA licences are met.
 *
 * Images GoRealtors owns — project galleries, team photos, brand assets and the
 * hero footage — are not listed here and need no third-party attribution.
 */
export type ImageCredit = {
  city: string;
  file: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
};

export const IMAGE_CREDITS: ImageCredit[] = [
  {
    city: "Noida",
    file: "/cities/noida.jpg",
    author: "Ddevhsharrma",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Gautam_Buddha_NagarView_from_Star_Court.jpg",
  },
  {
    city: "Pune",
    file: "/cities/pune.jpg",
    author: "Ujjawal.Gayakwad",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Pune_West_skyline_-_March_2017.jpg",
  },
  {
    city: "Hyderabad",
    file: "/cities/hyderabad.jpg",
    author: "iMahesh",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Rajapushpa_Provincia_and_My_Home_Avatar_complexes_-_High-rise_residential_skyline_in_Hyderabad.jpg",
  },
  {
    city: "Bangalore",
    file: "/cities/bangalore.jpg",
    author: "SlowPhoton",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Skyline_of_Varthur,_Bangalore.jpg",
  },
  {
    city: "Chennai",
    file: "/cities/chennai.jpg",
    author: "Karthikeyan321",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Chennai-Skyline-from-Mount.jpg",
  },
  {
    city: "Mumbai",
    file: "/cities/mumbai.jpg",
    author: "Woodysworldtv",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    source: "https://commons.wikimedia.org/wiki/File:Worli_skyline_with_BSWL_(cropped)_2.jpg",
  },
  {
    city: "Goa",
    file: "/cities/goa.jpg",
    author: "Original: Vyacheslav Argenberg Derivative work: UnpetitproleX",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Mandrem_Beach_and_Mandrem_River,_Mandrem,_Goa,_India_(edit).jpg",
  },
  {
    city: "Lucknow",
    file: "/cities/lucknow.jpg",
    author: "Aryanmathurphotography",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:RUMI_DARWAZA_(Rumi_Gate_back_view).jpg",
  },
  {
    city: "Kolkata",
    file: "/cities/kolkata.jpg",
    author: "Subhrajyoti07",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:New_Town_Skyline_captured_from_Bengal_Intelligent_Park,_Saltlake,_Kolkata_(2_of_2_photos).jpg",
  },
];
