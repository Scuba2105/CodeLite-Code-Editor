export function ErrorPage({errorType}) {

    return (
        <div className="wrapper">
            <div className="error-container flex-c">
                {errorType === "fetch-error" && <div className="error-description flex-c-col">
                    <h1 className="error-heading">App is currently unavailable</h1>
                    <p className="error-message1">Unable to retrieve data</p>
                    <p className="error-message2">Please try again. If the issue persists contact an Administrator</p>
                </div>}
                {errorType === "render-error" && <div className="error-description flex-c-col">
                    <h1 className="error-heading">Oops....</h1>
                    <p className="error-heading error-subheading">Unexpected error occurred.</p>
                    <p className="error-message2">Please restart the application. If the problem persists contact an Administrator.</p>
                </div>}
            </div>
        </div>
    )
}