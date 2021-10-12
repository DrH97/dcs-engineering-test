import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
class Lot extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;

  @Column("integer")
  quantity!: number;

  @Column({ type: "datetime" })
  expiry!: Date;

  // TODO: We should sort by expiry in db? faster? more efficient? necessary?
  static findNonExpired(name: string) {
    return this.createQueryBuilder("lot")
      .where("name = :name", { name })
      .andWhere("expiry > :date", { date: new Date() })
      .andWhere("quantity > 0")
      .getMany();
  }
}

export default Lot;
