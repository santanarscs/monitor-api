import { v4 as uuidv4 } from "uuid";

class Schedule {
  id?: string;
  title: string;
  owner_id: string;

  constructor() {
    if(!this.id) {
      this.id = uuidv4()
    }
  }
}

export { Schedule }