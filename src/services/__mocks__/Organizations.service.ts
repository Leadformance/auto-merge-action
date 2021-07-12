import { mockTeam } from '../../../test/mockData';

export class OrganizationsService {
  public async getTeamMembers(teamName: string): Promise<string[]> {
    return new Promise(resolve => {
      resolve(mockTeam(teamName).members.map(member => member.login));
    });
  }
}
