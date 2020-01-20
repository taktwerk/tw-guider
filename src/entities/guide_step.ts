import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {Guide} from './guide';

@Entity()
export class GuideStep {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    guide_id: number;

    @Column()
    order_number: number;

    @Column()
    title: string;

    @Column()
    description_html: string;

    @Column()
    attached_file: string;

    @ManyToOne(type => Guide, guide => guide.steps)
    guide: Guide;
}
