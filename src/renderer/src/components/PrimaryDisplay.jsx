import ErrorBoundary from "./ErrorBoundary"
import { Titlebar } from "./Titlebar"
import { Menu } from "./Menu"
import { MainArea } from "./MainArea"
import { LoadingPage } from "./LoadingPage"
import { ErrorPage } from "./ErrorPage"
import { useState, useEffect } from "react"

export function PrimaryDisplay({client}) {

    const [page, setPage] = useState('staff');
    const [minDelayComplete, setMinDelayComplete] = useState(false);

    // Update the page selected when a new page in the menu is selected
    function onPageSelect(page) {
        setPage(page);
    }

    // Set a timeout for the 2s minimum time to show the welcome screen. 
    useEffect(() => {
        const initiateTimeDelay = setTimeout(() => {
            setMinDelayComplete(true);
        }, 2000);

        return () => {
            clearTimeout(initiateTimeDelay);
        }
    })

    if (!minDelayComplete) {
        return (
            <LoadingPage welcome={true}></LoadingPage> 
        )
    }

    if (minDelayComplete) {
        return (
            <ErrorBoundary children fallback={ErrorPage}>
                <div className="wrapper">
                    <Titlebar />
                    <Menu page={page} onPageSelect={onPageSelect} />
                    <MainArea page={page} client={client} />
                </div>
            </ErrorBoundary>
        )
    }
}