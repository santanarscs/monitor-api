import { Schedule } from "../model/Schedule";

interface ICreateScheduleDTO {
  title: string;
  owner_id: string;
}
interface ISchedulesRepository {
  findByTitle(name: string): Schedule;
  list(): Schedule[]
  create({title, owner_id}: ICreateScheduleDTO): void
}

export { ISchedulesRepository, ICreateScheduleDTO }