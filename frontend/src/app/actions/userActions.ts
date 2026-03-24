"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateProfile(formData:FormData,intialData:any) {
    const cookieStore=await cookies();
    const token = cookieStore.get('token')?.value;

    const email=formData.get('email')||intialData.email;
    const full_name=formData.get('name') || intialData.full_name;
    const password=formData.get('password') || intialData.password;

    try{
        const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body:JSON.stringify({email,password,full_name})
        });

        if(!res.ok) {
            let errMsg = "Failed to update profile";
            try {
                const errorData = await res.json();
                if (errorData.error) errMsg = errorData.error;
                else if (errorData.message) errMsg = errorData.message;
            } catch (e) {}
            return { success: false, error: errMsg };
        }

        revalidatePath('/profile');

        return {success:true};
    }
    catch(err){
        return {success:false,error:"Server connection failed"};
    }
}