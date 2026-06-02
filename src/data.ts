import { Whiskey } from "./types";

export const DEFAULT_WHISKEY_CSV = `Title;Region;Category;Whizzky Link;Flavour;Price Paid;My Rates;Avg.Rating;Price £;Country
Laphroaig 10 Y/O;Islay;Single Malt Scotch;http://www.whizzky.net/whisky.php?ref=100-Laphroaig-10-Year-Old;smokey;3000;5;3.9;37.8;Scotland
Talisker 10 Y/O;Isles of Skye;Single Malt Scotch;http://www.whizzky.net/whisky.php?ref=118-Talisker-10-Year-Old;smokey;1950;5;3.8;31.3;Scotland
Lagavulin 16 Y/O;Islay;Single Malt Scotch;https://www.whizzky.net/whisky.php?ref=99-Lagavulin-16-Year-Old;smokey;4800;5;4.3;42.6;Scotland
Johnnie Walker Green Label 15 Y/O;Highlands;Blended Malt Scotch;http://www.whizzky.net/whisky.php?ref=94-Johnnie-Walker-Green-Label;smokey;2700;4.8;3.9;43.1;Scotland
Highland Park 16 Y/O;Orkney Isles;Single Malt Scotch;http://www.whizzky.net/whisky.php?ref=5598-Highland-Park-16-Year-Old;sweet;3200;4.8;3.9;43;Scotland
Benromach 10 Y/O;Speyside;Single Malt Scotch;http://www.whizzky.net/whisky.php?ref=1401-Benromach-10-Year-Old;smokey;2100;4.7;3.7;25;Scotland
Ardbeg Ten;Islay;Single Malt Scotch;https://www.whizzky.net/whisky.php?ref=29-Ardbeg-Ten;smokey;2500;4.6;4;35.1;Scotland
The GlenDronach Original 12 Y/O;Highlands;Single Malt Scotch;http://www.whizzky.net/whisky.php?ref=64-The-GlenDronach-Original-12-Year-Old;fruit dried;2900;4.5;3.8;27.2;Scotland
Highland Park 12 Y/O;Orkney Isles;Single Malt Scotch;http://www.whizzky.net/whisky.php?ref=88-Highland-Park-12-Year-Old;smokey;2300;4.5;3.7;36;Scotland
The Singleton Of Dufftown 12 Y/O;Speyside;Single Malt Scotch;http://www.whizzky.net/whisky.php?ref=139-The-Singleton-of-Dufftown-12-Year-Old;fruit dried;1600;4.5;3.5;19.5;Scotland
Bulleit Bourbon;Kentucky;Kentucky Straight Bourbon;http://www.whizzky.net/whisky.php?ref=514-Bulleit-Bourbon;sweet;900;4.3;3.5;13.5;USA
Glenfiddich 12 Y/O;Speyside;Single Malt Scotch;http://www.whizzky.net/whisky.php?ref=70-Glenfiddich-12-Year-Old;fruit;1970;4.3;3.5;23.1;Scotland
The Macallan Fine Oak 12 Y/O;Speyside;Single Malt Scotch;http://www.whizzky.net/whisky.php?ref=1772-The-Macallan-Fine-Oak-12-Year-Old;sweet flowers;4500;4.2;3.7;63.5;Scotland
The Glenlivet Double Oak 12 Y/O;Speyside;Single Malt Scotch;http://www.whizzky.net/whisky.php?ref=136-The-Glenlivet-12-Year-Old;fruit;1700;4.1;3.6;23.4;Scotland
Jameson Crested;Cork;Irish Whiskey;http://www.whizzky.net/whisky.php?ref=2316-Jameson-Crested;sweet;1500;4.1;3.6;18.2;Ireland
Jameson Black Barrel;Cork;Irish Whiskey;http://www.whizzky.net/whisky.php?ref=1669-Jameson-Black-Barrel;sweet flowers;1200;4;3.8;21.1;Ireland
Bulleit Straight Rye;Kentucky;Kentucky Straight Rye;http://www.whizzky.net/whisky.php?ref=1210-Bulleit-Rye;spice;1400;4;3.5;20.5;USA
Bushmills Black Bush Irish Whiskey;Antrim;Irish Whiskey;http://www.whizzky.net/whisky.php?ref=15-Bushmills-Black-Bush;sweet;1200;3.8;3.5;16.5;Ireland
Teacher's Highland Cream;Highlands;Blended Scotch;http://www.whizzky.net/whisky.php?ref=175-Teachers-Highland-Cream;smokey;600;3.5;2.9;8.5;Scotland
Chivas Regal 12 Y/O;Speyside;Blended Scotch;http://www.whizzky.net/whisky.php?ref=148-Chivas-Regal-12-Year-Old;sweet flowers;1350;3.7;3.2;17.5;Scotland
Jack Daniel's Single Barrel Select 47%;Tennessee;Tennessee Whiskey;https://www.whizzky.net/whisky.php?ref=134-Jack-Daniels-Single-Barrel-Select;sweet;1700;3.7;3.7;25.9;USA
Bushmills The Original Irish Whiskey;Antrim;Irish Whiskey;http://www.whizzky.net/whisky.php?ref=12-Bushmills-Original;sweet;550;3.6;3.2;11.8;Ireland
Johnnie Walker Black Label 12 Y/O;Highlands;Blended Scotch;http://www.whizzky.net/whisky.php?ref=91-Johnnie-Walker-Black-Label;smokey;1300;3.7;3.3;17.3;Scotland
Glenmorangie 10  Y/O;Highlands;Single Malt Scotch;https://www.whizzky.net/whisky.php?ref=83-Glenmorangie-Original-10-Year-Old;sweet;2850;4.1;3.6;26.6;Scotland
Jim Beam Red Stag Black Cherry;Kentucky;Flavored Bourbon;http://www.whizzky.net/whisky.php?ref=2000-Jim-Beam-Red-Stag-Black-Cherry;sweet;800;3.4;2.8;8.6;USA
Jameson 4 Y/O;Cork;Irish Whiskey;http://www.whizzky.net/whisky.php?ref=18-Jameson;sweet flowers;700;3.3;3.3;13.8;Ireland
Tullamore D.E.W. Original 3 Y/O;Offaly;Irish Whiskey;http://www.whizzky.net/whisky.php?ref=22-Tullamore-DEW-Original;sweet;800;3.2;3.3;10.2;Ireland
Ballantine's Finest;Highlands;Blended Scotch;http://www.whizzky.net/whisky.php?ref=226-Ballantines-Finest;sweet;560;3;2.7;9.5;Scotland
Jim Beam Honey;Kentucky;Flavored Bourbon;http://www.whizzky.net/whisky.php?ref=951-Jim-Beam-Honey;sweet;829;3;2.7;13.6;USA
Jack Daniel's Old No.7;Tennessee;Tennessee Whiskey;https://www.whizzky.net/whisky.php?ref=133-Jack-Daniels;sweet;750;3;3;12.3;USA
Kilbeggan Irish Whiskey;Westmeath;Irish Whiskey;http://www.whizzky.net/whisky.php?ref=269-Kilbeggan-Irish-Whiskey;sweet flowers;700;2.9;3.2;9.6;Ireland
Johnnie Walker Red Label;Highlands;Blended Scotch;http://www.whizzky.net/whisky.php?ref=96-Johnnie-Walker-Red-Label;smokey;800;2.5;2.3;8.8;Scotland
Hankey Bannister Original 3 Y/O;Speyside;Blended Scotch;http://www.whizzky.net/whisky.php?ref=726-Hankey-Bannister-Original;sweet flowers;350;2;2.7;8.6;Scotland`;

