export const appName = 'ToonUI';
export const docsTitle = 'ToonUI Documentation';
export const repoUrl = process.env.NEXT_PUBLIC_REPO_URL ?? 'https://github.com/jefferson-lopez/toon-ui-docs';
export const repoBranch = process.env.NEXT_PUBLIC_REPO_BRANCH ?? 'main';
export const repoBlobUrl = `${repoUrl}/blob/${repoBranch}`;
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');
