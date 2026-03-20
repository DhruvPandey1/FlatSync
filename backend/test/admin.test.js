const request=require('supertest');
const express=require('express');
const adminRoutes=require('../routes/adminRoutes');

const app=express();

app.use(express.json());
app.use('/api/admin',adminRoutes);


describe('Admin Portal Logic',()=>{
    test('Should block non-admin users from dashboard',async()=>{
        const res=await request(app)
        .get('/api/admin/dashboard')
        .set('x-role','RESIDENT');

        expect(res.statusCode).toEqual(403);
    });

    test('Should allow admin to see dashboard stats',async()=>{
        const res=await request(app)
        .get('/api/admin/dashboard')
        .set('x-role','ADMIN');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('total_flats');
    });
});