'use client'
import { useEffect, useState } from "react";
import PaymentStudent from "./_component/student";
import AdminPaymentPage from "./_component/admin";

export default function Payment(){
    const [componentShow, setComponentShow] = useState();
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/users/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const profileData = await response.json();
                    setComponentShow(profileData?.role === "student" ? (
                        <PaymentStudent />
                    ) : (
                        <AdminPaymentPage />
                    ))
                } else {
                    console.error('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div>
            {componentShow}
        </div>
    );
}