import './App.css';
import { useState, useEffect } from 'react';
import { useQuery} from '@tanstack/react-query';
import { ErrorPage } from './components/ErrorPage';
import { LoadingPage } from './components/LoadingPage'
import { PrimaryDisplay } from './components/PrimaryDisplay';

/* Async function for fetching the application data */
async function fetchData() {
    try {
        // You can await here for the data to be returned.
        const appData = await renderer_api.GetAllData()
        return appData
    }
    catch (err) {
        throw new Error(err.message);
    }
}

export default function App({client}) {

    const [minDelayComplete, setMinDelayComplete] = useState(false);
    const { isLoading, error, data } = useQuery({queryKey: ['dataSource'], queryFn: () => fetchData()});

    // Set a timeout for the 3s minimum time to show the loading screen. 
    useEffect(() => {
        const initiateTimeDelay = setTimeout(() => {
            setMinDelayComplete(true);
        }, 3000);

        return () => {
            clearTimeout(initiateTimeDelay);
        }
    })
    
    // If is loading then show the loading page, or error page if error. Once data loaded, then show app.
    if (isLoading || !minDelayComplete) {
        return (
            <LoadingPage></LoadingPage> 
        )
    }
    
    if (error !== null) {
        return (
            <ErrorPage errorType="fetch-error"></ErrorPage>
        )
    }

    // If data retrieved and time delays complete then render the main app based on returned data.
    if (data) {
        return (
            <PrimaryDisplay client={client}></PrimaryDisplay> 
        )
    }
}
