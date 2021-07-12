import { TeamMembersQueryData } from '../@types';
import { TEAM_MEMBERS_QUERY } from '../graphql';
import { AbstractGraphQLService } from './AbstractGraphQL.service';

export class OrganizationsService extends AbstractGraphQLService {
  public async getTeamMembers(teamName: string): Promise<string[]> {
    const [org, teamSlug] = teamName.slice(1).split('/');

    const data = await this.graphql<TeamMembersQueryData>(TEAM_MEMBERS_QUERY, {
      org,
      teamSlug,
    });

    if (!data.organization.team)
      throw new Error(
        `Team "${teamName}" could not be found. Verify that your token can access the team`
      );

    return data.organization.team.members.nodes.map(({ login }) => login);
  }
}
