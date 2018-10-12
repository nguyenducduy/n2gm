import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Group } from "../../models";
import { plainToClass } from "class-transformer";

@Injectable()
export class GroupsService {
    private items = [];

    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>
    ) {
        // Load full list when start
        this.fullLoadAll();
    }

    getGroupByName(name: string) {
        let groups = this.items.filter(group => group.name === name);
        if (groups.length) {
            return groups[0];
        }

        return null;
    }

    public async fullLoadAll() {
        if (this.items.length === 0) {
            try {
                const groups = await this.groupRepository
                    .createQueryBuilder("group")
                    .leftJoinAndSelect("group.permissions", "permission")
                    .getMany();

                this.items = Object.assign(
                    this.items,
                    plainToClass(Group, groups)
                );
            } catch (error) {
                throw error;
            }
        }
    }
}
