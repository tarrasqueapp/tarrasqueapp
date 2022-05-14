import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import Router from 'next/router';

import { UserEntity } from './users';

export interface SetupInterface {
  databaseCreated: boolean;
  userCreated: boolean;
  campaignCreated: boolean;
  mapCreated: boolean;
}

class SetupStore {
  constructor() {
    makeAutoObservable(this);
  }

  async createDatabase() {
    const response = await axios.post<SetupInterface>(`${Router.basePath}/api/setup/create-database`);
    return response.data;
  }

  async createUser(user: Partial<UserEntity> & { password: string }) {
    const response = await axios.post<SetupInterface>(`${Router.basePath}/api/setup/create-user`, user);
    return response.data;
  }
}

export const setupStore = new SetupStore();
