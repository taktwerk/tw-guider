import { Injectable } from '@angular/core';
import { AuthDb } from 'src/models/db/auth-db';

@Injectable()
export class AddGroupColumnToUserTableMigration {
	constructor(private auth: AuthDb) { }

	execute() {
		return new Promise(async (resolve) => {
			const queries = [
				"ALTER TABLE auth ADD COLUMN groups TEXT"
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
			this.auth
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
