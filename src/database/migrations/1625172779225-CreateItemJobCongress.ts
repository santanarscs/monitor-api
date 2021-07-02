import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export default class CreateItemJobCongress1625172779225 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'items_jobs_congress',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: "proposition_id",
            type: "varchar"
          },
          {
            name: "type_proposition",
            type: "varchar"
          },
          {
            name: "date_apresentation",
            type: 'timestamp with time zone',
            isNullable: true
          },
          {
            name: "text",
            type: "varchar"
          },
          {
            name: "author",
            type: "varchar"
          },
          {
            name: "link",
            type: "varchar"
          },
          {
            name: "status",
            type: "varchar"
          },
          {
            name: "job_congress_id",
            type: "uuid"
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
      'items_jobs_congress',
      new TableForeignKey({
        columnNames: ['job_congress_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'jobs_congress',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('items_jobs_congress')
  }

}
