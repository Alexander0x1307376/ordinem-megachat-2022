import { Column, Entity } from "typeorm";
import Model from "./Model";

@Entity('images')
export class Image extends Model {

  @Column({ length: 256, nullable: true })
  name: string;

  @Column({ unique: true })
  path: string;
  
}