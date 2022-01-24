/* eslint-disable @typescript-eslint/prefer-for-of */
import { Injectable } from '@angular/core';
import { GuideViewHistoryService } from '../providers/api/guide-view-history-service';

@Injectable()
export class AddModelColumnsToGuideViewHistoryTableMigration {

	constructor(private guideViewHistoryService: GuideViewHistoryService) { }

	execute() {
		return new Promise(async (resolve) => {
			const queries = [
				'ALTER TABLE guide_view_history ADD COLUMN client_id INT(11)',
				'ALTER TABLE guide_view_history ADD COLUMN user_id INT(11)',
				'ALTER TABLE guide_view_history ADD COLUMN guide_id INT(11)',
				'ALTER TABLE guide_view_history ADD COLUMN step INT(11)',
				'ALTER TABLE guide_view_history ADD COLUMN parent_guide_id INT(11)',
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
			this.guideViewHistoryService
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
