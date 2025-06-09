import { useState } from "react";
import AdBanner from "./AdBanner1";
import { Flag, BarChart, ChevronDown, ChevronUp } from "lucide-react";

const countryCodeMap: Record<string, string> = {
  "Afghanistan": "af",
  "Albania": "al",
  "Algeria": "dz",
  "Andorra": "ad",
  "Angola": "ao",
  "Antigua and Barbuda": "ag",
  "Argentina": "ar",
  "Armenia": "am",
  "Australia": "au",
  "Austria": "at",
  "Azerbaijan": "az",
  "Bahamas": "bs",
  "Bahrain": "bh",
  "Bangladesh": "bd",
  "Barbados": "bb",
  "Belarus": "by",
  "Belgium": "be",
  "Belize": "bz",
  "Benin": "bj",
  "Bhutan": "bt",
  "Bolivia": "bo",
  "Bosnia and Herzegovina": "ba",
  "Botswana": "bw",
  "Brazil": "br",
  "Brunei": "bn",
  "Bulgaria": "bg",
  "Burkina Faso": "bf",
  "Burundi": "bi",
  "Cabo Verde": "cv",
  "Cambodia": "kh",
  "Cameroon": "cm",
  "Canada": "ca",
  "Central African Republic": "cf",
  "Chad": "td",
  "Chile": "cl",
  "China": "cn",
  "Colombia": "co",
  "Comoros": "km",
  "Congo (Congo-Brazzaville)": "cg",
  "Costa Rica": "cr",
  "Croatia": "hr",
  "Cuba": "cu",
  "Cyprus": "cy",
  "Czech Republic": "cz",
  "Democratic Republic of the Congo": "cd",
  "Denmark": "dk",
  "Djibouti": "dj",
  "Dominica": "dm",
  "Dominican Republic": "do",
  "Ecuador": "ec",
  "Egypt": "eg",
  "El Salvador": "sv",
  "Equatorial Guinea": "gq",
  "Eritrea": "er",
  "Estonia": "ee",
  "Eswatini": "sz",
  "Ethiopia": "et",
  "Fiji": "fj",
  "Finland": "fi",
  "France": "fr",
  "Gabon": "ga",
  "Gambia": "gm",
  "Georgia": "ge",
  "Germany": "de",
  "Ghana": "gh",
  "Greece": "gr",
  "Grenada": "gd",
  "Guatemala": "gt",
  "Guinea": "gn",
  "Guinea-Bissau": "gw",
  "Guyana": "gy",
  "Haiti": "ht",
  "Honduras": "hn",
  "Hungary": "hu",
  "Iceland": "is",
  "India": "in",
  "Indonesia": "id",
  "Iran": "ir",
  "Iraq": "iq",
  "Ireland": "ie",
  "Israel": "il",
  "Italy": "it",
  "Jamaica": "jm",
  "Japan": "jp",
  "Jordan": "jo",
  "Kazakhstan": "kz",
  "Kenya": "ke",
  "Kiribati": "ki",
  "Kuwait": "kw",
  "Kyrgyzstan": "kg",
  "Laos": "la",
  "Latvia": "lv",
  "Lebanon": "lb",
  "Lesotho": "ls",
  "Liberia": "lr",
  "Libya": "ly",
  "Liechtenstein": "li",
  "Lithuania": "lt",
  "Luxembourg": "lu",
  "Madagascar": "mg",
  "Malawi": "mw",
  "Malaysia": "my",
  "Maldives": "mv",
  "Mali": "ml",
  "Malta": "mt",
  "Marshall Islands": "mh",
  "Mauritania": "mr",
  "Mauritius": "mu",
  "Mexico": "mx",
  "Micronesia": "fm",
  "Moldova": "md",
  "Monaco": "mc",
  "Mongolia": "mn",
  "Montenegro": "me",
  "Morocco": "ma",
  "Mozambique": "mz",
  "Myanmar": "mm",
  "Namibia": "na",
  "Nauru": "nr",
  "Nepal": "np",
  "Netherlands": "nl",
  "New Zealand": "nz",
  "Nicaragua": "ni",
  "Niger": "ne",
  "Nigeria": "ng",
  "North Korea": "kp",
  "North Macedonia": "mk",
  "Norway": "no",
  "Oman": "om",
  "Pakistan": "pk",
  "Palau": "pw",
  "Palestine": "ps",
  "Panama": "pa",
  "Papua New Guinea": "pg",
  "Paraguay": "py",
  "Peru": "pe",
  "Philippines": "ph",
  "Poland": "pl",
  "Portugal": "pt",
  "Qatar": "qa",
  "Romania": "ro",
  "Russia": "ru",
  "Rwanda": "rw",
  "Saint Kitts and Nevis": "kn",
  "Saint Lucia": "lc",
  "Saint Vincent and the Grenadines": "vc",
  "Samoa": "ws",
  "San Marino": "sm",
  "Sao Tome and Principe": "st",
  "Saudi Arabia": "sa",
  "Senegal": "sn",
  "Serbia": "rs",
  "Seychelles": "sc",
  "Sierra Leone": "sl",
  "Singapore": "sg",
  "Slovakia": "sk",
  "Slovenia": "si",
  "Solomon Islands": "sb",
  "Somalia": "so",
  "South Africa": "za",
  "South Korea": "kr",
  "South Sudan": "ss",
  "Spain": "es",
  "Sri Lanka": "lk",
  "Sudan": "sd",
  "Suriname": "sr",
  "Sweden": "se",
  "Switzerland": "ch",
  "Taiwan": "tw",
  "Tajikistan": "tj",
  "Tanzania": "tz",
  "Thailand": "th",
  "Timor-Leste": "tl",
  "Togo": "tg",
  "Tonga": "to",
  "Trinidad and Tobago": "tt",
  "Tunisia": "tn",
  "Turkey": "tr",
  "Turkmenistan": "tm",
  "Tuvalu": "tv",
  "Uganda": "ug",
  "Ukraine": "ua",
  "United Arab Emirates": "ae",
  "United Kingdom": "gb",
  "United States": "us",
  "Uruguay": "uy",
  "Uzbekistan": "uz",
  "Vanuatu": "vu",
  "Vatican City": "va",
  "Venezuela": "ve",
  "Vietnam": "vn",
  "Yemen": "ye",
  "Zambia": "zm",
  "Zimbabwe": "zw",
  "Unknown": "xx"
};

