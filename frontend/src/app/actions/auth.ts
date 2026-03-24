"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData:FormData){
    const email= formData.get('email');
    const password=formData.get('password');
    const loginType=formData.get('loginType');
    try {
        const res= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/auth/login`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({email,password}),
        });
       
        const data=await res.json();
        if(!res.ok) return {error: data.error || data.message || "Invalid credentials"};

        const cookieStore=await cookies();
        cookieStore.set('token',data.token)
    } catch (err) {
        return {error: "Failed to connect to the authentication server."};
    }

    redirect('/dashboard')
}


export async function logoutAction() {
    const cookieStore=await cookies();
    cookieStore.delete('token');
    redirect('/login');
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_token');
    redirect('/admin/login');
}