import './App.css';
import { Titlebar } from './components/Titlebar';
import { ErrorBoundary } from './components/ErrorBoundary';
import ErrorPage from './components/ErrorPage';

export default function App() {
    return (
        // eslint-disable-next-line react/no-children-prop
        <ErrorBoundary children fallback={ErrorPage}>
            <div className="wrapper">
                <Titlebar />
            </div>
        </ErrorBoundary>
    )
}

