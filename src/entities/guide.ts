import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn} from 'typeorm';
import {GuideStep} from './guide_step';

@Entity()
export class Guide {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column({nullable: true})
    short_name: string;

    @Column()
    title: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    preview_file: string;

    @Column({nullable: true})
    revision_term: string;

    @Column()
    revision_counter: number;

    @Column({nullable: true})
    duration: number;

    @Column()
    template_id: number;

    @Column({nullable: true})
    protocol_template_id: number;

    @OneToMany(type => GuideStep, guide_step => guide_step.guide)
    @JoinColumn({ name: 'guide_id' })
    steps: GuideStep[];
}
