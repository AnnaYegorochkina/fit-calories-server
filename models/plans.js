const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
    },
    nutritionalValue: {
        type: Number,
    },
    left: {
        type: Number,
    },
    fullValue: {
        type: Number,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    eaten: {
        type: Number,
        default: 0,
    }
});

const nutritionalSubItemSchema = new Schema({
    records: {
        type: [ productSchema ],
        default: [],
    },
    nutritionalValue: {
        type: Number,
    },
});

const breakfastAndLunchSchema = new Schema({
    protein: {
        type: nutritionalSubItemSchema,
        default: {},
    },
    fat: {
        type: nutritionalSubItemSchema,
        default: {},
    }, 
    carbohydrates: {
        type: nutritionalSubItemSchema,
        default: {},
    },
    nutritionalValue: {
        type: Number,
    },
});

const dinnerSchema = new Schema({
    protein: {
        type: nutritionalSubItemSchema,
        default: {},
    },
    carbohydrates: {
        type: nutritionalSubItemSchema,
        default: {},
    },
    nutritionalValue: {
        type: Number,
    },
});

const mealSchema = new Schema({
    breakfast: {
        type: breakfastAndLunchSchema,
        default: {},
    },
    lunch: {
        type: breakfastAndLunchSchema,
        default: {},
    },
    dinner: {
        type: dinnerSchema,
        default: {},
    },
});

const dateSchema = new Schema({
    date: {
        type: String,
    },
    records: {
        type: mealSchema,
        default: {},
    }
});

const planSchema = new Schema({
    name: {
        type: String,
        required: true,
        //unique: true,
    },
    fullPlanNutritionalValue: {
        type: Number,
        required: true,
    },
    records: {
        type: [ dateSchema ],
        default: [],
    },
});

var Plans = mongoose.model('Plan', planSchema);

module.exports = Plans;