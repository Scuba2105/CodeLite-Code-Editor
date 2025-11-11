import icon from "../assets/app-logo-img-only.jpg"

export function Titlebar({}) {
    return (
        <div className="titlebar flex-c">
            <img className="app-icon" src={icon} alt="app-icon"></img>
            <label className="app-title">HNECT Information Centre</label>
        </div>
    )
}
