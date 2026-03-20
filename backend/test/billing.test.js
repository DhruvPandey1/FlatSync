const {generateMonthlyBills}=require('../utils/billingUtils');
const db=require('../db/db')

describe('Billing Utility Logic',()=>{
    test('Should generate records for all active flats',async ()=>{
        const month='2026-12-01';

        const result=await generateMonthlyBills(month);

        expect(result.success).toBe(true);

        expect(result.count).toBeGreaterThanOrEqual(20);

        const dbCheck = await db.query(
            'SELECT COUNT(*) FROM subscription_records WHERE billing_month=$1',
            [month]
        );

        expect(parseInt(dbCheck.rows[0].count)).toBe(result.count);
    });
});