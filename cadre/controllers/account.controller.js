import accountModel from "../models/account.model.js";

const accountController = {
    getAllAccounts: async (req, res) => {
        try {
            const accounts = await accountModel.find();
            res.status(200).json({
                status: "success",
                results: accounts.length,
                data: {
                    accounts,
                },
            });
        } catch (err) {
            res.status(404).json({
                status: "fail",
                message: err,
            });
        }
    },

    getById: async (req, res) => {
        try {
            const account = await accountModel.findById(req.params.id);
            res.status(200).json({
                status: "success",
                data: {
                    account,
                },
            });
        } catch (err) {
            res.status(404).json({
                status: "fail",
                message: err,
            });
        }
    },

    createAccount: async (req, res) => {
        try {
            const newAccount = await accountModel.create(req.query);
            console.log(newAccount);
            res.status(201).json({
                status: "success",
                data: {
                    account: newAccount,
                },
            });
        } catch (err) {
            res.status(400).json({
                status: "fail",
                message: err,
            });
        }
    },

    updateAccount: async (req, res) => {
        try {
            const account = await accountModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.status(200).json({
                status: "success",
                data: {
                    account,
                },
            });
        } catch (err) {
            res.status(400).json({
                status: "fail",
                message: err,
            });
        }
    },

    deleteAccount: async (req, res) => {
        try {
            await accountModel.findByIdAndDelete(req.params.id);
            res.status(204).json({
                status: "success",
                data: null,
            });
        } catch (err) {
            res.status(400).json({
                status: "fail",
                message: err,
            });
        }
    },
};

export { accountController };