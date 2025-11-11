import ErrorBoundary from "./ErrorBoundary"
import { Titlebar } from "./Titlebar"
import { ErrorPage } from "./ErrorPage"

export function PrimaryDisplay() {

    return (
        // eslint-disable-next-line react/no-children-prop
        <ErrorBoundary children fallback={ErrorPage}>
            <div className="wrapper">
                <Titlebar />
                <div className="wrapper"></div>
            </div>
        </ErrorBoundary>
    )
}
