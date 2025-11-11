import { StaffSummary } from "./staff-summary/StaffSummary";

export function MainArea({page, queryClient}) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    return (
        <div key={page} className="main-area">
            {page === "technical-info" ? 
            <>
               <StaffSummary></StaffSummary> 
            </> :
            page === "staff" ?
            <>
                <h1>Staff Information</h1>
            </> :
                <h1>Unknown Page</h1>}
        </div>
    );
} 
