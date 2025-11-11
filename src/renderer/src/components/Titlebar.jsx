import icon from '../assets/app-logo-img-only.jpg'

export function Titlebar() {
  return (
    <div className="titlebar flex-c">
      <img className="app-icon" src={icon} alt="app-icon"></img>
      <label className="menu-option">File</label>
      <label className="menu-option">Edit</label>
      <label className="menu-option">Selection</label>
    </div>
  )
}
