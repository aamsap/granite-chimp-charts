import Joi from 'joi';

/**
 * Validate request data using Joi schemas
 * @param {Object} schema - Joi schema
 * @param {string} property - Request property to validate (body, query, params)
 * @returns {Function} Express middleware
 */
export function validateRequest(schema, property = 'body') {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true
        });

        if (error) {
            const errorDetails = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value
            }));

            return res.status(400).json({
                error: 'Validation failed',
                message: 'Request data is invalid',
                details: errorDetails
            });
        }

        req[property] = value;
        next();
    };
}

// Common validation schemas
export const schemas = {
    fileUpload: Joi.object({
        file: Joi.any().required()
    }),

    fileId: Joi.object({
        fileId: Joi.string().required()
    }),

    analysis: Joi.object({
        fileId: Joi.string().required(),
        userPlan: Joi.string().valid('free', 'pro').default('free')
    }),

    dashboard: Joi.object({
        fileId: Joi.string().required(),
        analysis: Joi.object().required(),
        kpis: Joi.array().default([]),
        visualizations: Joi.array().default([]),
        userPlan: Joi.string().valid('free', 'pro').default('free'),
        customTitle: Joi.string().optional(),
        customDescription: Joi.string().optional(),
        theme: Joi.string().default('default')
    }),

    pdf: Joi.object({
        dashboard: Joi.object().required(),
        options: Joi.object({
            format: Joi.string().valid('A4', 'A3', 'Letter').default('A4'),
            orientation: Joi.string().valid('portrait', 'landscape').default('portrait'),
            margin: Joi.object().default({}),
            displayHeaderFooter: Joi.boolean().default(true),
            printBackground: Joi.boolean().default(true)
        }).default({})
    }),

    userPlan: Joi.object({
        userPlan: Joi.string().valid('free', 'pro').required()
    })
};
