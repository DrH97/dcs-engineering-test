import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  getConnection
} from "typeorm";

@Entity()
class Lot extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;

  @Column("integer")
  quantity!: number;

  @Column({
    type: "datetime",
    precision: 3
  })
  expiry!: Date;

  // TODO: We should sort by expiry in db? faster? more efficient? necessary?
  static findNonExpired(name: string) {
    const queryBuilder = this.createQueryBuilder("lot").where("name = :name", {
      name
    });

    // Modified for sqlite datetime check during tests
    if (getConnection().options.type === "sqlite") {
      queryBuilder.andWhere("strftime('%s', expiry) > strftime('%s','now')");
    } else {
      queryBuilder.andWhere("expiry > :date", { date: new Date() });
    }

    return queryBuilder.andWhere("quantity > 0").getMany();
  }
}

export default Lot;
