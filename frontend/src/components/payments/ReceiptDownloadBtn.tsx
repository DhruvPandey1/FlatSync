"use client";

export default function ReceiptDownloadBtn({month}:{month:string}){
    const handleDownload =async ()=>{
        // window.open(`${process.env.NEXT_PUBLIC_API_URL}/user/subscriptions/${month}/download`,'_blank');
        const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/subscriptions/${month}/download`,{
            method:"GET",
            credentials:"include"
        });

        const blob=await res.blob();
        const url=window.URL.createObjectURL(blob);

        const receipt=document.createElement("a");
        receipt.href=url;
        receipt.download=`receipt-${month}.pdf`;
        receipt.click();
    };

    return(
        <button
            onClick={handleDownload}
            style={{
                background:'none',
                border:'1px solid #2563eb',
                color:'#2563eb',
                padding:"6px 12px",
                borderRadius:"6px",
                cursor:'pointer',
                fontWeight:'600'
            }}
        >
            Download PDF
        </button>
    )
}