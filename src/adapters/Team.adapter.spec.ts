import { Team, TeamDto } from '../@types';
import { TeamAdapter } from './Team.adapter';

describe('TeamAdapter', () => {
  describe('fromDto', () => {
    it('should adapt from DTO', () => {
      const teamDto: TeamDto = {
        members: {
          nodes: [{ login: 'foo' }, { login: 'bar' }],
        },
      };

      const team: Team = {
        members: [{ login: 'foo' }, { login: 'bar' }],
      };

      expect(TeamAdapter.fromDto(teamDto)).toEqual(team);
    });
  });
});
