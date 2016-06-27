'use strict';
const router = require('express').Router();
const soda = require('soda-js');
const env = require('../../../env');

module.exports = router;


router.get('/',function(req,res,next){

	if (req.query) {
		let datasetId = req.query.datasetId;
		let domain = req.query.domain;
		let consumer = new soda.Consumer(domain,{'apiToken': env.socrata.apiToken});

		consumer.query().withDataset(datasetId)
			.getRows()
			.on('success',function(rows){
				res.send(rows);
			})
			.on('error',next);
	}
	else {
		res.sendStatus(404);
	}
});

router.put('/',function(req,res,next){

	let datasetId = req.body.dataset.resource.id;
	let domain = req.body.dataset.metadata.domain;
	let columns = req.body.arrOfColumns.join(',');


	let consumer = new soda.Consumer(domain,{'apiToken': env.socrata.apiToken});

	consumer.query().withDataset(datasetId)
		.select(columns).limit(1000)
		.groupBy(columns[0])
		.getRows()
		.on('success',function(rows){
			res.send({graphData: rows, columns: columns});
		})
		.on('error',next);

});