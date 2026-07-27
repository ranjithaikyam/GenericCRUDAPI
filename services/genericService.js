
const pool = require("../db");

async function insertData(table, data) {

    const columns = Object.keys(data);
    const values = Object.values(data);

    const placeholders = values.map((_, index) => `$${index + 1}`);

    const query = `
        INSERT INTO ${table}
        (${columns.join(",")})
        VALUES
        (${placeholders.join(",")})
        RETURNING *;
    `;

    const result = await pool.query(query, values);

    return result.rows[0];
}

async function selectData(
    table,
    columns = [],
    filters = [],
    orderBy = {}
) {

    const selectedColumns =
        columns.length
            ? columns.join(", ")
            : "*";

    let query = `SELECT ${selectedColumns} FROM ${table}`;

    const values = [];
    const conditions = [];

    filters.forEach(filter => {

        const {
            column,
            operator,
            value
        } = filter;

        switch (operator.toUpperCase()) {

            case "=":
            case "!=":
            case ">":
            case "<":
            case ">=":
            case "<=":

                values.push(value);

                conditions.push(
                    `${column} ${operator} $${values.length}`
                );

                break;

            case "LIKE":

                values.push(value);

                conditions.push(
                    `${column} LIKE $${values.length}`
                );

                break;

            case "ILIKE":

                values.push(value);

                conditions.push(
                    `${column} ILIKE $${values.length}`
                );

                break;

            case "IN":

                const placeholders = value.map(v => {

                    values.push(v);

                    return `$${values.length}`;

                });

                conditions.push(
                    `${column} IN (${placeholders.join(",")})`
                );

                break;

            case "BETWEEN":

                values.push(value[0]);
                values.push(value[1]);

                conditions.push(
                    `${column} BETWEEN $${values.length - 1} AND $${values.length}`
                );

                break;

            case "IS NULL":

                conditions.push(
                    `${column} IS NULL`
                );

                break;

            case "IS NOT NULL":

                conditions.push(
                    `${column} IS NOT NULL`
                );

                break;

            default:

                throw new Error(`Unsupported operator: ${operator}`);

        }

    });

    if (conditions.length) {

        query += ` WHERE ${conditions.join(" AND ")}`;

    }

    if (orderBy.column) {

        query += ` ORDER BY ${orderBy.column} ${orderBy.direction || "ASC"}`;

    }

    console.log(query);
    console.log(values);

    const result = await pool.query(query, values);

    return result.rows;

}

async function updateData(table, data, where) {

    const updateColumns = Object.keys(data);
    const updateValues = Object.values(data);

    const whereColumns = Object.keys(where);
    const whereValues = Object.values(where);

    const setClause = updateColumns.map((column, index) => {
        return `${column} = $${index + 1}`;
    });

    const whereClause = whereColumns.map((column, index) => {
        return `${column} = $${updateValues.length + index + 1}`;
    });

    const query = `
        UPDATE ${table}
        SET ${setClause.join(", ")}
        WHERE ${whereClause.join(" AND ")}
        RETURNING *;
    `;

    const values = [...updateValues, ...whereValues];

    const result = await pool.query(query, values);

    return result.rows;
}

async function deleteData(table, where) {

    const whereColumns = Object.keys(where);
    const whereValues = Object.values(where);

    const whereClause = whereColumns.map((column, index) => {
        return `${column} = $${index + 1}`;
    });

    const query = `
        DELETE FROM ${table}
        WHERE ${whereClause.join(" AND ")}
        RETURNING *;
    `;

    const result = await pool.query(query, whereValues);

    return result.rows;
}

module.exports = {
    insertData,
    selectData,
    updateData,
    deleteData
};