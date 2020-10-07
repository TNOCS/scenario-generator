import { CollectionNames } from '@/services/meiosis';
export interface IBasicContent {
  id: string;
  name: string;
  type: CollectionNames;
}

export interface IContent extends IBasicContent {}
