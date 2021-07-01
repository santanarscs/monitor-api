import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export default class CreateTags1625172749155 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tags',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: "name",
            type: "varchar"
          },
          {
            name: "schedule_id",
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
      'tags',
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
    await queryRunner.dropTable('tags');
  }

}
