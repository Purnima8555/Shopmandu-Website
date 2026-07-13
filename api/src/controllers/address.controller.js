import * as addressService from "../services/address.service.js";

// GET /address — get all addresses for the logged-in user
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAddressesService(req.user._id);
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

// GET /address/:id — get a single address
export const getAddressById = async (req, res, next) => {
  try {


    const address = await addressService.getAddressByIdService(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

// POST /address/add — add a new address
export const addAddress = async (req, res, next) => {
  try {
    const address = await addressService.addAddressService(req.user._id, req.body);
    res.status(201).json({ success: true, message: "Address added successfully.", data: address });
  } catch (error) {
    next(error);
  }
};

// PUT /address/update/:id — update an existing address
export const updateAddress = async (req, res, next) => {
  try {
    const address = await addressService.updateAddressService(req.params.id, req.user._id, req.body);
    res.status(200).json({ success: true, message: "Address updated successfully.", data: address });
  } catch (error) {
    next(error);
  }
};

// DELETE /address/delete/:id — delete an address
export const deleteAddress = async (req, res, next) => {
  try {
    const result = await addressService.deleteAddressService(req.params.id, req.user._id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};