const request=require('supertest');
const app=require('../server');

describe('Admin CRUD and Payment Logic',()=>{
    test('Should add a new flat successfully ',async()=>{
        const newFlat={
            flat_number:'505',
            wing:'C',
            owner_id:'9d525dee-f856-400d-a08a-42a08d2fc803',
            type_id:1
        };

        const res=await request(app)
        .post('/api/admin/add-flats')
        .set('x-role','ADMIN')
        .send(newFlat);
        expect(res.statusCode).toEqual(201);
        expect(res.body.flat_number).toBe('505');
    });

    test('Should record a manual cash payment',async()=>{
        const res=await request(app)
        .post('/api/admin/manual-payment')
        .set('x-role','ADMIN')
        .send({
            record_id:'5910b904-5bca-405e-9968-d602c58ac146',
            amount_paid:1500,
            method:'CASH'
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('recorded');
    })
})