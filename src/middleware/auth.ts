import passport from 'passport';
import { UserRole, UserToken } from '../models';
import { Request, Response, NextFunction } from 'express';
import config, {KnownConfigKey} from '../utils/config';

export function authenticate(callback?: (...args: any[]) => any) {
  if (config.get(KnownConfigKey.Auth) === 'false') {
      return passport.authenticate('anonymous', {session: false}, callback);
  } else {
      return passport.authenticate('jwt', {session: false}, callback);
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (config.get(KnownConfigKey.Auth) === 'false') {
      return next();
    }
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as UserToken;
    if (!roles.find(r => user.roles.indexOf(r) >= 0)) return res.sendStatus(403);
    next();
  };
}

export function auth(...roles: UserRole[]) { // authenticates and authorizes
  return (req: Request, res: Response, next: NextFunction) => {
      if (config.get(KnownConfigKey.Auth) === 'false') {
        return next();
      }
      authenticate((err: Error, user: UserToken) => {
      if (err || !user) {
        res.sendStatus(401);
        return;
      }

      req.login(user, {session: false}, (error) => {
        if (error) {
          next(error);
          return;
        }
        if (!req.isAuthenticated()) {
          res.sendStatus(401);
          return;
        }
        if (roles.length > 0 && !roles.find(r => user.roles.indexOf(r) >= 0)) {
          res.sendStatus(403);
          return;
        }
        next();
      });
    })(req, res);
  };
}
