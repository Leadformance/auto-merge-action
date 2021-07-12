import { TeamDto } from '../dto';

export interface TeamMembersQueryData {
  organization: {
    team: null | TeamDto;
  };
}
