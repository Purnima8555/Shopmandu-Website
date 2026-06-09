

export const kycRejectTemplate = (reason) => ` 
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #dc2626;"> KYC Verification Rejected </h2> 
                <p> Dear User, </p> 
                <p> We reviewed your submitted KYC documents, but unfortunately your verification request has been rejected. </p> 
                <p> <strong>Reason:</strong> ${reason} </p> 
                <p> Please review and resubmit the correct documents again. </p> 
                <p> Regards,<br/> ShopMandu Team </p> 
                </div> 
                       
                `

export const kycApproveTemplate = ()=> `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #16a34a;">
                KYC Verification Successful
            </h2>
            <p>
                Dear User,
            </p>
            <p>Congratulations! Your KYC and business verification process has been completed successfully.</p>
            <p>Your vendor account is now active on <strong>ShopMandu</strong>. </p>
            <p>You can now start listing products, manage your store, and sell products on our platform.</p>
            <p>Thank you for choosing ShopMandu.</p>
            <p>Regards,<br />ShopMandu Team</p>
          </div>
`