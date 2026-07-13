import Contact from "../models/contact.model.js";

/**
 * NOTE: This controller doesn't import a specific error class from
 * utils/AppError.js because I only saw NotFoundError referenced in
 * server.js. If you have a BadRequestError (or ValidationError) exported
 * from there, swap the manual `err.status = 400` blocks below for that
 * instead — it'll be more consistent with the rest of your codebase.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body || {};

    const errors = {};
    if (!name || !name.trim()) errors.name = "Name is required.";
    if (!email || !EMAIL_RE.test(email)) errors.email = "A valid email is required.";
    if (!phone || !phone.trim()) errors.phone = "Phone is required.";
    if (!message || !message.trim()) errors.message = "Message is required.";

    if (Object.keys(errors).length > 0) {
      const err = new Error("Validation failed");
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      err.details = errors;
      return next(err);
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent. We'll get back to you soon.",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/contact  (admin/vendor-dashboard use — list submissions)
export const getAllContacts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const status = req.query.status;

    const filter = status ? { status } : {};

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Contact.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/contact/:id/status  (mark as read/resolved)
export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!["new", "read", "resolved"].includes(status)) {
      const err = new Error("Invalid status value");
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      return next(err);
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      const err = new Error("Contact message not found");
      err.status = 404;
      err.code = "NOT_FOUND";
      return next(err);
    }

    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};
