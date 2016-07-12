'use strict';

const Sequelize = require('sequelize');

module.exports = function (db) {

    db.define('settings', {
        title: {
            type: Sequelize.STRING
        },
        titleSize: {
            type: Sequelize.INTEGER
        },
        width: {
            type: Sequelize.INTEGER
        },
        height: {
            type: Sequelize.INTEGER
        },
        radius: {
            type: Sequelize.INTEGER
        },
        xAxisLabel: {
        	type: Sequelize.STRING
        },
        xAxisLabelSize: {
            type: Sequelize.INTEGER
        },
        xAxisTitleSize: {
            type: Sequelize.INTEGER
        },
        yAxisLabel: {
        	type: Sequelize.STRING
        },
        yAxisLabelSize: {
            type: Sequelize.INTEGER
        },
        yAxisTitleSize: {
            type: Sequelize.INTEGER
        },
        color: {
            type: Sequelize.STRING
        },
        minX: {
            type: Sequelize.INTEGER
        },
        maxX: {
            type: Sequelize.INTEGER
        },
        minY: {
            type: Sequelize.INTEGER
        },
        maxY: {
            type: Sequelize.INTEGER
        },
        display: {
            type: Sequelize.ENUM('percentage', 'total') 
        },
        displayType: {
            type: Sequelize.ENUM('percentage', 'number')
        },
        groupType: {
            type: Sequelize.ENUM('total', 'mean', 'none')
        }
    });
};
