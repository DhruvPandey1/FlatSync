const db=require('../../db/db');
const PDFDocument=require('pdfkit');
const { getPaymentDetailsAllService } = require('../../db/services/payment.service');




const getPaymentDetails=async(req,res)=>{
    const {month,all}=req.query;
    const userId=req.user.id

    try{
        if(all==='true'){
            const amount=await getPaymentDetailsAllService(userId)
            res.json({total_amount:amount.rows[0].total_pending_debt});
        }

        else{
            const result=await db.query(
                `SELECT sr.*,p.amount_paid,p.method,p.transaction_id,p.paid_at
                FROM subscription_records sr
                JOIN flats f ON sr.flat_id=f.id
                LEFT JOIN payments p ON sr.id=p.record_id
                WHERE sr.billing_month=$1 AND f.owner_id=$2
                `,[month,userId]
            );

            res.json({total_amount:result.rows[0]?.amount_due});
        }
    }
    catch(err){
        res.status(500).json({error:err.message});
    }

}

const mockPayment = async (req, res) => {
    const { month, isCumulative } = req.body;
    const userId = req.user.id;

    const client = await db.connect();
    try {
        await client.query('BEGIN');
        
        let pendingRecords;
        if(isCumulative) {
            pendingRecords = await client.query(
                `SELECT sr.id, sr.amount_due FROM subscription_records sr JOIN flats f ON sr.flat_id = f.id WHERE f.owner_id = $1 AND sr.status = 'PENDING'`, 
                [userId]
            );
        } else {
            pendingRecords = await client.query(
                `SELECT sr.id, sr.amount_due FROM subscription_records sr JOIN flats f ON sr.flat_id = f.id WHERE f.owner_id = $1 AND sr.billing_month = $2 AND sr.status = 'PENDING'`, 
                [userId, month]
            );
        }

        const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random()*1000)}`;

        for (const record of pendingRecords.rows) {
            await client.query(
                `INSERT INTO payments (record_id, amount_paid, method, transaction_id) VALUES ($1, $2, 'UPI', $3)`,
                [record.id, record.amount_due, transactionId]
            );
            await client.query(
                `UPDATE subscription_records SET status = 'PAID' WHERE id = $1`,
                [record.id]
            );
        }

        await client.query('COMMIT');
        res.json({success: true, transactionId});
    } catch(err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({success: false, error: err.message});
    } finally {
        client.release();
    }
}

const downloadReceipt=async(req,res)=>{
    const month=req.params.id;
    const userId=req.user.id;
    try{
        const result=await db.query(`
            SELECT sr.*,u.full_name,u.email,f.flat_number,f.wing,p.transaction_id,p.amount_paid
            FROM payments p 
            JOIN subscription_records sr ON p.record_id=sr.id
            JOIN flats f ON sr.flat_id=f.id
            JOIN users u ON f.owner_id=u.id
            WHERE sr.billing_month=$1 AND u.id=$2
            `,[month,userId]
        );

        if(result.rows.length===0){
            return res.status(404).send("Receipt not found")
        }

        const data=result.rows[0];

        const doc=new PDFDocument({margin:50});
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));

        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="Receipt_${data.billing_month || 'receipt'}.pdf"`
            );
            res.setHeader('Content-Length', pdfData.length);

            res.send(pdfData);
        });


        doc.fillColor('#1e293b').fontSize(22).text('SOCIETY CONNECT',{align:'right'});
        doc.fontSize(10).fillColor('#64748b').text('Maintenance & Utility Receipt',{align:'right'});
        doc.moveDown(2);

        doc.rect(50,110,500,30).fill('#f1f5f9');
        doc.fillColor('#475569').fontSize(10).text('RECEIPT NO:',60,122);
        doc.fillColor('#0f172a').text(`#${data.id}`, 130, 122);
        doc.fillColor('#475569').text('DATE:', 380, 122);
        doc.fillColor('#0f172a').text(`${new Date().toLocaleDateString('en-IN')}`, 420, 122);

        doc.moveDown(4);
        const detailsTop = 160;
        doc.fillColor('#64748b').fontSize(10).text('RESIDENT DETAILS', 50, detailsTop);
        doc.fillColor('#0f172a').fontSize(12).text(data.full_name, 50, detailsTop + 15);
        doc.fontSize(10).text(`Email: ${data.email}`, 50, detailsTop + 30);

        doc.fillColor('#64748b').text('FLAT DETAILS', 350, detailsTop);
        doc.fillColor('#0f172a').fontSize(12).text(`Flat ${data.flat_number} - ${data.wing} Wing`, 350, detailsTop + 15);

        doc.moveDown(4);
        const tableTop = 240;
        doc.rect(50, tableTop, 500, 20).fill('#1e293b');
        doc.fillColor('#ffffff').text('Description', 60, tableTop + 6);
        doc.text('Billing Period', 250, tableTop + 6);
        doc.text('Amount', 480, tableTop + 6);

        const rowTop = tableTop + 30;
        doc.fillColor('#0f172a').fontSize(11).text('Monthly Maintenance Charges', 60, rowTop);
        doc.text(`${month}`, 250, rowTop);
        doc.text(`INR ${data.amount_paid}`, 480, rowTop);

        doc.moveTo(350, rowTop + 30).lineTo(550, rowTop + 30).stroke('#e2e8f0');
        doc.fontSize(13).text('Total Amount Paid', 350, rowTop + 45);
        doc.fillColor('#16a34a').text(`INR ${data.amount_paid}`, 480, rowTop + 45);

        doc.moveDown(6);
        doc.fillColor('#f8fafc').rect(50, doc.y, 500, 60).fill();
        doc.fillColor('#475569').fontSize(9).text('TRANSACTION DETAILS', 60, doc.y - 50);
        doc.fillColor('#1e293b').fontSize(10).text(`Status: ${data.status.toUpperCase()}`, 60, doc.y - 35);
        doc.text(`Payment ID: ${data.transaction_id || 'N/A'}`, 60, doc.y - 20);

        doc.moveDown(5);
        doc.fontSize(8).fillColor('#94a3b8').text('This is a digitally generated document. For any discrepancies, please contact the society office.', { align: 'center' });

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating PDF");
    }
}
module.exports={
    getPaymentDetails,
    mockPayment,
    downloadReceipt
}