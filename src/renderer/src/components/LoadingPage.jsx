import logo from "../assets/app-logo.jpg"

export function LoadingPage({welcome}) {

    return (
        <div className="wrapper">
            <div className="loading-page-container flex-c">
                <img className="app-logo" src={logo} alt="app-logo"></img>
                <h2 className="welcome-text">{!welcome ? "Starting Application. Please Wait..." : "Welcome Steven"}</h2>
            </div>
        </div>
    );
}