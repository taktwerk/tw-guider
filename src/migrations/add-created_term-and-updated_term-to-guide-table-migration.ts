import { Injectable } from '@angular/core';
import { UserService } from '../services/user-service';
import { GuiderService } from '../providers/api/guider-service';

@Injectable()
export class AddCreatedTermAndUpdatedTermToGuideTableMigration {

	constructor(private guiderService: GuiderService) { }

	execute() {
		return new Promise(async (resolve) => {
			const queries = [
				"ALTER TABLE guide ADD COLUMN created_term VARCHAR(255)",
				"ALTER TABLE guide ADD COLUMN updated_term VARCHAR(255)",
			];
			let successExecution = true;
			for (let i = 0; i < queries.length; i++) {
				successExecution = await this.executeQuery(queries[i]);
				if (!successExecution) {
					resolve(false);
					return;
				}
			}
			resolve(true);
		});
	}

	executeQuery(query): Promise<boolean> {
		return new Promise(async (resolve) => {
			this.guiderService
				.dbModelApi
				.query(query)
				.then((res) => {
					console.log('success when execute code');
					resolve(true);
				}).catch((err) => {
					console.log('error when execute code', err);
					resolve(false);
				});
		});
	}
}
