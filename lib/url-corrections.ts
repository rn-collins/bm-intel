/**
 * Corrections for official source URLs that have moved or been withdrawn.
 *
 * Signal and source records live in Redis, so a URL captured when a signal was
 * logged keeps pointing wherever it pointed then. Government sites reorganise:
 * GOV.UK retires transition-period guidance, and DOL restructured its Wage and
 * Hour industry pages. The correction is applied at render, so the stored
 * record is left intact and the reader is sent to the live page.
 *
 * This was originally the only option: /api/seed called createSource and
 * createSignal, which always mint a new id, so re-seeding would have duplicated
 * every record rather than correcting two. The seed route now upserts on a
 * natural key, so running it does rewrite the stored records — this map stays
 * as a safety net for records written before that, and for any URL that moves
 * between seeds.
 *
 * Each entry below was checked from two different HTTP clients before the old
 * URL was treated as dead, because some hosts answer one client 403 and another
 * a true 200 or 404. Both replacements were fetched and read.
 */

export interface UrlCorrection {
  to: string;
  /** Why the original stopped resolving, and what the replacement is. */
  note: string;
  /** ISO date the replacement was last confirmed live. */
  checked: string;
}

export const URL_CORRECTIONS: Record<string, UrlCorrection> = {
  // 404 from both a browser UA and a plain client. This was transition-period
  // guidance; the model it described is now published as the BTOM itself.
  "https://www.gov.uk/guidance/import-food-and-drink-from-the-eu-to-great-britain-from-1-january-2021":
    {
      to: "https://www.gov.uk/government/publications/the-border-target-operating-model-august-2023",
      note: "GOV.UK retired the 'from 1 January 2021' import guidance. The Border Target Operating Model publication is the current home of the phased SPS/health-certification regime.",
      checked: "2026-08-30",
    },

  // dol.gov answers a browser UA 403 across the whole site but serves a plain
  // client 200 for live pages, so the 404 this URL returns to that same plain
  // client is authoritative: the WHD /industries/ tree is gone.
  "https://www.dol.gov/agencies/whd/industries/restaurants": {
    to: "https://www.dol.gov/agencies/whd/fact-sheets/2-flsa-restaurants",
    note: "DOL removed the Wage and Hour Division /industries/ pages. Fact Sheet #2, 'Restaurants and Fast Food Establishments Under the Fair Labor Standards Act (FLSA)', is the equivalent current guidance.",
    checked: "2026-08-30",
  },
};

/** Return the live URL for a stored source URL, correcting it if it is known-dead. */
export function correctUrl(url: string | null | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  return URL_CORRECTIONS[trimmed]?.to ?? trimmed;
}

/** True when the stored URL is one we are rewriting on the way out. */
export function isCorrected(url: string | null | undefined): boolean {
  return Boolean(url && URL_CORRECTIONS[url.trim()]);
}
