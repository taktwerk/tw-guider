import { Injectable } from '@angular/core';
import { GuideStepService } from 'app/library/providers/api/guide-step-service';

@Injectable()
export class AddLocalGuideIdToGuideStepTableMigration {

	constructor(private guideStepService: GuideStepService) { }

	execute() {
		return new Promise(async (resolve) => {
			const queries = [
				"ALTER TABLE guide_step ADD COLUMN local_guide_id INT(11)"
			];
			let successExecution = true;
			for (let i = 0; i < queries.length; i++) {
				successExecution = await this.executeQuery(queries[i]);
				if (!successExecution) {
					resolve(false);
					return;
				}
			}
			const guideStepModels = await this.guideStepService.dbModelApi.findAll();
			for (let i = 0; i < guideStepModels.length; i++) {
				guideStepModels[i].updateLocalRelations();
			}
			resolve(true);
        });
	}

	executeQuery(query): Promise<boolean>  {
		return new Promise(async (resolve) => {
			this.guideStepService
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
