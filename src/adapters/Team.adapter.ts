import { Team, TeamDto } from '../@types';

export class TeamAdapter {
  public static fromDto(team: TeamDto): Team {
    return {
      members: team.members.nodes,
    };
  }
}
