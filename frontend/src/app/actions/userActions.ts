"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateProfile(formData:FormData,intialData:any) {
    const cookieStore=await cookies();
    // const userId=cookieStore.get('session_id')?.value;
    const userId="64e155fc-c947-48d7-9814-bbff912e1874"


    const email=formData.get('email')||intialData.email;
    const full_name=formData.get('name') || intialData.full_name;
    const password=formData.get('password') || intialData.password;
    console.log(full_name,email,password)

    try{
        const res=await fetch('http://localhost:5000/api/user/profile',{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'x-user-id':userId||''
            },
            body:JSON.stringify({email,password,full_name})
        });

        if(!res.ok) return{success:false,error:"Failed to update"};

        revalidatePath('/profile');

        return {success:true};
    }
    catch(err){
        return {success:false,error:"Server connection failed"};
    }
}