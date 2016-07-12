'use strict';

const Sequelize = require('sequelize');

module.exports = function (db) {

	require('./settings')(db);
	require('./dataset')(db);

	const Settings = db.model('settings');
	const Dataset = db.model('dataset');

    db.define('graph', {
        graphType: {
            type: Sequelize.STRING,
        },
        seriesx: {
            type: Sequelize.ARRAY(Sequelize.JSONB),
        },
        seriesy: {
            type: Sequelize.ARRAY(Sequelize.JSONB),
        },
        imageSource: {
            type: Sequelize.TEXT,
        }
    },
    {
    	defaultScope: {include: [Settings,Dataset]}
    });
};