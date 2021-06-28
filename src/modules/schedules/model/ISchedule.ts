import { ObjectID } from "typeorm";

interface ISchedule {
  id: string | ObjectID;

  title: string;

  owner_id: string

  repeat: string

  tags: string[]

  active: boolean;

  created_at: Date;

  updated_at: Date;
}

export { ISchedule }

  