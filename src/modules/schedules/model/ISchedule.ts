import { ITag } from "./ITag";

interface ISchedule {
  id: string;

  title: string;

  target: string;

  owner_id: string

  type_schedule: string

  tags: ITag[]

  active: boolean;

  created_at: Date;

  updated_at: Date;
}

export { ISchedule }

  