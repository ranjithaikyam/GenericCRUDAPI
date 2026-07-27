const genericService = require("../services/genericService");

console.log("Service:", genericService);

async function insertData(req, res) {
    try {

        const { table, data } = req.body;

        if (!table || !data) {
            return res.status(400).json({
                success: false,
                message: "table and data are required"
            });
        }

        const result = await genericService.insertData(table, data);

        res.status(201).json({
            success: true,
            message: "Data inserted successfully",
            data: result
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function selectData(req, res) {

    try {

        const {
            table,
            columns,
            filters,
            orderBy
        } = req.body;

        if (!table) {
            return res.status(400).json({
                success: false,
                message: "table is required"
            });
        }

        const result = await genericService.selectData(
            table,
            columns,
            filters,
            orderBy
        );

        res.json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

async function updateData(req, res) {
    try {

        const { table, data, where } = req.body;

        if (!table || !data || !where) {
            return res.status(400).json({
                success: false,
                message: "table, data and where are required"
            });
        }

        const result = await genericService.updateData(table, data, where);

        res.status(200).json({
            success: true,
            message: "Data updated successfully",
            data: result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

async function deleteData(req, res) {
    try {

        const { table, where } = req.body;

        if (!table || !where) {
            return res.status(400).json({
                success: false,
                message: "table and where are required"
            });
        }

        const result = await genericService.deleteData(table, where);

        res.status(200).json({
            success: true,
            message: "Data deleted successfully",
            data: result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

module.exports = {
    insertData,
    selectData,
    updateData,
    deleteData
};