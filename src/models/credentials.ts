export enum UserRole {
  Admin = 'admin',
  Contributor = 'contributor',
  Reader = 'reader',
}

export interface UserToken {
  email: string;
  roles: UserRole[];
}

export interface Credential extends UserToken {
  password: string;
}

export interface UserCredential extends Credential {
  userId: number;
}
