



import Address from "../models/Address.model.js";
import { BadRequestError, NotFoundError, ForbiddenError } from "../utils/AppError.js";

// ─── Get all addresses for the logged-in user ─────────────────────────────────
export const getAddressesService = async (userId) => {
  return await Address.find({ user_id: userId }).sort({ isDefault: -1, createdAt: -1 });
};

// ─── Get a single address by ID ───────────────────────────────────────────────
export const getAddressByIdService = async (addressId, userId) => {
  const address = await Address.findById(addressId);

  if (!address) throw new NotFoundError("Address not found.");

  // Users can only view their own addresses
  if (address.user_id.toString() !== userId.toString()) {
    throw new ForbiddenError("Access denied.");
  }

  return address;
};

// ─── Add a new address ────────────────────────────────────────────────────────
export const addAddressService = async (userId, data) => {
  // If this address is marked as default, unset the current default first
  if (data.isDefault) {
    await Address.updateMany({ user_id: userId }, { isDefault: false });
  }

  // If this is the user's very first address, make it default automatically
  const count = await Address.countDocuments({ user_id: userId });
  if (count === 0) data.isDefault = true;

  /// limit user add max 12 address
  if(count > 11){
    throw new BadRequestError("You can't add more then 12 address.")
  }

  const address = await Address.create({ user_id: userId, ...data });
  return address;
};

// ─── Update an existing address ───────────────────────────────────────────────
export const updateAddressService = async (addressId, userId, data) => {
  const address = await Address.findById(addressId);

  if (!address) throw new NotFoundError("Address not found.");

  if (address.user_id.toString() !== userId.toString()) {
    throw new ForbiddenError("Access denied.");
  }

  // If updating to default, unset all others first
  if (data.isDefault) {
    await Address.updateMany({ user_id: userId }, { isDefault: false });
  }

  Object.assign(address, data);
  await address.save();

  return address;
};

// ─── Delete an address ────────────────────────────────────────────────────────
export const deleteAddressService = async (addressId, userId) => {
  const address = await Address.findById(addressId);

  if (!address) throw new NotFoundError("Address not found.");

  if (address.user_id.toString() !== userId.toString()) {
    throw new ForbiddenError("Access denied.");
  }

  await address.deleteOne();

  // If the deleted address was the default, promote the most recent one
  if (address.isDefault) {
    const next = await Address.findOne({ user_id: userId }).sort({ createdAt: -1 });
    if (next) {
      next.isDefault = true;
      await next.save();
    }
  }

  return { message: "Address deleted successfully." };
};
