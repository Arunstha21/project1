'use client'
import { useEffect, useState } from "react";
import PaymentStudent from "./_component/student";
import PaymentAdmin from "./_component/admin";

export default function Payment(){
    const [user, setUser] = useState();
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
                    setUser(profileData);
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
            {user?.role === "student" ? (
                <PaymentStudent />
            ) : (
                <PaymentAdmin />
            )}
        </div>
    );
}