import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export default class CreateJobCongress1625172772472 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'jobs_congress',
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
            name: "date_job",
            type: 'timestamp with time zone',
          },
          {
            name: 'schedule_id',
            type: 'uuid'
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
    await queryRunner.createForeignKey(
      'jobs_congress',
      new TableForeignKey({
        columnNames: ['schedule_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'schedules',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('jobs_congress')
  }

}
