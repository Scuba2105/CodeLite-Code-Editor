import icon from '../assets/app-logo-img-only.jpg'

export function Titlebar() {
  return (
    <div className="titlebar centred">
      <img className="app-icon" src={icon} alt="app-icon"></img>
      <h1 className="app-title roboto-logo-font">CodeLite</h1>
      <menu className="main-menu centred">
        <li className="menu-option centred">File</li>
        <li className="menu-option centred">Edit</li>
        <li className="menu-option centred">Selection</li>
        <li className="menu-option centred">View</li>
        <li className="menu-option centred">Run</li>
        <li className="menu-option centred">Terminal</li>
      </menu>
    </div>
  )
}
