import { ObjectID } from "typeorm";

interface ISchedule {
  id: string | ObjectID;

  title: string;

  target: string;

  owner_id: string

  type_schedule: string

  tags: string[]

  active: boolean;

  created_at: Date;

  updated_at: Date;
}

export { ISchedule }

  