import { Member } from '../../entities';
import { Nodes } from '../utils';

export interface TeamDto {
  members: Nodes<Member>;
}
