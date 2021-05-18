import { Injectable } from '@angular/core';
import { SyncIndexService } from 'src/providers/api/sync-index-service';

@Injectable()
export class AddModelColumnsToSyncIndexTableMigration {

	constructor(private syncIndexService: SyncIndexService) { }

	execute() {
		return new Promise(async (resolve) => {
			const queries = [
				"ALTER TABLE sync_index ADD COLUMN model VARCHAR(255)",
				"ALTER TABLE sync_index ADD COLUMN model_id VARCHAR(255)",
				"ALTER TABLE sync_index ADD COLUMN user_id VARCHAR(255)",
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
			this.syncIndexService
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
