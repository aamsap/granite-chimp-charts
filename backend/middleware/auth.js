/**
 * Authentication middleware for paid features
 * In a real application, this would integrate with your authentication system
 */

/**
 * Check if user has access to pro features
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
export function requireProAccess(req, res, next) {
    const userPlan = req.headers['x-user-plan'] || req.body.userPlan || req.query.userPlan || 'free';

    if (userPlan !== 'pro') {
        return res.status(403).json({
            error: 'Pro access required',
            message: 'This feature is only available for Pro users. Please upgrade your plan.',
            upgradeUrl: '/pricing'
        });
    }

    req.userPlan = userPlan;
    next();
}

/**
 * Check if user has access to feature based on plan
 * @param {string} feature - Feature name
 * @returns {Function} Express middleware
 */
export function requireFeatureAccess(feature) {
    return (req, res, next) => {
        const userPlan = req.headers['x-user-plan'] || req.body.userPlan || req.query.userPlan || 'free';

        const featureAccess = {
            'unlimited_rows': ['pro'],
            'custom_titles': ['pro'],
            'multiple_pages': ['pro'],
            'theme_selection': ['pro'],
            'visualization_selection': ['pro'],
            'advanced_templates': ['pro'],
            'priority_support': ['pro']
        };

        const allowedPlans = featureAccess[feature] || ['free', 'pro'];

        if (!allowedPlans.includes(userPlan)) {
            return res.status(403).json({
                error: 'Feature access denied',
                message: `The ${feature} feature is not available for ${userPlan} users.`,
                upgradeUrl: '/pricing',
                feature: feature
            });
        }

        req.userPlan = userPlan;
        next();
    };
}

/**
 * Rate limiting based on user plan
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
export function planBasedRateLimit(req, res, next) {
    const userPlan = req.headers['x-user-plan'] || req.body.userPlan || req.query.userPlan || 'free';

    // Set rate limits based on plan
    const rateLimits = {
        free: {
            requestsPerHour: 10,
            requestsPerDay: 50
        },
        pro: {
            requestsPerHour: 100,
            requestsPerDay: 1000
        }
    };

    const limits = rateLimits[userPlan] || rateLimits.free;

    // In a real application, you would implement actual rate limiting logic here
    // For now, we'll just add the limits to the request object
    req.rateLimits = limits;

    next();
}

/**
 * Validate user session (placeholder for real authentication)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
export function validateUserSession(req, res, next) {
    // In a real application, this would validate JWT tokens, session cookies, etc.
    // For now, we'll simulate a valid user session

    const userId = req.headers['x-user-id'] || 'demo-user';
    const userPlan = req.headers['x-user-plan'] || 'free';

    req.user = {
        id: userId,
        plan: userPlan,
        email: `${userId}@example.com`,
        isAuthenticated: true
    };

    next();
}
