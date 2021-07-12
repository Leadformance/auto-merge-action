import { GRAPHQL_GITHUB_API_URL, TEAM_MEMBERS_QUERY_NAME } from '../graphql';
import { OrganizationsService } from './Organizations.service';
import { queryMock } from '../../test/queryMock';

describe('OrganizationsService', () => {
  const service = new OrganizationsService('token');

  beforeAll(() => {
    queryMock.setup(GRAPHQL_GITHUB_API_URL);
  });

  afterEach(() => {
    queryMock.reset();
  });

  afterAll(() => {
    queryMock.cleanup();
  });

  describe('getTeamMembers', () => {
    const org = 'octokit';
    const teamSlug = 'dev';
    const teamName = `@${org}/${teamSlug}`;

    it('should throw if graphql errors', async () => {
      queryMock.mockQuery({
        name: TEAM_MEMBERS_QUERY_NAME,
        variables: { org, teamSlug },
        data: {},
        graphqlErrors: [{ type: 'ERROR', message: '' }],
      });

      await expect(service.getTeamMembers(teamName)).rejects.toThrowError();
    });

    it('should throw an Error if the team is not found', async () => {
      queryMock.mockQuery({
        name: TEAM_MEMBERS_QUERY_NAME,
        variables: { org, teamSlug },
        data: {
          organization: {
            team: null,
          },
        },
      });

      await expect(service.getTeamMembers(teamName)).rejects.toThrowError();
    });

    it('should return team members login', async () => {
      queryMock.mockQuery({
        name: TEAM_MEMBERS_QUERY_NAME,
        variables: { org, teamSlug },
        data: {
          organization: {
            team: {
              members: {
                nodes: [{ login: 'user1' }, { login: 'user2' }],
              },
            },
          },
        },
      });

      await expect(service.getTeamMembers(teamName)).resolves.toEqual([
        'user1',
        'user2',
      ]);
    });
  });
});
