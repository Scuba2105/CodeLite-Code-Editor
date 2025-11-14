import icon from '../assets/app-logo-img-only.jpg'

export function Titlebar() {
  return (
    <div className="titlebar centred">
      <img className="app-icon" src={icon} alt="app-icon"></img>
      <h1 className="app-title">CodeLite</h1>
      <button className="menu-option centred">File</button>
      <button className="menu-option centred">Edit</button>
      <button className="menu-option centred">Selection</button>
    </div>
  )
}
