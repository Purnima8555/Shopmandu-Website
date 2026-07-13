
import { BadRequestError } from "./AppError.js";

const buildDateFilter = (query = {}) => {
    const filter = {};
    let period = "Lifetime";

    if (query.month || query.year) {
        if (!query.month || !query.year) {
            throw new BadRequestError("Both month and year are required.");
        }

        const month = Number(query.month);
        const year = Number(query.year);

        if (!Number.isInteger(month) || month < 1 || month > 12) {
            throw new BadRequestError("Month must be between 1 and 12.");
        }

        const current = new Date();

        if (
            !Number.isInteger(year) ||
            year < 2020 ||
            year > current.getFullYear()
        ) {
            throw new BadRequestError("Invalid year.");
        }

        if (year === current.getFullYear() && month > current.getMonth() + 1) {
            throw new BadRequestError("Future dates are not allowed.");
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        filter.createdAt = {
            $gte: startDate,
            $lt: endDate,
        };

        period = `${month}/${year}`;
    }

    return { filter, period };
};

export default buildDateFilter;
