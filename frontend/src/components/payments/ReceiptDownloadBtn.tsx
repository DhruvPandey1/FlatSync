"use client";

export default function ReceiptDownloadBtn({month}:{month:string}){
    const handleDownload =async ()=>{
        window.open(`http://localhost:5000/api/user/subscriptions/${month}/download`,'_blank');
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