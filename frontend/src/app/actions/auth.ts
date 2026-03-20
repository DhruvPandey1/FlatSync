"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData:FormData){
    const email= formData.get('email');
    const password=formData.get('password');
    const loginType=formData.get('loginType');
    let res:any;
    if(loginType==="RESIDENT"){
        console.log("Executed Resident")
        res= await fetch('http://localhost:5000/api/auth/login',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({email,password}),
        });
    }
    if(loginType==="ADMIN"){
        console.log("Executed Admin")
        res= await fetch('http://localhost:5000/api/googleAuth/callback',{
            method:'GET'
        });
    }
    console.log(res.cookie);
    const data=await res.json();
    console.log(data)
    if(!res.ok) return {error:data.error};

    const cookieStore=await cookies();

    cookieStore.set('session_id',data.user.id,{httpOnly:true,secure:true});
    cookieStore.set('user_role',data.user.role,{httpOnly:true,secure:true});
    // cookieStore.set('token',data.)

    if(data.user.role==='ADMIN'){
        redirect('/admin/dashboard');
    }
    else{
        redirect('/dashboard');
    }
}


export async function logoutAction() {
    const cookieStore=await cookies();
    cookieStore.delete('session_id');
    cookieStore.delete('user_role');
    redirect('/login');
}