import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Lot extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("varchar")
    name!: string;

    @Column("integer")
    quantity!: number;

    @Column({type: "datetime"})
    expiry!: Date;

    // TODO: We should add a quantity check as well
    // TODO: We should sort by expiry in db? faster? more efficient?
    static findNonExpired(name: string) {
        return this.createQueryBuilder("lot")
            .where("name = :name", {name})
            .andWhere("expiry > :date", { date: new Date()})
            .andWhere("quantity > 0")
            .getMany();
    }

}
