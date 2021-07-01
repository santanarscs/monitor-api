import {MigrationInterface, QueryRunner, Table} from "typeorm";

export default class CreateSchedules1625172736963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'schedules',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: "title",
            type: "varchar"
          },
          {
            name: "target",
            type: 'varchar'
          },
          {
            name: "owner_id",
            type: 'varchar'
          },
          {
            name: "type_schedule",
            type: 'varchar'
          },
          {
            name: "active",
            type: 'boolean'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('schedules')
  }

}
