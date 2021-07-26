const express = require('express');

const Plans = require('../models/plans');

const planRouter = express.Router();

planRouter.use(express.json()); // instead bodyParser

planRouter.route('/')
    .get((req, res, next) => {
        Plans.find({})
            .then((plans) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(plans); // takes json string and brings it back to the client in body
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        const formattedBody = req.body;
        formattedBody['fullPlanNutritionalValue'] = Number(formattedBody['fullPlanNutritionalValue']);
        Plans.create(formattedBody)
            .then((plan) => {
                console.log('Plan Created: ', plan);

                const breakfastAndLunchNutritionalValue = plan['fullPlanNutritionalValue'] * 0.3721;
                const dinnerNutritionalValue = plan['fullPlanNutritionalValue'] * 0.2558;

                plan['records'][0]['records']['breakfast'] = {
                    protein: {
                        records: [],
                        nutritionalValue: Math.round(breakfastAndLunchNutritionalValue * 0.42),
                    },
                    fat: {
                        records: [],
                        nutritionalValue: Math.round(breakfastAndLunchNutritionalValue * 0.22),
                    },
                    carbohydrates: {
                        records: [],
                        nutritionalValue: Math.round(breakfastAndLunchNutritionalValue * 0.36),
                    },
                    nutritionalValue: Math.round(breakfastAndLunchNutritionalValue),
                };

                plan['records'][0]['records']['lunch'] = {
                    protein: {
                        records: [],
                        nutritionalValue: Math.round(breakfastAndLunchNutritionalValue * 0.42),
                    },
                    fat: {
                        records: [],
                        nutritionalValue: Math.round(breakfastAndLunchNutritionalValue * 0.22),
                    },
                    carbohydrates: {
                        records: [],
                        nutritionalValue: Math.round(breakfastAndLunchNutritionalValue * 0.36),
                    },
                    nutritionalValue: Math.round(breakfastAndLunchNutritionalValue),
                };

                plan['records'][0]['records']['dinner'] = {
                    protein: {
                        records: [],
                        nutritionalValue: Math.round(dinnerNutritionalValue * 0.61),
                    },
                    carbohydrates: {
                        records: [],
                        nutritionalValue: Math.round(dinnerNutritionalValue * 0.39),
                    },
                    nutritionalValue: Math.round(dinnerNutritionalValue),
                };
                plan.save()
                .then((plan) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(plan);
                }, (err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403; // oper not supported
        res.end('PUT operation not supported on /plans');
    })
    .delete((req, res, next) => {
        Plans.remove({})
            .then((resp) => {
                console.log('Plans Deleted!');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

planRouter.route('/:planId')
    .get((req, res, next) => {
        Plans.findById(req.params.planId)
            .then((plan) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(plan);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403; // oper not supported
        res.end('POST operation not supported on /plans/' + req.params.planId);
    })
    .put((req, res, next) => {
        res.statusCode = 403; // oper not supported
        res.end('PUT operation not supported on /plans/' + req.params.planId);
    })
    .delete((req, res, next) => {
        Plans.findOneAndDelete({ _id: req.params.planId })
            .then((resp) => {
                console.log('Plan Deleted!');
                Plans.find({})
                    .then((plans) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(plans); 
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    });

planRouter.route('/:planId/records')
    .get((req, res, next) => {
        Plans.findById(req.params.planId)
            .then((plan) => {
                if (plan != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(plan.records);
                } else {
                    err = new Error('Plan ' + req.params.planId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Plans.findById(req.params.planId)
            .then((plan) => {
                if (plan != null) {
                    if (req.body.date) {
                        plan['records'].push({date: req.body.date, records: {}});

                        const indexOfNewRecord = plan['records'].length - 1;

                        const breakfastAndLunchNutritionalValue = plan['fullPlanNutritionalValue'] * 0.3721;
                        const dinnerNutritionalValue = plan['fullPlanNutritionalValue'] * 0.2558;

                        plan['records'][indexOfNewRecord]['records']['breakfast'] = {
                            protein: {
                                records: [],
                                nutritionalValue: Math.round(breakfastAndLunchNutritionalValue * 0.42),
                            },
                            fat: {
                                records: [],
                                nutritionalValue: Math.round(breakfastAndLunchNutritionalValue * 0.22),
                            },
                            carbohydrates: {
                                records: [],
                                nutritionalValue: Math.round(breakfastAndLunchNutritionalValue * 0.36),
                            },
                            nutritionalValue: Math.round(breakfastAndLunchNutritionalValue),
                        };

                        plan['records'][indexOfNewRecord]['records']['lunch'] = {
                            protein: {
                                records: [],
                                nutritionalValue: Math.round(breakfastAndLunchNutritionalValue * 0.42),
                            },
                            fat: {
                                records: [],
                                nutritionalValue: Math.round(breakfastAndLunchNutritionalValue * 0.22),
                            },
                            carbohydrates: {
                                records: [],
                                nutritionalValue: Math.round(breakfastAndLunchNutritionalValue * 0.36),
                            },
                            nutritionalValue: Math.round(breakfastAndLunchNutritionalValue),
                        };

                        plan['records'][indexOfNewRecord]['records']['dinner'] = {
                            protein: {
                                records: [],
                                nutritionalValue: Math.round(dinnerNutritionalValue * 0.61),
                            },
                            carbohydrates: {
                                records: [],
                                nutritionalValue: Math.round(dinnerNutritionalValue * 0.39),
                            },
                            utritionalValue: Math.round(dinnerNutritionalValue),
                        };
                        plan.save()
                            .then((plan) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(plan.records);
                            }, (err) => next(err));
                    } else {
                        err = new Error('Date not provided');
                        err.statusCode = 404;
                        return next(err);
                    }
                } else {
                    err = new Error('Plan ' + req.params.planId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403; // oper not supported
        res.end('PUT operation not supported on /plans/' + req.params.planId + '/records');
    })
    .delete((req, res, next) => {
        Plans.findById(req.params.planId)
            .then((plan) => {
                if (plan != null) {
                    if (req.body.recordId) {
                        const indexOfRecordToDelete = plan.records.findIndex(record => {
                            return record['_id'] == req.body.recordId;
                        });

                        if (indexOfRecordToDelete !== -1) {
                            plan.records.splice(indexOfRecordToDelete, 1);
                        }

                        plan.save()
                            .then((plan) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(plan.records);
                            }, (err) => next(err));
                    } else {
                        err = new Error('ID not provided');
                        err.statusCode = 404;
                        return next(err);
                    }
                } else {
                    err = new Error('Plan ' + req.params.planId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

planRouter.route('/:planId/records/:recordId')
    .get((req, res, next) => {
        Plans.findById(req.params.planId)
            .then((plan) => {
                if (plan != null && plan.records.filter(record => record['_id'] == req.params.recordId)[0] != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(plan.records.filter(record => record['_id'] == req.params.recordId)[0]);
                } else if (plan == null) {
                    err = new Error('Plan ' + req.params.planId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                } else {
                    err = new Error('Record ' + req.params.recordId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Plans.findById(req.params.planId)
            .then((plan) => {
                if (plan != null && plan.records.filter(record => record['_id'] == req.params.recordId)[0] != null) {
                    const meal = req.body.meal;
                    const sectionName = req.body.sectionName;
                    const nutritionalValue = req.body.nutritionalValue;
                    const selectedRecord = plan.records.filter(record => record['_id'] == req.params.recordId)[0];

                    if (meal && sectionName && req.body.name && nutritionalValue && 
                        selectedRecord['records'][meal] && selectedRecord['records'][meal][sectionName]) {
                            selectedRecord['records'][meal][sectionName]['records'].push({
                                name: req.body.name,
                                checked: false,
                                nutritionalValue: Math.round(Number(nutritionalValue)),
                                fullValue: Math.round((selectedRecord['records'][meal][sectionName]['nutritionalValue'] / Number(nutritionalValue)) * 100),
                                left: Math.round((selectedRecord['records'][meal][sectionName]['nutritionalValue'] / Number(nutritionalValue)) * 100),
                                eaten: 0,
                            });
                    }
                    plan.save()
                        .then((plan) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(plan.records);
                        }, (err) => next(err));
                } else if (plan == null) {
                    err = new Error('Plan ' + req.params.planId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                } else {
                    err = new Error('Record ' + req.params.recordId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        Plans.findById(req.params.planId)
            .then((plan) => {
                if (plan != null && plan.records.filter(record => record['_id'] == req.params.recordId)[0] != null) {
                    const selectedRecord = plan.records.filter(record => record['_id'] == req.params.recordId)[0];
                    if (req.body.records) {
                        selectedRecord['records'] = req.body.records;
                    }
                    plan.save()
                        .then((plan) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(plan.records);
                        }, (err) => next(err));
                } else if (plan == null) {
                    err = new Error('Plan ' + req.params.planId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                } else {
                    err = new Error('Record ' + req.params.recordId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Plans.findById(req.params.planId)
            .then((plan) => {
                if (plan != null && plan.records.filter(record => record['_id'] == req.params.recordId)[0] != null) {
                    const meal = req.body.meal;
                    const sectionName = req.body.sectionName;
                    const productId = req.body.productId;
                    const selectedRecord = plan.records.filter(record => record['_id'] == req.params.recordId)[0];

                    if (meal && sectionName && productId && selectedRecord['records'][meal] && selectedRecord['records'][meal][sectionName]) {
                            selectedRecord['records'][meal][sectionName]['records'] = 
                                selectedRecord['records'][meal][sectionName]['records'].filter(product => {
                                    return product['_id'] != productId;
                                });
                    }
                    plan.save()
                        .then((plan) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(plan.records);
                        }, (err) => next(err));
                } else if (plan == null) {
                    err = new Error('Plan ' + req.params.planId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                } else {
                    err = new Error('Record ' + req.params.recordId + ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = planRouter;