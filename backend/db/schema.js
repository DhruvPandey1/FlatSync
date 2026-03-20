const db=require('./db');

const createTables=async()=>{
    const queryText=`
    DO $$ BEGIN
        CREATE TYPE user_role AS ENUM('ADMIN','RESIDENT');
        CREATE TYPE payment_status AS ENUM('PAID','PENDING');
        CREATE TYPE payment_method AS ENUM('CASH','UPI');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS users(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        full_name TEXT NOT NULL,
        role user_role NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS flat_types(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        monthly_rate DECIMAL(10,2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS flats(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        flat_number TEXT NOT NULL,
        wing TEXT NOT NULL,
        onwer_id UUID REFERENCES users(id),
        type_id INT REFERENCES flat_types(id),
        is_active BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS subscription_records(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        flat_id UUID REFERENCES flats(id),
        billing_month DATE NOT NULL,
        amount_due DECIMAL(10,2) NOT NULL,
        status payment_status DEFAULT 'PENDING'
    );

    CREATE TABLE IF NOT EXISTS payments(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        record_id UUID REFERENCES subscription_records(id),
        amount_paid DECIMAL(10,2) NOT NULL,
        method payment_method NOT NULL,
        transaction_id TEXT UNIQUE,
        paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_id UUID REFERENCES users(id),
        action_type TEXT NOT NULL,
        table_name TEXT NOT NULL,
        old_values JSONB,
        new_values JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   
    )
    `
    try {
        await db.query(queryText);
        console.log("table are created successfully");
    } catch (error) {
        console.log(error.message);
    }
}


createTables();