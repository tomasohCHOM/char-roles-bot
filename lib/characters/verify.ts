import { characters } from "./characters.ts";

/**
 * Represents the result of making a server role query.
 */
export interface QueryVerificationResult {
  /**
   * The result of the query verification.
   */
  data: string;

  /**
   * Whether or not the verification was successful.
   */
  success: boolean;
}

export function formatString(str: string): string {
  return str.replace(/\W/g, "").toLowerCase();
}

export function verifyQuery(query: string): QueryVerificationResult {
  const formattedQuery = formatString(query);
  for (const [officialName, roleName] of characters) {
    const formattedOfficialName = formatString(officialName);
    const formattedRoleName = formatString(roleName);

    if (
      formattedOfficialName.includes(formattedQuery) ||
      formattedRoleName.includes(formattedQuery)
    ) {
      return {
        data: roleName,
        success: true,
      };
    }
  }

  return {
    data: "Query was unsuccessful",
    success: false,
  };
}
