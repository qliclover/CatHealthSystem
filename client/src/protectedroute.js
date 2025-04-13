import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./layout";
import { useEffect, useState } from "react";

const API_URL = 'https://cathealthsystem.vercel.app';

// Check authentication status by making an API request
const checkAuthStatus = async () => {
    try {
        // Try to access a protected endpoint
        const response = await fetch(`${API_URL}/api/cats`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // If we get a 401, we're not authenticated
        if (response.status === 401) {
            return false;
        }
        
        // If we get a 200, we're authenticated
        if (response.ok) {
            return true;
        }
        
        // For any other status, we'll assume not authenticated
        return false;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
};

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            const isAuth = await checkAuthStatus();
            setIsAuthenticated(isAuth);
            if (!isAuth) {
                console.log('not authenticated');
                navigate('/login');
            } else {
                // If authenticated, make sure we're on the cats page
                if (window.location.pathname === '/') {
                    navigate('/cats');
                }
            }
            setIsChecking(false);
        };

        verifyAuth();
    }, [navigate]);

    if (isChecking) return null;

    return isAuthenticated ? (
        <Layout>
            {children}
        </Layout>
    ) : null;
};

export default ProtectedRoute;