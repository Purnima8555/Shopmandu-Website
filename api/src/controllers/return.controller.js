import returnService from "../services/return.service.js";

class ReturnController {
    async createReturnRequest(req, res, next) {
        try {
            const result = await returnService.createReturnRequest(
                req.user._id,
                req.body,
                req.files
            );

            res.status(201).json({
                success: true,
                message: "Return request created",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }

    async getCustomerRequests(req, res, next) {
        try {
            const result = await returnService.getCustomerRequests(
                req.user._id
            );

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }

    async getVendorRequests(req, res, next) {
        try {
            const result = await returnService.getVendorRequests(
                req.user._id
            );

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }

    async approveRequest(req, res, next) {
        try {
            const result = await returnService.approveRequest(
                req.params.id,
                req.user._id
            );

            res.status(200).json({
                success: true,
                message: "Request approved",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }

    async rejectRequest(req, res, next) {
        try {
            const result = await returnService.rejectRequest(
                req.params.id,
                req.user._id
            );

            res.status(200).json({
                success: true,
                message: "Request rejected",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }

    async markReturned(req, res, next) {
        try {
            const result = await returnService.markReturned(
                req.params.id,
                req.user._id
            );

            res.status(200).json({
                success: true,
                message: "Marked as returned",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }

    async refundRequest(req, res, next) {
        try {
            const result = await returnService.refundRequest(
                req.params.id,
                req.user._id
            );

            res.status(200).json({
                success: true,
                message: "Refund processed",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new ReturnController();