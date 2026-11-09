export default function RetroIcon({ name, size = 40 }) {
  return (
    <img
      className="retro-icon"
      src={`/assets/retro/${name}.svg`}
      width={size}
      height={size}
      alt=""
      draggable="false"
    />
  );
}
