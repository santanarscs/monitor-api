import { ObjectID } from "typeorm";

type TypeOption = {
  label: string;
  value: string;
}

interface IScheduleCongress{
  id: ObjectID;

  name: string;

  type_proposition: TypeOption[];

  type_schedule: 'daily' | 'monthly'| 'weekly';

  owner_id: string;

  tags: string[];

  active: boolean;

  created_at: Date;

  updated_at: Date;
}

export { IScheduleCongress, TypeOption }