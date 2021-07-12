export const TEAM_MEMBERS_QUERY_NAME = 'TeamMembers';

export const TEAM_MEMBERS_QUERY = `
  query ${TEAM_MEMBERS_QUERY_NAME}($org: String!, $teamSlug: String!) {
    organization(login: $org) {
      team(slug: $teamSlug) {
        members {
          nodes {
            login
          }
        }
      }
    }
  }`;
