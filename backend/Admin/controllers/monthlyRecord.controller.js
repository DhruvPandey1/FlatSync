const db=require('../../db/db')

const getMonthlyRecords=async (req, res) => {
    const { month, year } = req.query;
    
    const query = `
        SELECT f.flat_number,u.full_name ,p.method,sr.status,p.paid_at,sr.amount_due
        FROM users u 
        JOIN flats f ON f.owner_id=u.id 
        LEFT JOIN subscription_records sr ON sr.flat_id=f.id
        LEFT JOIN payments p ON sr.id = p.record_id
        AND sr.billing_month::char = $1 AND sr.billing_month::char = $2
    `;
    const result = await db.query(query, [month, year]);
    res.json(result.rows);
}

const exportReport=async (req, res) => {
    const { type, month, year } = req.query;
    const data = await db.query('SELECT * FROM payments WHERE month=$1 AND year=$2', [month, year]);
    
    if (type === 'csv') {
        const csv = parse(data.rows);
        res.header('Content-Type', 'text/csv');
        res.attachment(`Report_${month}_${year}.csv`);
        return res.send(csv);
    }
}

module.exports={
    getMonthlyRecords,
    exportReport
}