// Note: Cleaned USA Bourbon / Irish country details that the raw CSV got slightly mixed e.g. Bulleit Bourbon says Scotland, we fixed to USA! We kept the values.
// Let's write a robust CSV parser:
export function parseCSV(rawText: string): Whiskey[] {
  if (!rawText || rawText.trim() === "") return [];

  const lines = rawText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  // Detect delimiter: lookup first line and count semicolons vs commas
  const headerLine = lines[0];
  const containsSemicolons = (headerLine.match(/;/g) || []).length;
  const containsCommas = (headerLine.match(/,/g) || []).length;
  const delimiter = containsSemicolons >= containsCommas ? ";" : ",";

  // Parse header and find columns positions
  const headers = headerLine.split(delimiter).map(h => h.trim().toLowerCase());
  
  const titleIdx = headers.findIndex(h => h.includes("title"));
  const regionIdx = headers.findIndex(h => h.includes("region"));
  const categoryIdx = headers.findIndex(h => h.includes("category"));
  const linkIdx = headers.findIndex(h => h.includes("link") || h.includes("whizzky"));
  const flavourIdx = headers.findIndex(h => h.includes("flavour") || h.includes("flavor"));
  const pricePaidIdx = headers.findIndex(h => h.includes("price paid") || h.includes("paid"));
  const myRatesIdx = headers.findIndex(h => h.includes("my rates") || h.includes("my rate") || h.includes("rating") && !h.includes("avg"));
  const avgRatingIdx = headers.findIndex(h => h.includes("avg") || h.includes("average"));
  const priceGbpIdx = headers.findIndex(h => h.includes("price £") || h.includes("price gbp") || h.includes("price paid") === false && h.startsWith("price"));
  const countryIdx = headers.findIndex(h => h.includes("country"));

  const whiskeys: Whiskey[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle standard CSV splitter respecting double quotes if any, but a split by delimiter usually works for basic reviews
    // Simple robust splitter
    const values: string[] = [];
    let currentVal = "";
    let insideQuotes = false;
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === delimiter && !insideQuotes) {
        values.push(currentVal.trim());
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim());

    // Clean values (remove quotes)
    const cleanVals = values.map(v => {
      let s = v;
      if (s.startsWith('"') && s.endsWith('"')) {
        s = s.substring(1, s.length - 1);
      }
      return s.trim();
    });

    if (cleanVals.length === 0 || !cleanVals[titleIdx === -1 ? 0 : titleIdx]) continue;

    // Get values with safe fallback bounds
    const getVal = (idx: number, fallback = ""): string => {
      if (idx === -1 || idx >= cleanVals.length) return fallback;
      return cleanVals[idx];
    };

    const title = getVal(titleIdx, `Whiskey #${i}`);
    const region = getVal(regionIdx, "Unknown");
    const category = getVal(categoryIdx, "Single Malt");
    const link = getVal(linkIdx, "");
    const flavour = getVal(flavourIdx, "smooth");
    
    // Parse numeric values safely
    const parseNum = (str: string, def = 0): number => {
      if (!str) return def;
      // replace commas with dots for float parsing
      const cleaned = str.replace(/[^\d.]/g, "").replace(",", ".");
      const val = parseFloat(cleaned);
      return isNaN(val) ? def : val;
    };

    const pricePaid = parseNum(getVal(pricePaidIdx), 0);
    const myRating = parseNum(getVal(myRatesIdx), 3.0);
    const avgRating = parseNum(getVal(avgRatingIdx), 3.0);
    const priceGbp = parseNum(getVal(priceGbpIdx), 0);
    const country = getVal(countryIdx, "Scotland");

    whiskeys.push({
      id: `${i}-${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      title,
      region,
      category,
      link,
      flavour,
      pricePaid,
      myRating,
      avgRating,
      priceGbp,
      country
    });
  }

  return whiskeys;
}