interface CountryStatsProps {
  data: {
    image1: { total: number; countries: Record<string, number> };
    image2: { total: number; countries: Record<string, number> };
  };
  userCountry: string;
}

const CountryStats = ({ data, userCountry }: CountryStatsProps) => {
  const [expanded, setExpanded] = useState(false);

  const allCountries = new Set([
    ...Object.keys(data.image1.countries),
    ...Object.keys(data.image2.countries),
  ]);

  const sortedCountries = Array.from(allCountries)
    .map((country) => {
      const image1 = data.image1.countries[country] || 0;
      const image2 = data.image2.countries[country] || 0;
      return {
        name: country,
        image1Clicks: image1,
        image2Clicks: image2,
        total: image1 + image2,
      };
    })
    .sort((a, b) => b.total - a.total);

  const topTotal = sortedCountries[0]?.total || 1;
  const displayCountries = expanded ? sortedCountries : sortedCountries.slice(0, 1);

  const getFlagUrl = (country: string) => {
    if (country.includes("Syria")) {
      return "/flags/syria-opposition.ico";
    }
    const code = countryCodeMap[country];
    return code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : "";
  };

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 w-full max-w-3xl z-[9999] transition-all duration-500 ease-in-out bottom-0 pointer-events-auto">
      <div className="bg-white shadow-xl rounded-t-xl border overflow-hidden">
        

        {/* الترويسة */}
        <div
          className="flex items-center justify-between px-4 py-3 bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
          onClick={() => setExpanded(!expanded)}
        >
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-amber-500" />
            Country Statistics
            {!expanded && sortedCountries[0] && (
              <span className="ml-4 text-sm text-green-700 flex items-center gap-1">
                <img
                  src={getFlagUrl(sortedCountries[0].name)}
                  alt={sortedCountries[0].name}
                  className="w-5 h-4 rounded-sm object-cover"
                />
                {sortedCountries[0].name} ({sortedCountries[0].total.toLocaleString()})
              </span>
            )}
          </h2>
          <span className="text-sm text-blue-600 flex items-center gap-1">
            {expanded ? "Collapse" : "Show All"}
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </span>
        </div>

        {/* جدول الإحصائيات */}
        <div
          className={`transition-all duration-300 overflow-y-auto ${
            expanded ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <table className="w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-amber-100 text-xs uppercase text-gray-800">
                <th className="py-3 px-4 text-left">Country</th>
                <th className="py-3 px-2 text-right">Image 1</th>
                <th className="py-3 px-2 text-right">Image 2</th>
                <th className="py-3 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {displayCountries.map((country) => {
                const percent = (country.total / topTotal) * 100;
                const isUser = country.name === userCountry;
                return (
                  <tr
                    key={country.name}
                    className={`border-t ${
                      isUser ? "bg-blue-50 font-semibold" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-2 px-4 flex items-center gap-2">
                      <img
                        src={getFlagUrl(country.name)}
                        alt={country.name}
                        className="w-6 h-4 object-cover rounded-sm"
                      />
                      {country.name}
                      {isUser && <span className="ml-1 text-blue-600">(You)</span>}
                    </td>
                    <td className="py-2 px-2 text-right">{country.image1Clicks.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right">{country.image2Clicks.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-bold">
                      {country.total.toLocaleString()}
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div
                          className="bg-amber-500 h-1 rounded-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      {/* الإعلان */}
         <div className="p-4 border-b border-gray-200">
          <AdBanner />
        </div>
      </div>
    </div>
  );
};

export default CountryStats;