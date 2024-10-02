// src/models/user.model.ts

export interface User {
    username: string;
    password: string;
    nomUser: string;
    userCodeSte: string;
    groupe:string,
    actifDepuis:Date | undefined,
    isActif : boolean | null ,
  }
  