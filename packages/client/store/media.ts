import { makeAutoObservable } from 'mobx';

import { MediaInterface, UserInterface } from '../lib/types';

export class MediaEntity implements MediaInterface {
  id = '';
  url = '';
  thumbnailUrl = '';
  width = 0;
  height = 0;
  x = 0;
  y = 0;
  size = 0;
  format = '';
  // DateTime
  createdAt = '';
  updatedAt = '';
  // Created by
  createdBy = null as unknown as UserInterface;
  createdById = '';

  constructor(props: MediaInterface) {
    Object.assign(this, props);
    makeAutoObservable(this);
  }
}

class MediaStore {
  entities: MediaEntity[] = [];

  constructor() {
    makeAutoObservable(this);
  }
}

export const mediaStore = new MediaStore();
